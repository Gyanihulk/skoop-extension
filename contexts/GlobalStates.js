
import React, { createContext, useEffect, useState } from 'react';

const GlobalStatesContext = createContext();

export const GlobalStatesProvider = ({ children }) => {
  const [latestVideoUrl,setLatestVideoUrl]=useState('')
  const [globalRefresh, setGlobalRefresh] = useState(false);
  const [isLinkedin,setIsLinkedin] = useState(false);
  const [isProfilePage,setIsProfilePage] = useState(false);
  const [scraperPage,setScraperPage]=useState(false)
  const [focusedElementId,setFocusedElementId]=useState(null);

  const [selectedChatWindows, setSelectedChatWindows] = useState([]);
 
useEffect(()=>{},[globalRefresh])
  

  return (
    <GlobalStatesContext.Provider value={{ globalRefresh, setGlobalRefresh ,isLinkedin,
      setIsLinkedin,
      selectedChatWindows,setSelectedChatWindows,
      setLatestVideoUrl,latestVideoUrl,
      isProfilePage,setIsProfilePage,
      scraperPage,setScraperPage,
      focusedElementId,setFocusedElementId
    }}>
      {children}
    </GlobalStatesContext.Provider>
  );
};

export default GlobalStatesContext;