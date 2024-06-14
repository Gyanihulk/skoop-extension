import React, { useContext, useEffect, useState } from "react";
import GlobalStatesContext from "../../contexts/GlobalStates";
import Scrape from "../Scraper";

const ChatWindowSelection = () => {
  const [initialItems, setInitialItems] = useState([]);
  const [checkedItemCount, setCheckedItemCount] = useState(0);
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
  const [currentUrl, setCurrentUrl] = useState('');

  function checkForExistenceOfMessageWindow(element) {
    return element.querySelector(".msg-form__contenteditable") != null;
  }

  const setUpInitialArray = async() => {
    try{

      const allChatWindows = Array.from(
        document.getElementsByClassName("msg-convo-wrapper")
      );
      const validChatWindows = allChatWindows.filter((element) =>
        checkForExistenceOfMessageWindow(element)
      );
      
      const profileUserName = document.querySelector('a>h1')?.innerText;
  
      var combinedArray = validChatWindows?.map((item, index) => {
        var nameOfRecipient;
        if (item.querySelector("h2").innerText == "New message") {
          try {
            const profileLink = item.getElementsByClassName(
              "msg-compose__profile-link"
            );
            if (profileLink?.length) {
              nameOfRecipient = profileLink[0].innerText;
            } else {
              nameOfRecipient = item.getElementsByClassName('artdeco-pill__text')[0].innerText;
            }
          } catch (err) {
            nameOfRecipient = "New Message";
          }
        } else {
          nameOfRecipient = item.querySelector("h2").innerText;
        }

        return {
          name: nameOfRecipient,
          index: profileUserName ? index + 1 : index,
        };
      });
      const windowUrl = window.location.href;
      // check if the messaging tab is open
      if (windowUrl.includes("messaging")) {
        const name = document.querySelector('#thread-detail-jump-target').innerText;
        combinedArray[0].name = name;
      }
      if(profileUserName) {
        combinedArray.unshift({
          name: profileUserName,
          index: 0,
          dataset: { type: "profileCheckbox" },
          link: windowUrl
        })
      }
      return combinedArray;

    } catch(error) {
      console.error("error while setting up initial array " + error)
    }
    
  };

  useEffect(() => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        const targetTab = tabs[0];
        tabs.find(
          (tab) =>
            tab.active &&
            (tab.url.startsWith(urlToFindGoogle) ||
              tab.url.startsWith(urlToFindLinkedIn))
        )
        if (targetTab) {
          try {
            chrome.scripting
              .executeScript({
                target: { tabId: targetTab.id },
                func: setUpInitialArray,
              })
              .then(async (response) => {
                if (!chrome.runtime.lastError) {
                  var combinedArray = response[0].result;
                  const seen = new Set();
                  const filteredArray = combinedArray.filter(element => {
                    if (element.hasOwnProperty('dataset')) {
                      const userName = getNameFromLinkedInUrl(element);
                      element.name = userName;
                    }
                    if (seen.has(element.name)) {
                      return false;
                    } else {
                      seen.add(element.name);
                      return true;
                    }
                  });
                  setInitialItems(filteredArray);
                  const filtered = filteredArray.filter((item) =>
                    selectedChatWindows.some(secondItems => secondItems.name === item.name)
                  );
                  setSelectedChatWindows(filtered);
                } else {
                  console.error(
                    "Error retrieving combinedArray:",
                    chrome.runtime.lastError
                  );
                }
              });
          } catch (err) {
            console.error("some error occured in executing script", err);
          }
        }
      });
    } catch (err) {
      console.error("some error occured while setting up initial array");
    }
  }, [resetInitialItems, isProfilePage, currentUrl]);

  const messageHandler = (message) => {
    if (message.action === "elementAdded") {
      setResetInitialItems(Math.random());
    } else if (message.action === "elementRemoved") {
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

  const handleCheckboxChange = async (event) => {
    const { value, checked, dataset } = event.target;
    if (checked) {
      const selectedItem = initialItems.find((item) => item.name === value);
      if (selectedItem.hasOwnProperty('dataset')) {
        const openChatWindow = await handleOpenMessageWindow();
        const newChatWindows = selectedChatWindows;
        newChatWindows.push(selectedItem);
        setSelectedChatWindows(newChatWindows);
        setCheckedItemCount(checkedItemCount + 1);
        setIsProfileChatSelected(true)
      } else {
        const newChatWindows = selectedChatWindows;
        newChatWindows.push(selectedItem);
        setSelectedChatWindows(newChatWindows);
        setCheckedItemCount(checkedItemCount + 1);
      }
    } else {
      const newChatWindows = selectedChatWindows.filter(
        (item) => item.name !== value
      );
      setSelectedChatWindows(newChatWindows);
      setCheckedItemCount(checkedItemCount - 1);

    }

    setLocalRefresh(!localRefresh);
  };

  //----------------------------------------------------------------------------------

  const handleOpenMessageWindow = () => {
    const clickMessageButton = () => {
      const btns = Array.from(document.querySelectorAll("div>div>div>button"));
      let selectedButton = btns.find(
        (btn) => btn.ariaLabel && btn.ariaLabel.includes("Message")
      );
      if (selectedButton) {
        selectedButton.click();
      } else {
        throw new Error("Message button not found.");
      }
    };

    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const targetTab = tabs[0];
          if (targetTab) {
            chrome.scripting.executeScript(
              {
                target: { tabId: targetTab.id },
                func: clickMessageButton,
              },
              (injectionResults) => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error executing script:",
                    chrome.runtime.lastError
                  );
                  reject("Failed to execute script on tab");
                } else {
                  resolve("Message button clicked successfully");
                }
              }
            );
          } else {
            reject("Target tab is not accessible");
          }
        });
      } catch (err) {
        console.error(
          "some error occurred while trying to open message window",
          err
        );
        reject("Unexpected error occurred");
      }
    });
  };
  function extractWordsFromString(inputString) {
    let cleanedString = inputString.replace(/[^a-zA-Z0-9\s\/.-]/g, " ").toLowerCase();
    cleanedString = cleanedString.replace(/\s+/g, " ");
    let wordsArray = cleanedString.split(/[\/\s-]+/);
    wordsArray = wordsArray.filter(word => word.length > 0);
    return wordsArray;
  }

  function extractWordsFromString(inputString) {
    let cleanedString = inputString.replace(/[^a-zA-Z0-9\s\/.-]/g, " ").toLowerCase();
    cleanedString = cleanedString.replace(/\s+/g, " ");
    let wordsArray = cleanedString.split(/[\/\s-]+/);
    wordsArray = wordsArray.filter(word => word.length > 0);
    return wordsArray;
  }

  function getNameFromLinkedInUrl(element) {
    const link = element.link;
    const name = element.name;

    const nameArray = name.match(/\b\w+\b/g);
    let user = [];
    const lowerCaseNameArray = nameArray.map(word => word.toLowerCase());
    const linkNameArray = extractWordsFromString(link);
    const updated = linkNameArray.map(item => item.replace(/[^a-zA-Z]/g, ''));
    const matches = updated.map((item) => {
      if (lowerCaseNameArray.includes(item)) {
        const index = lowerCaseNameArray.indexOf(item);
        user.push(nameArray[index]);
      }
    })
    const result = user.join(' ');
    return result;
  }
  //-----------------------------------------------------------------------------------

  const updateUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      setCurrentUrl(url);
    });
  };

  useEffect(() => {
    updateUrl();
    
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        updateUrl();
      }
    });

    return () => {
      chrome.tabs.onUpdated.removeListener(updateUrl);
    };
  }, []);

  useEffect(() => {
     setCheckedItemCount(selectedChatWindows?.length || 0);
  }, [selectedChatWindows])
  const uniqueNamesSet = new Set();

  return (
    <div
      id="chatWindowsList"
      className="container selection-container bg-white"
    >
      {isLinkedin && (
        <>
          {initialItems?.length > 0 ? (
            <div>
              <div id="select-recipients-title">
                Select Recipients{" "}
                <span>
                  ({checkedItemCount} out of {initialItems.length})
                </span>
              </div>
              <div className="mt-1 select-recipient-list">
                {initialItems?.map((item, index) => {
                  if (!uniqueNamesSet.has(item.name)) {
                    uniqueNamesSet.add(item.name);
                    return (
                      <div
                        key={index}
                        id="select-recipient-item"
                        className="d-flex"
                      >
                        <input
                          id="recipient-checkbox"
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
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          ) : (
            <div id="none-recipients-title">Please open any chat window.</div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatWindowSelection;
