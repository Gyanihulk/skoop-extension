import React, { useState } from 'react';
import Index from '../components/Index';
import New from '../components/New';
import Homepage from '../components/Homepage';
import SignIn from '../components/SignIn';
import SignUp from '../components/Screens/SignUp';
import AccountSettings from '../components/Screens/AccountSettings';

export default function Home() {
  const [activePage, setActivePage] = useState('SignIn');

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  return (
    <>
      {activePage === 'index' && <Index navigateToPage={navigateToPage} />}
      {activePage === 'new' && <New navigateToPage={navigateToPage} />}
      {activePage === 'Home' && <Homepage changePage={navigateToPage} />}
      {activePage === 'SignIn' && <SignIn changePage={navigateToPage} />}
      {activePage === 'SignUp' && <SignUp changePage={navigateToPage} />}
      {activePage === 'AccountSettings' && <AccountSettings changePage={navigateToPage} />}
    </>
  );
}

