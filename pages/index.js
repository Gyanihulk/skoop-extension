import React, { useContext, useEffect, useState } from 'react';
import Homepage from '../components/Screens/Homepage';
import SignIn from '../components/Screens/SignIn';
import SignUp from '../components/Screens/SignUp';
import ScreenContext from '../contexts/ScreenContext';
import ChatPage from '../components/Screens/ChatPage';
import ContactPage from '../components/Screens/ContactPage';
import LinkedInCom from '../components/LinkedinCom';
import AccountSettings from '../components/Screens/AccountSettings';
import ForgotPassword from '../components/Screens/ForgotPassword';
import LoadingScreen from '../components/Screens/LoadingScreen';
import AuthContext from '../contexts/AuthContext';

export default function Home() {
 
    const { verifyToken } = useContext(AuthContext);
    const { activePage,navigateToPage } = useContext(ScreenContext);

    useEffect(() => {
        (async () => {
          const res = await verifyToken();
          console.log(res,"from index")
          if (res.ok) {navigateToPage('Home');} else{navigateToPage("SignIn")}
        })();
      }, []);
 
    return (
        <>
            {activePage === ' ' && <LoadingScreen />}
            {activePage === 'Home' && <Homepage />}
            {activePage === 'SignIn' && <SignIn />}
            {activePage === 'SignUp' && <SignUp />}
            {activePage === 'AccountSettings' && <AccountSettings />}
            {activePage=='ChatPage' && <ChatPage/>}
            {activePage=='ContactPage' && <ContactPage/>}
            {activePage=='LinkedInCom' && <LinkedInCom/>}
            {activePage=='ForgotPassword' && <ForgotPassword/>}
        </>
    );
}
