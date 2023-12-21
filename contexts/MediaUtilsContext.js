
import React, { createContext, useEffect, useState } from 'react';
import API_ENDPOINTS from '../components/apiConfig';
const MediaUtilsContext = createContext();

export const MediaUtilsProvider = ({ children }) => {
    const getThumbnail=async(id)=>{
        try{
            var response=await fetch(API_ENDPOINTS.getThumbnail+id,{
                method: "GET",
                headers:{
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json'
                }
            });
            response=await response.json();
            return response.url;
        }catch(err){
            console.log("error while fetching thumbnails",err);
            return null
        }
    }
 

  

  return (
    <MediaUtilsContext.Provider value={{ getThumbnail}}>
      {children}
    </MediaUtilsContext.Provider>
  );
};

export default MediaUtilsContext;