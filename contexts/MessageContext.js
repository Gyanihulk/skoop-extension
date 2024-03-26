
import React, { createContext, useContext, useState } from 'react';
import GlobalStatesContext from './GlobalStates';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState();
const {isLinkedin,latestVideo}=useContext(GlobalStatesContext)
    const addMessage = (text) => {
       setMessage(prevMessage => (prevMessage==null?"":prevMessage) + text +" ");
    };
    
    const addToMessage = async (videoPlayerId,thumbnailLink="") => {
      if (isLinkedin) {
          addMessage(
              `https://skoop.hubs.vidyard.com/watch/${videoPlayerId}?`
          );
      } else {
             let ret = `<a href=https://skoop.hubs.vidyard.com/watch/${videoPlayerId}><img src='${thumbnailLink}' class="inline-block-width"/><br>Watch Video - ${latestVideo?.name}</a>`;
          addMessage(
              ret 
          );
      }
  };
  return (
    <MessageContext.Provider value={{ message,addMessage ,setMessage,addToMessage}}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;