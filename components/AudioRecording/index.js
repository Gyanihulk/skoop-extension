import React, { useState, useEffect,useContext } from 'react';
import { AiFillAudio } from "react-icons/ai";
import { UserInput } from '../UserInput/index.js';
import { MdFileUpload } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { FaStop } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import API_ENDPOINTS from '../apiConfig.js';
import {getCurrentDateTimeString, replaceInvalidCharacters} from '../../utils/index.js';
import { insertIntoLinkedInMessageWindow, insertHtmlAtPositionInMail } from '../../utils/index.js';
import { PiExportFill } from "react-icons/pi";
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import Loader from '../Loaders/index.js';
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js';

const VoiceVisualization = (props) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [visualizationUrl, setVisualizationUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTakingInput,setIsTakingInput]= useState(false);
  const [isUploading,setIsUploading] = useState(false)
  const [showSuccess,setShowSuccess]= useState(false);
  const [time,setTime]=useState(0);
  const [duration,setDuration]=useState(0);
  const [videoPlayerId,setVideoPlayerId]=useState(null);
  const [videoId,setVideoId] = useState('');
  const { globalRefresh, setGlobalRefresh,isLinkedin } = useContext(GlobalStatesContext)
  const { getThumbnail } = useContext(MediaUtilsContext);
  
  useEffect(() => {
    let intervalId
    if (isRecording) {
      intervalId = setInterval(() => setTime(time + 1), 1000);
      if(time==60){
        stopRecording();
      }
    }
    return () => clearInterval(intervalId)
  }, [isRecording, time])
  
  useEffect(()=>{
    if(visualizationUrl!=''){
      console.log("handle Share in voice memo called");
      handleShare(getCurrentDateTimeString(),"Media");
    }
  },[visualizationUrl])
  
  const handleInsertion=async()=>{
    if(isLinkedin){
      insertIntoLinkedInMessageWindow(`<p>https://share.vidyard.com/watch/${videoPlayerId}</p>`)
    }
    else{
      const thumbnail_link=await getThumbnail(videoId);
      var ret=''
      if(thumbnail_link!=undefined && thumbnail_link!=null){
          ret=`<img src='${thumbnail_link}' style={{width: '200px' ,display: 'inline-block'}}/><br>`
      }
      insertHtmlAtPositionInMail(
          ret+`<a href=https://share.vidyard.com/watch/${videoPlayerId}>Play</a>`
      );
    }
  }

  const handleShare =async(audioTitle,directoryName)=>{
    try{
      var title1=audioTitle
      audioTitle=replaceInvalidCharacters(audioTitle+`_${Date.now()}`);
      const blobres = await fetch(visualizationUrl);
      const blob = await blobres.blob();
      const formData = new FormData();
      let file = new File([blob], 'recording');
      formData.append('data', file,`${audioTitle}.wav`);
      const customHeaders = new Headers();
      customHeaders.append('title', audioTitle);
      customHeaders.append('directory_name', directoryName);
      customHeaders.append('duration', duration);
      customHeaders.append('type', 'wav');
      customHeaders.append('authorization', `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`);
      customHeaders.append('title1',title1);
      setIsUploading(true)
      var response=await fetch(API_ENDPOINTS.vidyardUpload,{
          method: "POST",
          headers: customHeaders,
          body: formData
      })
      response=await response.json();
      setIsUploading(false)
      props.setUrlAtHome(`https://play.vidyard.com/${response.facade_player_uuid}`);
      setVideoPlayerId(response.facade_player_uuid);
      console.log("the response after vidyard upload request",response);
      setVideoId(response.id);
      setGlobalRefresh(true)
      setShowSuccess(true)
      setTimeout(()=>{setShowSuccess(false)},3000)
    }catch(err){
      console.log("error uploading voice memo ",err);
      alert("could not upload the video");
    }
  }

  const startRecording = async () => {
    try {
        setVideoPlayerId(null)
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const chunks = [];
        const recorder = new MediaRecorder(micStream);
        recorder.ondataavailable = event => {
        chunks.push(event.data);
        };
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setVisualizationUrl(audioUrl);
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
    } catch (error) {
        alert("please provide the permission to access your microphone")
        return ;
    }
    
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
    setDuration(time)
    setTime(0);
  };
  
  const downloadAudio = () => {
    const a = document.createElement('a');
    a.href = visualizationUrl;
    a.download = 'voice_visualization.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sharingDetails=(audioTitle,directoryName)=>{
    setIsTakingInput(false)
    handleShare(audioTitle,directoryName)
  }

  if(isTakingInput){
    return(
      <UserInput sharingDetails={sharingDetails} cancelUpload={()=>{setIsTakingInput(false)}}/>
    )
  }

  const iconaudio = {
    fontSize: '30px',
    color: 'black',
    marginRight: '20px',
  };

  if(isUploading){
    return (
      <Loader title="Uploading..."/>
    )
  }

  return (
    <div id="homeDiv">
        <div>
        <button
            onClick={isRecording ? stopRecording : startRecording}
            id='skoop_record_button_audio'
            data-mdb-toggle="tooltip"
            data-mdb-placement="bottom"
            title="Record Audio"
            >
            {isRecording ? < FaStop size={30} color='white'/>: <AiFillAudio size={30} color='white'/>}  
        </button>
        </div>
        <div>
          {isRecording &&
            <h1>{60-time} seconds left</h1>
          }
        </div>
        <div>
            {visualizationUrl && (
                <video  controls src={visualizationUrl}></video>
            )}
        </div>
      <div>
      {visualizationUrl && (
        <>
          
          <IoMdDownload 
          data-mdb-toggle="tooltip"
          data-mdb-placement="bottom"
          title="Download Video"
          style={iconaudio} onClick={downloadAudio} />
  
          <MdDeleteForever 
          data-mdb-toggle="tooltip"
          data-mdb-placement="bottom"
          title="Delete File"
          style={iconaudio} onClick={() => setVisualizationUrl('')} />

          {videoPlayerId &&
            <> 
              <IoLink
              data-mdb-toggle="tooltip"
              data-mdb-placement="bottom"
              title="Copy Link"
              style={iconaudio} onClick={() => {navigator.clipboard.writeText(`https://share.vidyard.com/watch/${videoPlayerId}`)}}
              />

              <PiExportFill
              data-mdb-toggle="tooltip"
              data-mdb-placement="bottom"
              title="Copy Link"
              style={iconaudio} onClick={handleInsertion}
              />
            </>
          }
          {showSuccess && (
        <div className="alert alert-success" role="alert" style={{ borderRadius: '4px'}}>
          Audio Uploaded, Transcoding will take a few minutes
        </div>
      )}
      </>
      )}
      
      </div>
      
    </div>
  );
};

export default VoiceVisualization;