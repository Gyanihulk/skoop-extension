
import React, { createContext, useEffect, useState } from 'react';

const GlobalStatesContext = createContext();

export const GlobalStatesProvider = ({ children }) => {
  const [latestVideoUrl,setLatestVideoUrl]=useState('')
  const [globalRefresh, setGlobalRefresh] = useState(false);
  const [isLinkedin,setIsLinkedin] = useState(false);
  const [scraperPage,setScraperPage]=useState(false)
 

  const [selectedChatWindows, setSelectedChatWindows] = useState([]);
 
useEffect(()=>{},[globalRefresh])
  

  return (
    <GlobalStatesContext.Provider value={{ globalRefresh, setGlobalRefresh ,isLinkedin,
    setIsLinkedin,
    selectedChatWindows,setSelectedChatWindows,setLatestVideoUrl,latestVideoUrl,scraperPage,setScraperPage}}>
      {children}
    </GlobalStatesContext.Provider>
  );
};

export default GlobalStatesContext;