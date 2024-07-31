import React, { createContext, useContext, useState } from 'react'
import GlobalStatesContext from './GlobalStates'
import AuthContext from './AuthContext'

const MessageContext = createContext()

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState()
  const { isLinkedin, isGmail, latestVideo } = useContext(GlobalStatesContext)
  const { getVideoInfo } = useContext(AuthContext)
  const addMessage = (text) => {
    setMessage((prevMessage) => (prevMessage == null ? '' : prevMessage) + text + ' ')
  }

  const addToMessage = async (videoPlayerId, thumbnailLink = '', name = '') => {
    if (isLinkedin) {
      addMessage(`https://skoop.hubs.vidyard.com/watch/${videoPlayerId}?`)
    } else if (isGmail) {
      const videoInfo = await getVideoInfo(videoPlayerId)
      let ret = `<a href=https://skoop.hubs.vidyard.com/watch/${videoPlayerId}><p class = "inline-video-title"> Watch Video - ${name} </p><br><img src='${thumbnailLink}' class="inline-block-width"/></a>`
      addMessage(ret)
    } else {
      addMessage(`https://skoop.hubs.vidyard.com/watch/${videoPlayerId}?`)
    }
  }
  return <MessageContext.Provider value={{ message, addMessage, setMessage, addToMessage }}>{children}</MessageContext.Provider>
}

export default MessageContext
