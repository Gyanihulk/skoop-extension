
import React, { createContext, useEffect, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
    const [activePage, setActivePage] = useState(' ');
    
    const navigateToPage = (page) => {
      setActivePage(page);
    };
    useEffect(()=>{
// if(activePage=="Home"){
//   sendMessageToBackgroundScript({ message: 'HomePage' });
// }else if(["Welcome", "SignInIntro", "SignIn","SignUp"].includes(activePage)){
//   sendMessageToBackgroundScript({ message: 'Welcome' });
// }

    },[activePage])
  return (
    <ScreenContext.Provider value={{ activePage,navigateToPage }}>
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenContext;