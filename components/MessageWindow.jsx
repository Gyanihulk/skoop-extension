import React, { useContext, useEffect, useRef } from 'react';
import MessageContext from '../contexts/MessageContext';

const MessageWindow = () => {
    const { message,setMessage} = useContext(MessageContext)
    const textareaRef = useRef(null);

    useEffect(() => {
        // Adjust the textarea height based on content
        const adjustHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'; 
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
        };

        adjustHeight();
    }, [message]); 

    const handleTextChange = (event) => {
        setMessage(event.target.value);
    };
    return (
        <div class="input-group">
            <textarea ref={textareaRef} class="form-control" className="form-control auto-height-textarea" 
                aria-label="With textarea" 
                value={message} onChange={handleTextChange} ></textarea>
                {console.log(message)}
        </div>
    );
};

export default MessageWindow;
