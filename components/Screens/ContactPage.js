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
        </>
      )}
    </>
    </div>
  );
};

export default ContactPage;
