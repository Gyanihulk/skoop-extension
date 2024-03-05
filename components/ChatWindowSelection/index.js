import React, { useContext, useEffect, useState } from 'react';
import GlobalStatesContext from '../../contexts/GlobalStates';
import Scrape from '../Scraper';

const ChatWindowSelection = () => {
    const [initialItems, setInitialItems] = useState([]);
    const [profilePageName, setProfilePageName] = useState();
    const {
        selectedChatWindows,
        setSelectedChatWindows,
        isLinkedin,
        focusedElementId,
        isProfilePage,
    } = useContext(GlobalStatesContext);
    const [localRefresh, setLocalRefresh] = useState(0);
    const [resetInitialItems, setResetInitialItems] = useState(0);

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
                                    if (isProfilePage) {
                                        combinedArray.push({
                                            index: combinedArray.length,
                                            name: profilePageName,
                                            dataset: { type: 'profileCheckbox' },
                                        })
                                        // (async () => {
                                        //     let scrapedInfo = await Scrape('ProfilePage');
                                        //     scrapedInfo = scrapedInfo.map((item) => {
                                        //         return item.replace(/[^\x00-\x7F]/g, '');
                                        //     });
                                        //     setProfilePageName(scrapedInfo[0]);
                                        //     console.log(scrapedInfo, 'from chat window selection ');
                                        // })();
                                    }
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
    }, [resetInitialItems, isProfilePage]);
    useEffect(() => {
        try {
            (async () => {
                let scrapedInfo = await Scrape('ProfilePage');
                scrapedInfo = scrapedInfo.map((item) => {
                    return item.replace(/[^\x00-\x7F]/g, '');
                });
                setProfilePageName(scrapedInfo[0]);
                console.log(scrapedInfo, 'from chat window selection ');
            })();
        } catch (err) {
            console.log('some error occured while setting up initial array');
        }
    }, [isProfilePage]);
    const messageHandler = (message) => {
        if (message.action === 'elementAdded') {
            setResetInitialItems(Math.random());
        } else if (message.action === 'elementRemoved') {
            setResetInitialItems(Math.random());
        }
    };

    useEffect(() => {
        if (chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(messageHandler);
            return () => {
                chrome.runtime.onMessage.removeListener(messageHandler);
            };
        }
    }, []);

    const handleCheckboxChange = (event) => {
        const { value, checked, dataset } = event.target;
        console.log(dataset, initialItems);
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
    if (initialItems.length > 0) {
        const newItems = initialItems.filter(
            (item, index, self) => index === self.findIndex((t) => t.name === item.name)
        );
        console.log(newItems)
        // setInitialItems(newItems)
    }
    return (
        <div id="chatWindowsList" className="container selection-container bg-white">
            {isLinkedin && (
                <>
                    {initialItems?.length > 0 ? (
                        <div className="fw-bold fs-6">Select Recipients</div>
                    ) : (
                        <div className="fw-bold fs-6">Please open any chat window.</div>
                    )}
                    <div className="row">
                        {initialItems?.map((item, index) => (
                            <div key={index} className="col-4">
                                <div className="d-flex flex-row">
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
        </div>
    );
};

export default ChatWindowSelection;
