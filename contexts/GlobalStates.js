import React, { createContext, useEffect, useState } from 'react'

const GlobalStatesContext = createContext()

export const GlobalStatesProvider = ({ children }) => {
  const [latestVideoUrl, setLatestVideoUrl] = useState('')
  const [globalRefresh, setGlobalRefresh] = useState(false)
  const [isLinkedin, setIsLinkedin] = useState(false)
  const [isProfilePage, setIsProfilePage] = useState(false)
  const [scraperPage, setScraperPage] = useState(false)
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [expand, setExpand] = useState(false)
  const [selectedChatWindows, setSelectedChatWindows] = useState([])
  const [latestVideo, setLatestVideo] = useState()
  const [latestBlob, setLatestBlob] = useState()
  const [newTitle, setNewTitle] = useState()
  const [subscriptionType, setSubscriptionType] = useState('monthly')
  const [totalMediaCount, setTotalMediaCount] = useState()
  const [isVideoContainer, setIsVideoContainer] = useState(false)
  const [isTimezoneScreen, setIsTimezoneScreen] = useState(false)

  useEffect(() => {}, [globalRefresh])

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
      }}
    >
      {children}
    </GlobalStatesContext.Provider>
  )
}

export default GlobalStatesContext
