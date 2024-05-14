import React, { createContext, useEffect, useState } from "react";
import { sendMessageToBackgroundScript } from '../lib/sendMessageToBackground';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [activePage, setActivePage] = useState(" ");

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  useEffect(() => {
    const skoopExtensionBody = document.getElementById("skoop-extension-body");
    let responseHeight;
    if (activePage === 'ContactUs') {
      responseHeight = "400px";
    }
    else if (activePage === 'ReportBug') {
      responseHeight = "399px";
    }
    else if (activePage === 'SignIn' ||
      activePage === 'ForgotPassword' ||
      activePage === 'Welcome' ||
      activePage === 'SignInIntro' ||
      activePage === 'HelperVideos' ||
      activePage === 'Subscription'||
      activePage === 'PaymentScreen'||
      activePage === 'ThankYouScreen'||
      activePage === 'AccountSettings'||
      activePage === 'DevicesList'||
      activePage === 'RecordVideos'||
      activePage === 'ProfileScraper'||
      activePage === 'CalendarSync'||
      activePage === 'ContactPage'||
      activePage === 'CantUseScreen'
    ) {
      responseHeight = "600px";
    }
    else if(activePage === 'SignUp') {
      responseHeight = "660px";
    }
    if(responseHeight) {
        skoopExtensionBody.style.height = responseHeight;
        sendMessageToBackgroundScript({
        message: "resizeIframe",
        width: "355px",
        height: responseHeight,
      });
    }
  }, [activePage]);
  return (
    <ScreenContext.Provider value={{ activePage, navigateToPage }}>
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenContext;
