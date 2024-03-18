import React, { useContext, useEffect, useRef } from 'react';
import MessageContext from '../contexts/MessageContext';

const MessageWindow = () => {
    const { message,setMessage} = useContext(MessageContext)
    const textareaRef = useRef(null);

    useEffect(() => {
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
        
   
            <textarea ref={textareaRef} class="form-control" id="floatingTextarea" className="form-control auto-height-textarea" 
                placeholder='Type your message' aria-label="With textarea" 
                value={message==null?'':message} onChange={handleTextChange} ></textarea>
   
        
    );
};

export default MessageWindow;
