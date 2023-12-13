import React, { useState, useEffect } from 'react';
import WelcomeCard from './welcomecard';
import ContactInfoCard from './ContactInfoCard';
import { Navbar, Nav } from 'react-bootstrap';
import { BsPersonX } from "react-icons/bs";
import { BsArrowRightCircle } from 'react-icons/bs';

const NewContactPage = (props) => {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(window.location.href.includes('linkedin.com/in/'));
  }, []);

  const handleRefreshClick = () => {
    setRefresh(window.location.href.includes('linkedin.com/in/'));
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

            <Navbar.Brand style={{ fontSize: '22px', color: 'black', marginLeft: '15px' }}>
              Scrape Contact
            </Navbar.Brand>
            <Nav className="margin-auto">

            <Nav.Link 
            data-mdb-toggle="tooltip"
            data-mdb-placement="bottom"
            title="Blacklist the profile"
            className="icon-button">
              <BsPersonX id='icon-style' />
            </Nav.Link>
            </Nav>

            </Navbar.Collapse>
          </Navbar>
    
    <>
      {refresh ? (
        <ContactInfoCard />
      ) : (
        <>
          <WelcomeCard />
            <div className="explainer-card"> 
                <button
                    type="button" 
                    className="mx-auto d-block mt-6 homepage-button" 
                    onClick={handleRefreshClick}
                    >
                    Load Profile Details        
                </button>
            </div>
        </>
      )}
    </>
    </div>
  );
};

export default NewContactPage;
