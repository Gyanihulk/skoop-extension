
import React, { createContext, useState } from 'react';

const GlobalStatesContext = createContext();

export const GlobalStatesProvider = ({ children }) => {
  
  const [globalRefresh, setGlobalRefresh] = useState(false);
  const [isLinkedin,setIsLinkedin] = useState(false);
  return (
    <GlobalStatesContext.Provider value={{ globalRefresh, setGlobalRefresh ,isLinkedin,setIsLinkedin}}>
      {children}
    </GlobalStatesContext.Provider>
  );
};

export default GlobalStatesContext;