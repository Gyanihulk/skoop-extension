import React, { useContext, useEffect, useRef } from 'react'
import MessageContext from '../contexts/MessageContext'
import { FaRegClipboard } from 'react-icons/fa'
import { handleCopyToClipboard } from '../utils'
import toast from 'react-hot-toast'
const MessageWindow = ({ flashTrigger }) => {
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
  useEffect(() => {
    if (flashTrigger) {
      // Apply flash effect
      if (textareaRef.current) {
        textareaRef.current.style.transition = 'background-color 0.5s'
        textareaRef.current.style.backgroundColor = '#eee3fc'

        // Set timeout to remove the flash after some time
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.backgroundColor = ''
          }
        }, 500) // Adjust time as needed
      }
    }
  }, [flashTrigger])
  const handleTextChange = (event) => {
    setMessage(event.target.value)
  }
  return (
    <div id="main-message-window" className="textarea-container">
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
