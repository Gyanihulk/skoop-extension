import React, { useContext, useEffect, useState } from 'react';
import GlobalStatesContext from '../../contexts/GlobalStates';
import MessageContext from '../../contexts/MessageContext';
import { insertHtmlAtPositionInMail, insertIntoLinkedInMessageWindow } from '../../utils';
import toast from 'react-hot-toast';

const ChatWindowSelection = () => {
    const [initialItems, setInitialItems] = useState([]);
    const { selectedChatWindows, setSelectedChatWindows, isLinkedin,focusedElementId } =
        useContext(GlobalStatesContext);
    const [localRefresh, setLocalRefresh] = useState(0);
    const [resetInitialItems, setResetInitialItems] = useState(0);
    const { message, setMessage } = useContext(MessageContext);
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
          if(selectedChatWindows?.length===0){
              toast.error("Please select a recipitent")
          }
          console.log(selectedChatWindows,selectedChatWindows?.length)
            await insertIntoLinkedInMessageWindow(`<p>${message}</p>`, selectedChatWindows);
            setTimeout(()=>{handleSend();},500)
            
        } else {
            insertHtmlAtPositionInMail(message, focusedElementId);
        }
        if(selectedChatWindows?.length!==0){
            setMessage();
        }
        
    };

    function checkForExistenceOfMessageWindow(element) {
        return element.querySelector('.msg-form__contenteditable') != null;
    }

    const setUpInitialArray = () => {
        const allChatWindows = Array.from(document.getElementsByClassName('msg-convo-wrapper'));
        const validChatWindows = allChatWindows.filter((element) =>
            checkForExistenceOfMessageWindow(element)
        );
        var combinedArray = validChatWindows?.map((item, index) => {
            var nameOfRecipient;
            if (item.querySelector('h2').innerText == 'New message') {
                try {
                    const profileLink = item.getElementsByClassName('msg-compose__profile-link');
                    if (profileLink?.length) {
                        nameOfRecipient = profileLink[0].innerText;
                    } else {
                        nameOfRecipient = item.querySelectorAll('span')[2].innerText;
                    }
                } catch (err) {
                    nameOfRecipient = 'New Message';
                }
            } else nameOfRecipient = item.querySelector('h2').innerText;
            return {
                name: nameOfRecipient,
                index: index,
            };
        });
        const windowUrl = window.location.href;
        // check if the messaging tab is open
        if (windowUrl.includes('messaging')) {
            combinedArray[0].name = 'Messaging Tab';
        }
        return combinedArray;
    };

    useEffect(() => {
        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const targetTab = tabs[0];
                if (targetTab) {
                    try {
                        chrome.scripting
                            .executeScript({
                                target: { tabId: targetTab.id },
                                func: setUpInitialArray,
                            })
                            .then((response) => {
                                if (!chrome.runtime.lastError) {
                                    var combinedArray = response[0].result;

                                    setInitialItems(combinedArray);
                                    const filteredArray = combinedArray.filter((item) =>
                                        selectedChatWindows.some(
                                            (secondItem) => secondItem.name === item.name
                                        )
                                    );
                                    setSelectedChatWindows(filteredArray);
                                } else {
                                    console.error(
                                        'Error retrieving combinedArray:',
                                        chrome.runtime.lastError
                                    );
                                }
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
    }, [resetInitialItems]);

    const messageHandler = (message) => {
        if (message.action === 'elementAdded') {
            setResetInitialItems(Math.random());
          
        } else if (message.action === 'elementRemoved') {
            setResetInitialItems(Math.random());
           
        }
    };

    useEffect(() => {
        chrome.runtime.onMessage.addListener(messageHandler);
        return () => {
            chrome.runtime.onMessage.removeListener(messageHandler);
        };
    }, []);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            const selectedItem = initialItems.find((item) => item.name === value);
            const newChatWindows = selectedChatWindows;
            newChatWindows.push(selectedItem);
            setSelectedChatWindows(newChatWindows);
        } else {
            const newChatWindows = selectedChatWindows.filter((item) => item.name !== value);
            setSelectedChatWindows(newChatWindows);
        }

        setLocalRefresh(!localRefresh);
    };

   
        return (
            <div className="container selection-container p-4 my-2">
                {isLinkedin && (
                    <>
                      {initialItems?.length>0?
                      <h8 className="text-center mb-4 fw-bold fst-italic">Select Recipients</h8>:<p>No chat window is open.</p>}
                        <div className="row row-cols-2 g-3 mt-2">
                            {initialItems?.map((item, index) => (
                                <div key={index} className="col">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            value={item.name}
                                            checked={selectedChatWindows.some(
                                                (checkedItem) => checkedItem.name === item.name
                                            )}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-check-label">{item.name}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <div class="d-grid gap-2">
                    <button
                        class="btn btn-primary mt-3"
                        type="button"
                        onClick={handleInsertionToWebsite}
                    >
                        SEND
                    </button>
                </div>
            </div>
        );
    
};

export default ChatWindowSelection;
