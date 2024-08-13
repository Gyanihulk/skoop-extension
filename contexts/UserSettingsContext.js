import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../components/apiConfig';

const UserSettingsContext = createContext();

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

export const UserSettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState(null);

  const fetchMySettings = async () => {
    try {
      let response = await fetch(API_ENDPOINTS.getMyUserSettings, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      })
      response=await response.json()
      console.log(response)
      setUserSettings(response.data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
      // Handle error (e.g., show notification)
    }
  };

  const contextValue = {
    userSettings,
    fetchMySettings,
  };

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export default UserSettingsContext;