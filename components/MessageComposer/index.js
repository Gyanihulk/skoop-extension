import React, { useContext, useState } from 'react';
import { AiFillRobot } from 'react-icons/ai';
import { HiMiniGif } from 'react-icons/hi2';
import { GrSchedulePlay } from 'react-icons/gr';
import { MdVideoLibrary } from 'react-icons/md';
import { FaListAlt } from 'react-icons/fa';
import ChatGpt from '../Chatgpt/index.js';
import GiphyWindow from '../Gif/index.js';
import Library from '../Library/index.js';
import AI from '../Pre-Determined-Msg/index.js';
import { insertHtmlAtPositionInMail, insertIntoLinkedInMessageWindow } from '../../utils/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import MessageWindow from '../MessageWindow.jsx';
import MessageContext from '../../contexts/MessageContext.js';
import AuthContext from '../../contexts/AuthContext.js';
import ChatWindowSelection from '../ChatWindowSelection/index.js';
const MessageComposer = () => {
    const [state, setState] = useState({
        displayComp: 'DefaultCard',
    });

    const { isLinkedin, selectedChatWindows, focusedElementId, isProfilePage } =
        useContext(GlobalStatesContext);
    const { message, addMessage, setMessage } = useContext(MessageContext);
    const { getCalendarUrl } = useContext(AuthContext);
    const handleInsertion = (text) => {
        const newText = text + ' \n ';
        addMessage(newText);
        window.scrollTo(0, document.body.scrollHeight);
    };

    const componentDisplaySwitch = (input) => {
        setState({
            ...state,
            displayComp: input,
        });
    };

    const addMeetSchedulingLink = async () => {
        const url = await getCalendarUrl();
        if (isLinkedin) {
            handleInsertion(url);
            toast.success('Meeting Calendar link added successfully!');
        } else {
            handleInsertion(`<a href="${url}">Schedule Virtual Appointment</a>`);
            toast.success('Meeting Calendar link added successfully!');
        }
    };

    const handleIconClick = (eventKey) => {
        if (eventKey === 'ScheduleMeet') {
            addMeetSchedulingLink();
            return;
        }
        componentDisplaySwitch(eventKey);
    };

    const renderNavItem = (eventKey, icon, tooltipText) => (
        <li key={eventKey}>
            <a
                className={`px-1 ${state.displayComp === eventKey ? 'active' : ''}`}
                onClick={() => handleIconClick(eventKey)}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title={tooltipText}
            >
                {React.cloneElement(icon, { size: 20, color: '#FFFFFF' })}
                <span className="d-none d-sm-inline">{tooltipText}</span>
            </a>
        </li>
    );

    const handleOpenMessageWindow = () => {
        const clickMessageButton = () => {
            const btns = Array.from(document.querySelectorAll('div>div>div>button'));
            var selectedButton;
            btns.forEach((btn) => {
                const ariaLabel = btn.ariaLabel;
                if (ariaLabel != null && ariaLabel.includes('Message')) {
                    selectedButton = btn;
                }
            });
            selectedButton.click();
        };

        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const targetTab = tabs[0];
                if (targetTab) {
                    try {
                        chrome.scripting.executeScript({
                            target: { tabId: targetTab.id },
                            func: clickMessageButton,
                        });
                    } catch (err) {
                        console.log('some error occured in executing script', err);
                    }
                } else {
                    console.log('the target tab is not accessible');
                }
            });
        } catch (err) {
            console.log('some error occured while setting up initial array');
        }
    };
    const handleSend = () => {
        const clickSendButtons = (arr) => {
            const sendButtons = Array.from(
                document.getElementsByClassName('msg-form__send-button')
            );
            arr.forEach((item) => {
                const btn = sendButtons[item.index];
                btn.click();
            });
        };

        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const targetTab = tabs[0];
                if (targetTab) {
                    try {
                        chrome.scripting.executeScript({
                            target: { tabId: targetTab.id },
                            func: clickSendButtons,
                            args: [selectedChatWindows],
                        });
                    } catch (err) {
                        console.log('some error occured in executing script', err);
                    }
                } else {
                    console.log('the target tab is not accessible');
                }
            });
        } catch (err) {
            console.log('some error occured while setting up initial array');
        }
    };
    const handleInsertionToWebsite = async () => {
        if (isLinkedin) {
            if (selectedChatWindows?.length === 0) {
                toast.error('Please select a recipitent');
                return;
            }

            await insertIntoLinkedInMessageWindow(`<p>${message}</p>`, selectedChatWindows);
            setTimeout(() => {
                handleSend();
            }, 500);
            toast.success('Message Sent Successfully!!');
        } else {
            insertHtmlAtPositionInMail(message, focusedElementId);
        }
        if (selectedChatWindows?.length !== 0) {
            setMessage();
        }
    };
    return (
        <div id='footermessage' className=' w-full'>
       <ChatWindowSelection/>
            <MessageWindow />
            <div className="container mt-4">
                {state.displayComp === 'Chatgpt' && <ChatGpt appendToBody={handleInsertion} />}
                {state.displayComp === 'Giphy' && <GiphyWindow appendToBody={handleInsertion} />}
                {state.displayComp === 'Library' && <Library appendToBody={handleInsertion} />}
                {state.displayComp === 'AI' && <AI appendToBody={handleInsertion} />}

                {/* {!message && state.displayComp === 'DefaultCard' && (
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-center">Welcome to Skoop</h5>
                            <p className="card-text text-center">
                                This is your default view. You can switch between different tabs on
                                the Top to explore various features.
                                <br />
                                Explore the features and make the most out of your{' '}
                                {isLinkedin ? 'Chatting' : 'Email '} experience!
                            </p>
                        </div>
                    </div>
                )} */}
            </div>
            <nav className="navbar pe-3" id="messageFooter" >
                <div class="navbar-brand d-flex flex-row ps-2">
                    <ul className="nav">
                        {renderNavItem(
                            'Chatgpt',
                            <AiFillRobot />,
                            'Send Chatgpt responses to Mail'
                        )}
                        {renderNavItem('Giphy', <HiMiniGif />, 'Send your favorite GIFs to Mail')}
                        {renderNavItem(
                            'AI',
                            <FaListAlt />,
                            'Send predetermined custom message responses.'
                        )}
                        {renderNavItem(
                            'Library',
                            <MdVideoLibrary />,
                            'Send any recorded video or audio file'
                        )}
                        {renderNavItem(
                            'ScheduleMeet',
                            <GrSchedulePlay />,
                            'Send link to schedule virtual appointment.'
                        )}
                    </ul>
                </div>
                <div className="d-flex flex-row  align-items-right ">
                
         
                <button
                    className="btn send-button d-flex  align-items-center justify-content-center"
                    type="button"
                    onClick={handleInsertionToWebsite}
                >
                    Send
                </button>
     
                </div>
            </nav>
            {isProfilePage && (
                <div class="d-grid gap-2">
                    <button
                        class="btn btn-primary mt-3"
                        type="button"
                        onClick={handleOpenMessageWindow}
                    >
                        Message profile
                    </button>
                </div>
            )}
            
        </div>
    );
};

export default MessageComposer;
