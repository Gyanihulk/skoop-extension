import React, { useState, useEffect } from 'react';
import { BsPersonX } from "react-icons/bs";
import { BsArrowRightCircle } from 'react-icons/bs';
import ContactInfoCard from "../ContactInfo/index.js"
const ContactPage = () => {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(window.location.href.includes('linkedin.com/in/'));
  }, []);

  const handleRefreshClick = () => {
    setRefresh(window.location.href.includes('linkedin.com/in/'));
  };

  return (
    <div className="background-color">
       
    
    <>
    <ContactInfoCard />
      {refresh ? (
        <ContactInfoCard />
      ) : (
        <>
          {/* <WelcomeCard /> */}
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

export default ContactPage;
