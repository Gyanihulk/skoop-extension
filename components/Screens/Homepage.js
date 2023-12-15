import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_ENDPOINTS from '../apiConfig.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import RecordingButton from '../VideoRecording/index.js';
import VoiceVisualization from '../AudioRecording/index.js';
import EmailComposer from '../EmailSection/index.js';
import ChatWindowSelection from '../ChatWindowSelection/index.js'
const Homepage = (props) => {
  const {setIsLinkedin,isLinkedin,setLatestVideoUrl,latestVideoUrl} = useContext(GlobalStatesContext);  


  const [aspectRatio,setAspectRatio]=useState(9/16)
 
 
  const message = { message: 'HomePage',width:"500px",height:"600px" };

  // Send the message to the background script
  chrome.runtime.sendMessage(message, function(response) {
    console.log('Received response:', response);
    if(response && response?.url.startsWith("www.linkedin.com")){
      setIsLinkedin(true)
    }
  });
 

 

  
  function convertArrayOfObjectsToCSV(data) {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(obj => Object.values(obj).join(',') + '\n');
    const csvContent= header + rows.join('');
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

  const handleRefreshClick = () => {
    setRefresh(window.location.href.includes('linkedin.com/in/'));
  };
  
 
 
   const hostUrl = new URL(window.location.href).hostname;
    console.log(window.location.href)
      if(hostUrl.startsWith("www.linkedin.com")){
    
        setIsLinkedin(true)
        console.log(hostUrl,"setting linkein true",isLinkedin);
      }
   console.log(isLinkedin,"linkedin")
  return (
    <div className="background-color">  
    

    <div className="d-flex my-4 justify-content-center mt-8">
      <RecordingButton
        aspectR={aspectRatio}
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
          <ChatWindowSelection/>
          {/* <button
            type="button" 
            className="mx-auto d-block mt-4 homepage-button" 
            onClick={() => props.changePage("NewChatPage")}
          >
            Customized DM Message Options
          </button>

          <button
            type="button" 
            className="mx-auto d-block mt-4 mb-8 homepage-button" 
            onClick={() => props.changePage("NewContactPage")}
          >
            Linked Profile Info Scraper
          </button>

          <Container className='top-margins'>
            <div className="row justify-content-center">
              <Card className="col-md-10 mt-15 mb-8">
                <CardContent className="text-center mb-6">
                  <Typography variant="h4" component="h2" gutterBottom>
                    <strong>Welcome to Skoop!</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Navigate through above buttons to get started.
                  </Typography>
                  <Link href="https://play.vidyard.com/XywsZaajMzPAB3WUima3gU" target="_blank" rel="noopener noreferrer">
                    How Skoop Works
                  </Link>
                </CardContent>
              </Card>
            </div>
          </Container> */}
          </>
      } 
    </div>
  );
};

export default Homepage;