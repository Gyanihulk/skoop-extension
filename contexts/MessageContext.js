import React, { createContext, useContext, useState } from 'react';
import GlobalStatesContext from './GlobalStates';
import AuthContext from './AuthContext';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState();
    const { isLinkedin, latestVideo } = useContext(GlobalStatesContext);
    const { getVideoInfo } = useContext(AuthContext);
    const addMessage = (text) => {
        setMessage((prevMessage) => (prevMessage == null ? '' : prevMessage) + text + ' ');
    };

    const addToMessage = async (videoPlayerId, thumbnailLink = '', name = '') => {
        if (isLinkedin) {
            addMessage(`https://skoop.hubs.vidyard.com/watch/${videoPlayerId}?`);
        } else {
            const videoInfo = await getVideoInfo(videoPlayerId);
            let ret = `<a href=https://skoop.hubs.vidyard.com/watch/${videoPlayerId}><img src='${thumbnailLink}' class="inline-block-width"/><br>Watch Video - ${name}</a>`;
            addMessage(ret);
        }
    };
    return (
        <MessageContext.Provider value={{ message, addMessage, setMessage, addToMessage }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageContext;
