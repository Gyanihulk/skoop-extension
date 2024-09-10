import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../components/apiConfig';
import { toast } from 'react-hot-toast';
import GlobalStatesContext from './GlobalStates'

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
  const { setEnableTutorialScreen } = useContext(GlobalStatesContext)

  const fetchMySettings = async () => {
    try {
      let response = await fetch(API_ENDPOINTS.getMyUserSettings, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      })
      let jsonResponse = await response.json();
      if(response.ok) {
          setUserSettings(jsonResponse);
          if(jsonResponse?.show_tutorials) {
            setEnableTutorialScreen(jsonResponse?.show_tutorials)
          }

          return jsonResponse;
      } else {
        return null;
      }
      
    } catch (error) {
      console.error('Error fetching user settings:', error);
      // Handle error (e.g., show notification)
      return null;
    }
  };

  const updateUserSettings = async (settingData) => {
    try {
      if(!userSettings?.id) {
          throw new Error('User settings not found');
      }


      let res = await fetch(API_ENDPOINTS.updateUserSetting + `/${userSettings?.id}/show-tutorial`, {
        method: 'PUT',
        body: JSON.stringify(settingData),
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      let response = await res.json()
      if (res.ok) {
        toast.success(response.message);
        await fetchMySettings();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('API call failed:', err)
      toast.error(err.message)
    }
  }

  const contextValue = {
    userSettings,
    fetchMySettings,
    updateUserSettings,
  };

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export default UserSettingsContext;