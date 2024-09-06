import React, { createContext, useEffect, useState } from 'react'

const GlobalStatesContext = createContext()

export const GlobalStatesProvider = ({ children }) => {
  const [latestVideoUrl, setLatestVideoUrl] = useState('')
  const [globalRefresh, setGlobalRefresh] = useState(false)
  const [isLinkedin, setIsLinkedin] = useState(false)
  const [isGmail, setIsGmail] = useState(false)
  const [isProfilePage, setIsProfilePage] = useState(false)
  const [scraperPage, setScraperPage] = useState(false)
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [focusedElementLinkedin, setFocusedElementLinkedin] = useState(null)
  const [expand, setExpand] = useState(false)
  const [selectedChatWindows, setSelectedChatWindows] = useState([])
  const [latestVideo, setLatestVideo] = useState()
  const [latestBlob, setLatestBlob] = useState()
  const [newTitle, setNewTitle] = useState()
  
  const [totalMediaCount, setTotalMediaCount] = useState(0)
  const [isVideoContainer, setIsVideoContainer] = useState(false)
  const [isTimezoneScreen, setIsTimezoneScreen] = useState(false)
  const [isPostCommentAvailable, setIsPostCommentAvailable] = useState(false)
  const [postCommentSelected, setPostCommentSelected] = useState(false)
  const [postCommentElement, setPostCommentElement] = useState(null)
  const [tabId, setTabId] = useState(null)
  const [isMatchingUrl, setIsMatchingUrl] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState('')
  const [enableTutorialScreen, setEnableTutorialScreen] = useState(false)
  const [userSetting, setUserSetting] = useState(null)
  const [targetedTourElement, setTargetedTourElement] = useState(null);
  
  useEffect(() => {}, [globalRefresh])
  const getToggleButton = () => {
    try {
      const toggleButton = document.getElementById('skoop-expand-minimize-button')
      toggleButton.click()
    } catch (err) {
      console.error('some error occured in executing script', err)
    }
  }
  const expandMinimizeExtension = () => {
    try {
      chrome.scripting.executeScript({
        target: { tabId },
        func: getToggleButton,
      })

      if (!expand) {
        document.body.style.overflow = 'auto'
      } else {
        document.body.style.overflow = 'hidden'
      }
      setExpand(!expand)
    } catch (err) {
      console.error('some error occured while setting up initial array')
    }
  }
  const clickExpandButton = () => {
    try {
      const toggleButton = document.getElementById('skoop-expand-button')
      toggleButton.click()
    } catch (err) {
      console.error('some error occured in executing script', err)
    }
  }
  const expandExtension = () => {
    try {
      chrome.scripting.executeScript({
        target: { tabId },
        func: clickExpandButton,
      })

      document.body.style.overflow = 'hidden'

      setExpand(false)
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
        setTabId,
        expandMinimizeExtension,
        isMatchingUrl,
        setIsMatchingUrl,
        expandExtension,
        isGmail,
        setIsGmail,
        selectedTutorial, 
        setSelectedTutorial,
        enableTutorialScreen, 
        setEnableTutorialScreen,
        userSetting, 
        setUserSetting,
        targetedTourElement, 
        setTargetedTourElement
      }}
    >
      {children}
    </GlobalStatesContext.Provider>
  )
}

export default GlobalStatesContext
