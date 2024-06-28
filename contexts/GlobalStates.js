import React, { createContext, useEffect, useState } from 'react'

const GlobalStatesContext = createContext()

export const GlobalStatesProvider = ({ children }) => {
  const [latestVideoUrl, setLatestVideoUrl] = useState('')
  const [globalRefresh, setGlobalRefresh] = useState(false)
  const [isLinkedin, setIsLinkedin] = useState(false)
  const [isProfilePage, setIsProfilePage] = useState(false)
  const [scraperPage, setScraperPage] = useState(false)
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [focusedElementLinkedin, setFocusedElementLinkedin] = useState(null)
  const [expand, setExpand] = useState(false)
  const [selectedChatWindows, setSelectedChatWindows] = useState([])
  const [latestVideo, setLatestVideo] = useState()
  const [latestBlob, setLatestBlob] = useState()
  const [newTitle, setNewTitle] = useState()
  const [subscriptionType, setSubscriptionType] = useState('monthly')
  const [totalMediaCount, setTotalMediaCount] = useState()
  const [isVideoContainer, setIsVideoContainer] = useState(false)
  const [isTimezoneScreen, setIsTimezoneScreen] = useState(false)
  const [isPostCommentAvailable, setIsPostCommentAvailable] = useState(false)
  const [postCommentSelected, setPostCommentSelected] = useState(false)
  const [postCommentElement, setPostCommentElement] = useState(null)
  const [tabId, setTabId] = useState(null)
  useEffect(() => {}, [globalRefresh])
  const getToggleButton = () => {
    const toggleButton = document.getElementById('skoop-expand-minimize-button')
    toggleButton.click()
  }
  const expandMinimizeExtension = () => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const targetTab = tabs[0]
        if (targetTab) {
          try {
            chrome.scripting.executeScript({
              target: { tabId: targetTab.id },
              func: getToggleButton,
            })
          } catch (err) {
            console.error('some error occured in executing script', err)
          }
        }
      })
      if (expand) {
        document.body.style.overflow = 'auto'
      } else {
        document.body.style.overflow = 'hidden'
      }
      setExpand(!expand)
    } catch (err) {
      console.error('some error occured while setting up initial array')
    }
  }
  return (
    <GlobalStatesContext.Provider
      value={{
        globalRefresh,
        setGlobalRefresh,
        isLinkedin,
        setIsLinkedin,
        selectedChatWindows,
        setSelectedChatWindows,
        setLatestVideoUrl,
        latestVideoUrl,
        isProfilePage,
        setIsProfilePage,
        scraperPage,
        setScraperPage,
        latestVideo,
        setLatestVideo,
        focusedElementId,
        setFocusedElementId,
        expand,
        setExpand,
        latestBlob,
        setLatestBlob,
        newTitle,
        setNewTitle,
        subscriptionType,
        setSubscriptionType,
        totalMediaCount,
        setTotalMediaCount,
        isVideoContainer,
        setIsVideoContainer,
        isTimezoneScreen,
        setIsTimezoneScreen,
        focusedElementLinkedin,
        setFocusedElementLinkedin,
        isPostCommentAvailable,
        setIsPostCommentAvailable,
        postCommentSelected,
        setPostCommentSelected,
        postCommentElement,
        setPostCommentElement,
        tabId,
        setTabId,expandMinimizeExtension
      }}
    >
      {children}
    </GlobalStatesContext.Provider>
  )
}

export default GlobalStatesContext
