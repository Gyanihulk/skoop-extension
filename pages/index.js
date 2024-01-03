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
            {activePage=='ProfileScraper' && <ProfileScraper/>}
            {activePage=='ForgotPassword' && <ForgotPassword/>}
        </>
    );
}
