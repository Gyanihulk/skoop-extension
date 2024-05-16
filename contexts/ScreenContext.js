import React, { createContext, useEffect, useState } from "react";

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [activePage, setActivePage] = useState(" ");

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  useEffect(() => {
  }, [activePage]);
  return (
    <ScreenContext.Provider value={{ activePage, navigateToPage }}>
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenContext;
