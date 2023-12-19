import React, { useContext, useEffect, useState } from 'react';
import Homepage from '../components/Screens/Homepage';
import SignIn from '../components/Screens/SignIn';
import SignUp from '../components/Screens/SignUp';
import ScreenContext from '../contexts/ScreenContext';
import ChatPage from '../components/Screens/ChatPage';
import ContactPage from '../components/Screens/ContactPage';
import LinkedInCom from '../components/LinkedInCom';
import AccountSettings from '../components/Screens/AccountSettings';

export default function Home() {
    const { activePage } = useContext(ScreenContext);
    async function requestAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            // Access granted, you can now use the stream
        } catch (error) {
            // Access denied or other error
        }
    }
    // requestAccess()
    useEffect(() => {
        const iframeElement = document.getElementById('skoop-extension-iframe');
        console.log(iframeElement);
        if (iframeElement) {
            const width = iframeElement.offsetWidth;
            const height = iframeElement.offsetHeight;

            console.log('Width:', width, 'Height:', height);
        } else {
            console.log('Element not found');
        }
    }, []);
    return (
        <>
            {activePage === 'Home' && <Homepage />}
            {activePage === 'SignIn' && <SignIn />}
            {activePage === 'SignUp' && <SignUp />}
            {activePage === 'AccountSettings' && <AccountSettings />}
            {activePage=='ChatPage' && <ChatPage/>}
            {activePage=='ContactPage' && <ContactPage/>}
            {activePage=='LinkedInCom' && <LinkedInCom/>}
        </>
    );
}
