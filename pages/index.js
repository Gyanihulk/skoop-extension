import React, { useState } from 'react';
import Index from '../components/Index';
import New from '../components/New';
import Homepage from '../components/Homepage';

export default function Home() {
  const [activePage, setActivePage] = useState('home');

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  return (
    <>
      {activePage === 'index' && <Index navigateToPage={navigateToPage} />}
      {activePage === 'new' && <New navigateToPage={navigateToPage} />}
      {activePage === 'home' && <Homepage changePage={navigateToPage} />}
    </>
  );
}
