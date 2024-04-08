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

  function checkForExistenceOfMessageWindow(element) {
    return element.querySelector(".msg-form__contenteditable") != null;
  }

  const setUpInitialArray = () => {
    const allChatWindows = Array.from(
      document.getElementsByClassName("msg-convo-wrapper")
    );
    const validChatWindows = allChatWindows.filter((element) =>
      checkForExistenceOfMessageWindow(element)
    );
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
            nameOfRecipient = item.querySelectorAll("span")[2].innerText;
          }
        } catch (err) {
          nameOfRecipient = "New Message";
        }
      } else nameOfRecipient = item.querySelector("h2").innerText;
      return {
        name: nameOfRecipient,
        index: index,
      };
    });
    const windowUrl = window.location.href;
    // check if the messaging tab is open
    if (windowUrl.includes("messaging")) {
      combinedArray[0].name = "Messaging Tab";
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
              .then(async (response) => {
                if (!chrome.runtime.lastError) {
                  var combinedArray = response[0].result;
                  if (isProfilePage) {
                    let scrapedInfo = await Scrape("ProfilePage");
                    scrapedInfo = scrapedInfo.map((item) => {
                      return item.replace(/[^\x00-\x7F]/g, "");
                    });
                    console.log(scrapedInfo);
                    if (scrapedInfo[0] !== "") {
                      combinedArray.push({
                        index: combinedArray.length,
                        name: scrapedInfo[0],
                        dataset: { type: "profileCheckbox" },
                      });
                      console.log(combinedArray, "from chrome");
                    }
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
                    "Error retrieving combinedArray:",
                    chrome.runtime.lastError
                  );
                }
              });
          } catch (err) {
            console.log("some error occured in executing script", err);
          }
        } else {
          console.log("the target tab is not accessible");
        }
      });
    } catch (err) {
      console.log("some error occured while setting up initial array");
    }
  }, [resetInitialItems, isProfilePage]);

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

  const handleCheckboxChange = (event) => {
    const { value, checked, dataset } = event.target;
    console.log(dataset, initialItems);
    if (checked) {
      const selectedItem = initialItems.find((item) => item.name === value);
      const newChatWindows = selectedChatWindows;
      newChatWindows.push(selectedItem);
      setSelectedChatWindows(newChatWindows);
      setCheckedItemCount(checkedItemCount + 1);
    } else {
      const newChatWindows = selectedChatWindows.filter(
        (item) => item.name !== value
      );
      setSelectedChatWindows(newChatWindows);
      setCheckedItemCount(checkedItemCount - 1);
    }

    setLocalRefresh(!localRefresh);
  };
  const uniqueNamesSet = new Set();

  return (
    <div
      id="chatWindowsList"
      className="container selection-container bg-white"
    >
      {isLinkedin && (
        <>
          {initialItems?.length > 0 ? (
            <div id="select-recipients-title">
              Select Recipients{" "}
              <span>
                ({checkedItemCount} out of {initialItems.length})
              </span>
            </div>
          ) : (
            <div id="select-recipients-title">Please open any chat window.</div>
          )}
          <div className="mt-2 select-recipient-list">
            {initialItems?.map((item, index) => {
              if (!uniqueNamesSet.has(item.name)) {
                uniqueNamesSet.add(item.name);
                return (
                  <div key={index}>
                    <div className="d-flex flex-row">
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
                      <label
                        id="select-recipient-item"
                        className="form-check-label"
                      >
                        {item.name}
                      </label>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindowSelection;
