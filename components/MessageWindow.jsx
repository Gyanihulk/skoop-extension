import React, { useContext, useEffect, useRef } from 'react'
import MessageContext from '../contexts/MessageContext'
import { FaRegClipboard } from 'react-icons/fa'
import { handleCopyToClipboard } from '../utils'
import toast from 'react-hot-toast'
const MessageWindow = () => {
  const { message, setMessage } = useContext(MessageContext)
  const textareaRef = useRef(null)

  useEffect(() => {
    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }

    adjustHeight()
  }, [message])

  const handleTextChange = (event) => {
    setMessage(event.target.value)
  }
  return (
    <div className="textarea-container">
      <textarea
        ref={textareaRef}
        rows="4"
        id="floatingTextarea"
        className="form-control auto-height-textarea"
        placeholder="Type your message..."
        aria-label="With textarea"
        value={message == null ? '' : message}
        onChange={handleTextChange}
      ></textarea>
    </div>
  )
}

export default MessageWindow
