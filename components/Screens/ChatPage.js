import React, { useState } from 'react';
import { BsPersonX } from "react-icons/bs";
import { BsArrowRightCircle } from 'react-icons/bs';
import ChatComponent from '../ChatWindow';

const ChatPage = (props) => {

 
    const [isChatComponentVisible, setIsChatComponentVisible] = useState(false);

  const handleGetStartedClick = () => {
    setIsChatComponentVisible(true);
  };

  const message = { message: 'ChatPage',width:"400px",height:"600px" };

  // Send the message to the background script
  chrome.runtime.sendMessage(message, function(response) {
    console.log('Received response:', response);
    if(response && response?.url.startsWith("www.linkedin.com")){
      setIsLinkedin(true)
    }
  });


  return (
    <div className="background-color">
          <div>
        {isChatComponentVisible ? (
          // <ChatComponent latestVideo={latestVideoUrl} className="top-margins" />
          <>
          </>
        ) : (
        <div className="explainer-card">    
          <div className="row justify-content-center">
            <div className="card col-md-10 mt-15">
              <div className="card-body text-center mb-6">
                <p className="paragraph-spacing">Open Messaging tab on Linkedin & then click on <strong>'Get started'</strong> button</p>
                <button
                  type="button"
                  className="btn btn-outline-primary mx-auto d-block mt-6"
                  onClick={handleGetStartedClick}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
