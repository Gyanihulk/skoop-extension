import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import API_ENDPOINTS from '../components/apiConfig.js';
import GlobalStatesContext from '../contexts/GlobalStates.js';
import RecordingButton from '../components/RecordingButton/index.js';

import MessageComposer from '../components/MessageComposer/index.js';
import { VideoPreview } from '../components/videoPreview.jsx';
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
const Homepage = (props) => {
    const {
        setIsLinkedin,
        setIsProfilePage,
        setFocusedElementId,
    } = useContext(GlobalStatesContext);

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

    const handleExportCsv = async () => {
        try {
            var response = await fetch(API_ENDPOINTS.skoopCrmGetAllData, {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            response = await response.json();
            const keysToRemove = ['username', 'id'];
            response.map((obj) => {
                keysToRemove.forEach((key) => delete obj[key]);
                return obj;
            });
            convertArrayOfObjectsToCSV(response);
        } catch (err) {
            alert('some error occured while exporting csv', err);
        }
    };

    const messageHandler = (message) => {
        if (message.action === 'skoopMsgIsProfilePage') {
            setIsProfilePage(true);
        } else if (message.action === 'skoopMsgIsNotProfilePage') {
            setIsProfilePage(false);
        } else if (message.action === 'skoopFocusedElementChanged') {
            setFocusedElementId(message.elementId);
        }
    };
    // const {isLoading, error, data, getData} = useVisitorData(
    //     {extendedResult: true},
    //     {immediate: true}
    //   );
    
    //   // Using useEffect to call getData on component mount
    //   useEffect(() => {
    //     console.log("Component mounted. Calling getData...");
    //     getData({ignoreCache: true});
    //     if (isLoading) {
    //         console.log("Loading visitor data...");
    //       }
        
    //       // Log any error that occurs during data fetching
    //       if (error) {
    //         console.error("Error fetching visitor data:", error.message);
    //       }
        
    //       // Log the data once it is loaded
    //       if (data) {
    //         console.log("Visitor data loaded:", data);
    //       }
    //   }, []);

    useEffect(() => {
        if(chrome.runtime.onMessage){
        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const targetTab = tabs[0];
                if (targetTab.url.includes('linkedin')) {
                    setIsLinkedin(true);
                    if (targetTab.url.includes('www.linkedin.com/in')) {
                        setIsProfilePage(true);
                    }
                } else {
                    console.log('the target tab is not accessible');
                }
            });
        } catch (err) {
            console.log('some error occured while setting up initial array');
        }
        chrome.runtime.onMessage.addListener(messageHandler);
        return () => {
            chrome.runtime.onMessage.removeListener(messageHandler);
        };}
    }, []);

    return (
        <div className='mt-4'>
            <RecordingButton />
       <VideoPreview/>
            <MessageComposer />

        </div>
    );
};

export default Homepage;
