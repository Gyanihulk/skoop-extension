import React, { useContext, useState } from 'react';
import Homepage from '../components/Screens/Homepage';
import SignIn from '../components/Screens/SignIn';
import SignUp from '../components/Screens/SignUp';
import AccountSettings from '../components/Screens/AccountSettings';
import ScreenContext from '../contexts/ScreenContext';

export default function Home() {
const{activePage}=useContext(ScreenContext)
async function requestAccess() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    // Access granted, you can now use the stream
  } catch (error) {
    // Access denied or other error
  }
}
requestAccess()
  return (
    <>
      {activePage === 'Home' && <Homepage />}
      {activePage === 'SignIn' && <SignIn />}
      {activePage === 'SignUp' && <SignUp />}
      {activePage === 'AccountSettings' && <AccountSettings />}
    </>
  );
}

