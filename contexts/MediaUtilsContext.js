
import React, { createContext, useEffect, useState } from 'react';
import API_ENDPOINTS from '../components/apiConfig';
import toast from 'react-hot-toast';

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
            console.log(response)
            response=await response.json();
            return response.url;
        }catch(err){
            console.log("error while fetching thumbnails",err);
            return null
        }
    }
 

    const deleteVideo=async (id)=>{
      const toastId=toast.loading("Deleting video");
      try{
          
          const response = await fetch(`${API_ENDPOINTS.deleteVideo}${id}`,{
              method: "DELETE",
              headers:{
                  "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                  'Content-Type': 'application/json'
              }
          })
          if(!response.ok){
            throw Error;
          }
          toast.success("Video deleted",{id: toastId});
          return true;
      }catch(err){
          toast.error("Could not delete",{id: toastId});
          return false;
      }
    }

  return (
    <MediaUtilsContext.Provider value={{ getThumbnail,deleteVideo}}>
      {children}
    </MediaUtilsContext.Provider>
  );
};

export default MediaUtilsContext;