import React, { useContext, useEffect, useState } from 'react'
import GlobalStatesContext from '../../contexts/GlobalStates'
import Scrape from '../Scraper'
import { CgDanger } from 'react-icons/cg'
import { removeNestedParentheses } from '../../lib/helpers'
const ChatWindowSelection = () => {
  const [initialItems, setInitialItems] = useState([])
  const [checkedItemCount, setCheckedItemCount] = useState(0)
  const [duplicateName, setDuplicateName] = useState(false)
  const [uniqueNamesSet, setUniqueNamesSet] = useState(new Set())
  const { selectedChatWindows, setSelectedChatWindows, isLinkedin, focusedElementId, isProfilePage, isPostCommentAvailable, setIsPostCommentAvailable, postCommentSelected, setPostCommentSelected, setPostCommentElement, postCommentElement, tabId } =
    useContext(GlobalStatesContext)
  const [localRefresh, setLocalRefresh] = useState(0)
  const [resetInitialItems, setResetInitialItems] = useState(0)
  const [currentUrl, setCurrentUrl] = useState('')
  const [postCommentLabel, setPostCommentLabel] = useState('Post Comment')
  function checkForExistenceOfMessageWindow(element) {
    return element.querySelector('.msg-form__contenteditable') != null
  }

  const setUpInitialArray = async () => {
    try {
      const allChatWindows = Array.from(document.getElementsByClassName('msg-convo-wrapper'))
      const validChatWindows = allChatWindows.filter((element) => checkForExistenceOfMessageWindow(element))

      const profileUserName = document.querySelector('a>h1')?.innerText
      var combinedArray = validChatWindows?.map((item, index) => {
        var nameOfRecipient
        if (item.querySelector('h2').innerText == 'New message') {
          try {
            const profileLink = item.getElementsByClassName('msg-compose__profile-link')
            if (profileLink?.length) {
              nameOfRecipient = profileLink[0].innerText
            } else {
              nameOfRecipient = item.getElementsByClassName('artdeco-pill__text')[0].innerText
            }
          } catch (err) {
            nameOfRecipient = 'New Message'
          }
        } else {
          nameOfRecipient = item.querySelector('h2').innerText
        }

        return {
          name: nameOfRecipient,
          index: profileUserName ? index + 1 : index,
        }
      })
      const windowUrl = window.location.href
      // check if the messaging tab is open
      if (windowUrl.includes('messaging')) {
        const name = document.querySelector('#thread-detail-jump-target').innerText
        combinedArray[0].name = name
      }

      if (profileUserName) {
        combinedArray.unshift({
          name: profileUserName,
          index: 0,
          dataset: { type: 'profileCheckbox' },
          link: windowUrl,
        })
      }

      return combinedArray
    } catch (error) {
      console.error('error while setting up initial array ' + error)
    }
  }

  useEffect(() => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        const targetTab = tabs[0]
        tabs.find((tab) => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)))
        if (targetTab) {
          try {
            chrome.scripting
              .executeScript({
                target: { tabId: targetTab.id },
                func: setUpInitialArray,
              })
              .then(async (response) => {
                if (!chrome.runtime.lastError) {
                  var combinedArray = response[0].result
                  const seen = new Set()
                  const filteredArray = combinedArray.filter((element) => {
                    if (element.hasOwnProperty('dataset')) {
                      const userName = getNameFromLinkedInUrl(element)
                      element.name = userName
                    }
                    if (seen.has(element.name)) {
                      return false
                    } else {
                      seen.add(element.name)
                      return true
                    }
                  })
                  setInitialItems(combinedArray)

                  const filtered = filteredArray.filter((item) => selectedChatWindows.some((secondItems) => secondItems.name === item.name))
                  setSelectedChatWindows(filtered)
                } else {
                  console.error('Error retrieving combinedArray:', chrome.runtime.lastError)
                }
              })
          } catch (err) {
            console.error('some error occured in executing script', err)
          }
        }
      })
    } catch (err) {
      console.error('some error occured while setting up initial array')
    }
  }, [resetInitialItems, isProfilePage, currentUrl])
  function connectAll(){
    // Get all the cards with the class "discover-entity-type-card"
const cards = document.querySelectorAll('.discover-entity-type-card');

// Define an async function to click the connect button with a delay
async function clickConnectButtons(cards) {
  for (const card of cards) {
    // Find the connect button within the card
    const connectButton = card.querySelector('button[aria-label*="Invite"]');
    
    // If the connect button exists, click it
    if (connectButton) {
      connectButton.click();
      console.log('Clicked connect on:', card);
      
      // Wait for 1 second (1000 milliseconds) before continuing to the next card
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Execute the function with the cards
clickConnectButtons(cards);
  }
  function connect(){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const urlToFindGoogle = 'https://mail.google.com/mail'
      const urlToFindLinkedIn = 'https://www.linkedin.com/'

      const targetTab = tabs[0]
      tabs.find((tab) => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)))
      if (targetTab) {
        try {
          chrome.scripting
            .executeScript({
              target: { tabId: targetTab.id },
              func: connectAll,
            })
            .then(async (response) => {
              console.log(response)
            })
        } catch (err) {
          console.error('some error occured in executing script', err)
        }
      }
    })
  }
  const messageHandler = (message) => {
    if (message?.tabId == tabId) {
      if (message.action === 'elementAdded') {
        setResetInitialItems(Math.random())
      } else if (message.action === 'elementRemoved') {
        setResetInitialItems(Math.random())
      } else if (message.action === 'skoopFocusedElementLinkedin') {
        if (message?.element && message.element.placeholder != null && (message.element.placeholder.startsWith('Add a comment') || message.element.placeholder.startsWith('Add a reply'))) {
          setIsPostCommentAvailable(true)
          setPostCommentElement({ ...message.element })
          if (message.element.placeholder.includes('comment')) {
            setPostCommentLabel('Post Comment')
          } else if (message.element.placeholder.includes('reply')) {
            setPostCommentLabel('Comment Reply')
          }
        } else {
          setIsPostCommentAvailable(false)
          setPostCommentSelected(false)
        }
      }
    }
  }

  useEffect(() => {
    if (chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(messageHandler)
      return () => {
        chrome.runtime.onMessage.removeListener(messageHandler)
      }
    }
  }, [])

  const handleCheckboxChange = async (event) => {
    const { value, checked, dataset } = event.target
    if (checked) {
      const selectedItem = initialItems.find((item) => item.name === value)
      if (selectedItem.hasOwnProperty('dataset')) {
        const openChatWindow = await handleOpenMessageWindow()
        const newChatWindows = selectedChatWindows
        newChatWindows.push(selectedItem)
        setSelectedChatWindows(newChatWindows)
        setCheckedItemCount(checkedItemCount + 1)
      } else {
        const newChatWindows = selectedChatWindows
        newChatWindows.push(selectedItem)
        setSelectedChatWindows(newChatWindows)
        setCheckedItemCount(checkedItemCount + 1)
      }
    } else {
      const newChatWindows = selectedChatWindows.filter((item) => item.name !== value)
      setSelectedChatWindows(newChatWindows)
      setCheckedItemCount(checkedItemCount - 1)
    }

    setLocalRefresh(!localRefresh)
  }

  //----------------------------------------------------------------------------------

  const handleOpenMessageWindow = () => {
    const clickMessageButton = () => {
      const btns = Array.from(document.querySelectorAll('div>div>div>button'))
      let selectedButton = btns.find((btn) => btn.ariaLabel && btn.ariaLabel.includes('Message'))
      if (selectedButton) {
        selectedButton.click()
      } else {
        throw new Error('Message button not found.')
      }
    }

    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const targetTab = tabs[0]
          if (targetTab) {
            chrome.scripting.executeScript(
              {
                target: { tabId: targetTab.id },
                func: clickMessageButton,
              },
              (injectionResults) => {
                if (chrome.runtime.lastError) {
                  console.error('Error executing script:', chrome.runtime.lastError)
                  reject('Failed to execute script on tab')
                } else {
                  resolve('Message button clicked successfully')
                }
              }
            )
          } else {
            reject('Target tab is not accessible')
          }
        })
      } catch (err) {
        console.error('some error occurred while trying to open message window', err)
        reject('Unexpected error occurred')
      }
    })
  }
  function extractWordsFromString(inputString) {
    let cleanedString = inputString.replace(/[^a-zA-Z0-9\s\/.-]/g, ' ').toLowerCase()
    cleanedString = cleanedString.replace(/\s+/g, ' ')
    let wordsArray = cleanedString.split(/[\/\s-]+/)
    wordsArray = wordsArray.filter((word) => word.length > 0)
    return wordsArray
  }

  function extractWordsFromString(inputString) {
    let cleanedString = inputString.replace(/[^a-zA-Z0-9\s\/.-]/g, ' ').toLowerCase()
    cleanedString = cleanedString.replace(/\s+/g, ' ')
    let wordsArray = cleanedString.split(/[\/\s-]+/)
    wordsArray = wordsArray.filter((word) => word.length > 0)
    return wordsArray
  }

  function getNameFromLinkedInUrl(element) {
    const name = element.name

    // Use a non-greedy match to remove only the first set of parentheses
    // and everything inside them.
    const nameWithoutFirstParentheses = removeNestedParentheses(name)

    // Trim the resulting string to remove any leading or trailing spaces
    const trimmedName = nameWithoutFirstParentheses.trim()

    return trimmedName
  }
  //-----------------------------------------------------------------------------------

  const updateUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      setCurrentUrl(url)
    })
  }

  useEffect(() => {
    updateUrl()

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        updateUrl()
      }
    })

    return () => {
      chrome.tabs.onUpdated.removeListener(updateUrl)
    }
  }, [])
  useEffect(() => {
    // Create a new Set for names
    const newSet = new Set()
    const nameMap = {}
    let duplicateWithoutDataset = false
    // Iterate over the initialItems to populate the map

    initialItems.forEach((item) => {
      const { name, dataset } = item
      if (!nameMap[name]) {
        // Initialize the entry for this name
        nameMap[name] = {
          count: 1,
          hasDataset: !!dataset,
        }
      } else {
        // Increment the count and update the hasDataset flag if necessary
        nameMap[name].count++
        nameMap[name].hasDataset = nameMap[name].hasDataset || !!dataset
      }
    })

    // Check for duplicates where neither item has a dataset
    const hasDuplicateWithoutDataset = Object.values(nameMap).some((item) => item.count > 1 && !item.hasDataset)
    setDuplicateName(hasDuplicateWithoutDataset)

    // Track if a duplicate name without a dataset is found

    // Iterate over the initialItems
    initialItems.forEach((item) => {
      // Check if the item's name is already in the set
      if (newSet.has(item.name)) {
        // If the item's name is in the set and it does not have a dataset, set the flag to true
      } else {
        // If the item's name is not in the set, add it to the set
        newSet.add(item.name)
      }
    })

    // Update the state with the new Set
    setUniqueNamesSet(newSet)

    // Set the duplicateName state based on the flag
  }, [initialItems])
  useEffect(() => {
    setCheckedItemCount(selectedChatWindows?.length || 0)
  }, [selectedChatWindows])

  return (
    <div id="chatWindowsList" className="container selection-container bg-white">
    <button onClick={connect}>connect</button>
      {isLinkedin && (
        <>
          {initialItems?.length > 0 || isPostCommentAvailable ? (
            <div>
              <div id="select-recipients-title">
                {!duplicateName ? (
                  <>
                    Select Recipients{' '}
                    <span>
                      ({postCommentSelected ? checkedItemCount + 1 : checkedItemCount} out of {isPostCommentAvailable ? uniqueNamesSet.size + 1 : uniqueNamesSet.size})
                    </span>
                  </>
                ) : (
                  <>
                    <div className="danger flex flex-row mb-2">
                      <CgDanger color="red" size={20} />
                      There are duplicate names. Please copy and paste the correct message manually and then send them.
                    </div>
                  </>
                )}
              </div>
              <div className="mt-1 select-recipient-list">
                {isPostCommentAvailable && (
                  <div id="post-comment" className="d-flex">
                    <input id="post-comment-checkbox" type="checkbox" className="form-check-input" value="Post Comment" checked={postCommentSelected} onChange={(e) => setPostCommentSelected(e.target.checked)} />
                    <label className="form-check-label">{postCommentLabel}</label>
                  </div>
                )}
                {[...uniqueNamesSet].map((name, index) => (
                  <div key={index} id="select-recipient-item" className="d-flex">
                    <input id={`recipient-checkbox`} type="checkbox" className="form-check-input" value={name} checked={selectedChatWindows.some((checkedItem) => checkedItem.name === name)} onChange={handleCheckboxChange} />
                    <label className="form-check-label">{name}</label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div id="none-recipients-title">Please open any chat window.</div>
          )}
        </>
      )}
    </div>
  )
}

export default ChatWindowSelection
