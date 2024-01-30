import React, { useContext, useEffect, useState } from 'react';
import Homepage from '../Screens/Homepage';
import SignIn from '../Screens/SignIn';
import SignUp from '../Screens/SignUp';
import ScreenContext from '../contexts/ScreenContext';
import ChatPage from '../Screens/ChatPage';
import ContactPage from '../Screens/ContactPage';
import ProfileScraper from '../components/ProfileScraper';
import AccountSettings from '../Screens/AccountSettings';
import ForgotPassword from '../Screens/ForgotPassword';
import LoadingScreen from '../Screens/LoadingScreen';
import AuthContext from '../contexts/AuthContext';
import CalendarSync from '../Screens/CalendarSync';

export default function Home() {
    const { verifyToken ,isAutheticated,firstLogin} = useContext(AuthContext);
    const { activePage,navigateToPage } = useContext(ScreenContext);
    useEffect(() => {
        (async () => {
          const res = await verifyToken();
  
          if (isAutheticated ) {if(firstLogin){navigateToPage('CalendarSync')}else{navigateToPage('Home');}} else{navigateToPage("SignIn")}
        })();
      }, [isAutheticated]);
    return (
        <>
            {activePage === ' ' && <LoadingScreen />}
            {activePage === 'Home' && <Homepage />}
            {activePage === 'SignIn' && <SignIn />}
            {activePage === 'SignUp' && <SignUp />}
            {activePage === 'AccountSettings' && <AccountSettings />}
            {activePage=='ChatPage' && <ChatPage/>}
            {activePage=='ContactPage' && <ContactPage/>}
            {activePage=='ProfileScraper' && <ProfileScraper/>}
            {activePage=='ForgotPassword' && <ForgotPassword/>}
            {activePage=='CalendarSync' && <CalendarSync/>}
            
        </>
    );
}
