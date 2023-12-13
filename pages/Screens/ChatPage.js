import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import ChatComponent from './Chat'; 
import { BsPersonX } from "react-icons/bs";
import { BsArrowRightCircle } from 'react-icons/bs';

const NewChatPage = (props) => {

    const [latestVideoUrl,setLatestVideoUrl]=useState('')
    const [isChatComponentVisible, setIsChatComponentVisible] = useState(false);

  const handleGetStartedClick = () => {
    setIsChatComponentVisible(true);
  };


  return (
    <div className="background-color">
    <Navbar className="nav-bar" expand="lg">
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
          </Navbar>
          <div>
        {isChatComponentVisible ? (
          <ChatComponent latestVideo={latestVideoUrl} className="top-margins" />
        ) : (
        <div className="explainer-card">    
          <div className="row justify-content-center">
            <div className="card col-md-10 mt-15">
              <div className="card-body text-center mb-6">
                <p className="paragraph-spacing">Open Messaging tab on Linkedin & then click on <strong>'Get started'</strong> button</p>
                <button 
                    className="mx-auto d-block mt-6 homepage-button"
                    onClick={handleGetStartedClick}>
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

export default NewChatPage;
