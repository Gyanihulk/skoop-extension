import React, { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
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
    {/*<Navbar className="nav-bar" expand="lg">
      <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
            <Nav.Link
              data-mdb-toggle="tooltip"
              data-mdb-placement="bottom"
              title="Back to Home"
              onClick={() => props.changePage("Home")}
              style={{
                paddingRight: '15px', 
                marginLeft: '15px', 
              }}
            >
              <BsArrowRightCircle id="skoop_icons" style={{ fontSize: '30px' }} />
            </Nav.Link>

            <Navbar.Brand class='brand-text'>
              Messaging Options
            </Navbar.Brand>

            </Navbar.Collapse>
            </Navbar> */}
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
                <Button 
                    variant="outline-primary"
                    className="mx-auto d-block mt-6"
                    onClick={handleGetStartedClick}>
                    Get Started
                </Button>
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
