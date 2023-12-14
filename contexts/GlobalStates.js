
import React, { createContext, useState } from 'react';

const GlobalStatesContext = createContext();

export const GlobalStatesProvider = ({ children }) => {
  
  const [globalRefresh, setGlobalRefresh] = useState(false);
  const [isLinkedin,setIsLinkedin] = useState(false);
  const [selectedVideoStyle, setSelectedVideoStyle] = useState(null);
  const [aspectRatio,setAspectRatio]=useState(9/16)
  

 
  const handleVideoStyleSelect = (style) => {
    setSelectedVideoStyle(style);

    if(style === 'Square'){
      setAspectRatio(1);
    }
    else if(style === 'Vertical Mode'){
      setAspectRatio(9/16);
    }
    else{
      setAspectRatio(16/9);
    }
    console.log(`Selected Video Style: ${style}`);
    handleClose();
  };
  

  return (
    <GlobalStatesContext.Provider value={{ globalRefresh, setGlobalRefresh ,isLinkedin,setIsLinkedin,selectedVideoStyle,handleVideoStyleSelect}}>
      {children}
    </GlobalStatesContext.Provider>
  );
};

export default GlobalStatesContext;