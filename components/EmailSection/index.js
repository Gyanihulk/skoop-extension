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
import API_ENDPOINTS from '../apiConfig.js';
import { insertHtmlAtPositionInMail, insertIntoLinkedInMessageWindow } from '../../utils/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import { SiGooglemeet } from 'react-icons/si';
import MessageWindow from '../MessageWindow.jsx';
import MessageContext from '../../contexts/MessageContext.js';
const EmailComposer = () => {
    const [state, setState] = useState({
        displayComp: 'DefaultCard',
    });

    const { isLinkedin, selectedChatWindows, focusedElementId, isProfilePage } =
        useContext(GlobalStatesContext);
    const { message, addMessage } = useContext(MessageContext);
    const handleInsertion = (text) => {
        addMessage(text);

        if (isLinkedin) {
        } else {
        }
    };
 

    const componentDisplaySwitch = (input) => {
        setState({
            ...state,
            displayComp: input,
        });
    };

    const addMeetSchedulingLink = () => {
        if (isLinkedin) {
            handleInsertion(
                `${API_ENDPOINTS.skoopCalendarUrl}/?username=${JSON.parse(
                    localStorage.getItem('skoopUsername')
                )}`
            );
        } else {
            handleInsertion(
                `<a href="${API_ENDPOINTS.skoopCalendarUrl}/?username=${JSON.parse(
                    localStorage.getItem('skoopUsername')
                )}">Schedule Virtual Appointment</a>`
            );
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
        <li className="nav-item" key={eventKey}>
            <a
                className={`nav-link ${state.displayComp === eventKey ? 'active' : ''}`}
                onClick={() => handleIconClick(eventKey)}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title={tooltipText}
            >
                {React.cloneElement(icon, { size: 20 })}
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

    return (
        <div>
            {/* <div className="d-grid gap-2 col-10 mx-auto mt-4">
        <button
          className="btn btn-primary btn-block"
          onClick={addMeetSchedulingLink}
        >
          Schedule a Meet
        </button>
      </div> */}

            <ul className="nav nav-pills justify-content-center mt-2">
                {renderNavItem('Chatgpt', <AiFillRobot />, 'Send Chatgpt responses to Mail')}
                {renderNavItem('Giphy', <HiMiniGif />, 'Send your favorite GIFs to Mail')}
                {renderNavItem('AI', <FaListAlt />, 'Send predetermined custom message responses.')}
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

            <div className="container w-90 mt-4">
                {message && <MessageWindow />}
                {state.displayComp === 'Chatgpt' && <ChatGpt appendToBody={handleInsertion} />}
                {state.displayComp === 'Giphy' && <GiphyWindow appendToBody={handleInsertion} />}
                {state.displayComp === 'Library' && <Library appendToBody={handleInsertion} />}
                {state.displayComp === 'AI' && <AI appendToBody={handleInsertion} />}

                {!message && (
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
                )}
               
            </div>
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

export default EmailComposer;
