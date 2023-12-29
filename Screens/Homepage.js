import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PiSwap } from 'react-icons/pi';
import API_ENDPOINTS from '../components/apiConfig.js';
import GlobalStatesContext from '../contexts/GlobalStates.js';
import RecordingButton from '../components/VideoRecording/index.js';
import VoiceVisualization from '../components/AudioRecording/index.js';
import EmailComposer from '../components/EmailSection/index.js';
import LinkedInCom from '../components/LinkedinCom/index.js';
import ChatComponent from '../components/ChatWindow/index.js';
import ChatWindowSelection from '../components/ChatWindowSelection/index.js';
const Homepage = (props) => {
  const {setIsLinkedin,isLinkedin,setLatestVideoUrl,isProfilePage,setIsProfilePage} = useContext(GlobalStatesContext); 

    function convertArrayOfObjectsToCSV(data) {
        const header = Object.keys(data[0]).join(',') + '\n';
        const rows = data.map((obj) => Object.values(obj).join(',') + '\n');
        const csvContent = header + rows.join('');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        //const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'skoop_contacts_data.csv';
        link.click();
    }

  const handleExportCsv=async()=>{
    try{
      var response=await fetch(API_ENDPOINTS.skoopCrmGetAllData,{
        method: "GET",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      response=await response.json()
      const keysToRemove=['username','id']
      response.map(obj => {
        keysToRemove.forEach(key => delete obj[key]);
        return obj;
      });
      convertArrayOfObjectsToCSV(response)
    }catch(err){
      alert("some error occured while exporting csv",err)
    }
  }
  
  const messageHandler = (message) => {
    if (message.action === 'skoopMsgIsProfilePage') {
        setIsProfilePage(true);
        console.log("is profile page message received");
    } else if (message.action === 'skoopMsgIsNotProfilePage') {
        setIsProfilePage(false);
        console.log("is not a profile page");
    }
  };

  useEffect(()=>{
    try{
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const targetTab=tabs[0];
          if (targetTab.url.includes("linkedin")) {
            setIsLinkedin(true);
            if(targetTab.url.includes("www.linkedin.com/in")){
              setIsProfilePage(true);
            }
          }
          else{
            console.log("the target tab is not accessible");
          }
      });
    }catch(err){
        console.log("some error occured while setting up initial array")
    }
    chrome.runtime.onMessage.addListener(messageHandler);
    return () => {
        chrome.runtime.onMessage.removeListener(messageHandler);
    };
  },[])
   
  return (
    <div className="background-color">
      <div className="d-flex my-4 justify-content-center mt-8">
      <RecordingButton
        setUrlAtHome={(input) => {
        setLatestVideoUrl(input);
        }}
      />
      <div className="mx-4"></div>
        <VoiceVisualization
        setUrlAtHome={(input) => {
        setLatestVideoUrl(input);
        }}
      />
    </div>
       
    {!isLinkedin && <EmailComposer />}
      {isLinkedin  &&
          <>
          {isProfilePage &&
            <LinkedInCom/>
          }
          <ChatComponent/>
          <ChatWindowSelection/>
          </>
      } 
    </div>
  );
};

export default Homepage;
