
import React, { createContext, useState } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState();

    const addMessage = (text) => {
       setMessage(prevMessage => (prevMessage==null?"":prevMessage) + text +" ");
    };
  return (
    <MessageContext.Provider value={{ message,addMessage ,setMessage}}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;