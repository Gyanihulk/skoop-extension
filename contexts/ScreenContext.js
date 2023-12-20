
import React, { createContext, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
    const [activePage, setActivePage] = useState('SignIn');

    const navigateToPage = (page) => {
      setActivePage(page);
    };
  return (
    <ScreenContext.Provider value={{ activePage,navigateToPage }}>
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenContext;