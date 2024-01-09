
import React, { createContext, useState } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState("null");

    const addMessage = (text) => {
       setMessage(prevMessage => prevMessage + text);
      console.log(message)
    };
  return (
    <MessageContext.Provider value={{ message,addMessage ,setMessage}}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;