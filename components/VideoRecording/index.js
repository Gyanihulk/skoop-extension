import React, { useState, useEffect ,useContext} from 'react'
import Webcam from "react-webcam"
import { UserInput } from '../UserInput/index.js';
import API_ENDPOINTS from '../apiConfig.js';
import { FaDownload } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { FaRegCirclePlay} from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { IoLinkSharp } from "react-icons/io5";
import {getCurrentDateTimeString, insertHtmlAtPositionInMail,
        insertIntoLinkedInMessageWindow,
        replaceInvalidCharacters} from '../../utils/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import { PiExportFill } from "react-icons/pi";
import toast, { Toaster } from 'react-hot-toast';

const RecordingButton = ({ aspectR,setUrlAtHome }) => {

  const webcamRef = React.useRef(null)
  const mediaRecorderRef = React.useRef(null)
  const [capturing, setCapturing] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [prev,setPrev]=useState('')
  const [time, setTime] = useState(0);
  const [videoId,setVideoId]= useState('')
  const [countdown,setCountdown]= useState(false)
  const [countTimer,setCountTimer]= useState(0)
  const [isUploading,setIsUploading] = useState(false)
  const [showSuccess,setShowSuccess]= useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [initialX, setInitialX] = useState(-1*200/4)
  const [initialY, setInitialY] = useState(-1*200/8)
  const [currentX, setCurrentX] = useState(-1*200/4)
  const [currentY, setCurrentY] = useState(-1*200/8)
  const [init,setInit] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const { globalRefresh, setGlobalRefresh,isLinkedin } = useContext(GlobalStatesContext)

  const handleInsertion=()=>{
    if(isLinkedin){
      console.log("calling insertIntoLinkedInMessageWindow function ")
      insertIntoLinkedInMessageWindow(`<p>https://share.vidyard.com/watch/${videoId}</p>`)
    }
    else{
      insertHtmlAtPositionInMail(`<a href=https://share.vidyard.com/watch/${videoId}>Play</a>`)
    }
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setInitialX(e.clientX - currentX)
    setInitialY(e.clientY - currentY)
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      setCurrentX(e.clientX - initialX)
      setCurrentY(e.clientY - initialY)
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleIcon = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  useEffect(() => {
    console.log(initialX,initialY,currentX,currentY)
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    };
  }, [isDragging]);

  const Constraints={
      aspectRatio: aspectR
  };

  const startCountdown=async()=>{
    try {
      
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      console.log(permissionStatus)
      if (permissionStatus.state === 'granted') {
        setTime(0)
        setVideoId('')
        setInit(true)
        await new Promise(r => setTimeout(r, 2000)); // to let the camera initialize
        setRecordedChunks([])
        setCountdown(true)
      } else {
        throw Error("please provide permission to use camera")
      }
    } catch (error) {
      alert(error)
    }
  }
  
  const handleStartCaptureClick = React.useCallback(() => {
    setCountdown(false)
    setCountTimer(0)
    setCapturing(true)
    setPrev('')
    try{
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }catch(err){
      alert("some error occured while recording please try again")
    }
  }, [webcamRef, setCapturing, mediaRecorderRef])

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data))
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop()
    setCapturing(false)
    setInit(false)
  }, [mediaRecorderRef, webcamRef, setCapturing])

  const handleShare =async(videoTitle,directoryName)=>{
    if(recordedChunks.length){
      console.log("uploading the video")
      try{
        const blob = new Blob(recordedChunks, {
          type: 'video/webm'
        });
        var title1=videoTitle
        videoTitle=replaceInvalidCharacters(videoTitle+`_${Date.now()}`)
        const formData = new FormData()
        let file = new File([blob], 'recording')
        formData.append('data', file,`${videoTitle}.webm`)
        const customHeaders = new Headers();
        customHeaders.append('title', videoTitle)
        customHeaders.append('directory_name', directoryName)
        customHeaders.append('type', 'webm')
        customHeaders.append('authorization', `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`)
        customHeaders.append('title1',title1)
        setIsUploading(true);
        const loadingObj=toast.loading("uploading video...")
        var response=await fetch(API_ENDPOINTS.vidyardUpload,{
          method: "POST",
          headers: customHeaders,
          body: formData
        })
        response=await response.json();
        console.log(response,"response of video ");
        toast.success("video uploaded,encoding in progress",{
          id: loadingObj
        })
        setIsUploading(false);
        setUrlAtHome(`https://play.vidyard.com/${response.facade_player_uuid}`)
        setVideoId(response.facade_player_uuid)
        console.log("the response after vidyard upload request",response)
        setGlobalRefresh(true)
      }catch(err){
        toast.dismiss()
        console.log(err,"err of video upload")
        toast.error("could not upload")
      }
    }
    else {
      console.log("recorded chunks not available yet")
    }
  }

  const preview=()=>{
    if(prev!=''){
      setPrev('')
      toggleIcon(); 
      return 
    }
    if(recordedChunks.length){
      const blob = new Blob(recordedChunks, {
        type: "video/mp4"
      })
      setPrev(URL.createObjectURL(blob))
    }
    toggleIcon();
  }

  
  useEffect(() => {
    let intervalId
    if (capturing) {
      intervalId = setInterval(() => setTime(time + 1), 1000)
      if(time==60){
        handleStopCaptureClick();
      }
    }
    return () => clearInterval(intervalId)
  }, [capturing, time])

  useEffect(() => {
    let intervalId
    if (countdown) {
      intervalId = setInterval(() => setCountTimer(countTimer + 1), 1000)
      if(countTimer==3){
        handleStartCaptureClick();
      }
    }
    return () => clearInterval(intervalId)
  }, [countdown,countTimer])

  useEffect(()=>{
    if(recordedChunks.length){
      console.log("handle share is called");
      handleShare(getCurrentDateTimeString(),"Media");
    }
  },[recordedChunks])

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      document.body.appendChild(a)
      a.style = "display: none"
      a.href = url
      a.target = '_blank'
      a.download = "Skoop video.webm"
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }, [recordedChunks]);
  
  const handleClick2=()=>{
    if(capturing){
      sendMessageToBackgroundScript({ message: 'stopRecording' });
    }
    else {sendMessageToBackgroundScript({ message: 'startRecording' });}
    setCapturing(!capturing);
  }

  const displayForPreview=()=>{
    if(prev=='' || capturing) return 'none'
    return 'inline-block'
  }
  
  function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(message);
  }
  const handleClick=()=>{
    if(capturing){
      handleStopCaptureClick()
    }
    else startCountdown()
  }
  return (
    <div id="homeDiv">
      <div>
        <Toaster position='top-right'/>
        {!countdown && <>
            <button
            variant="outlined"
            color={capturing ? 'secondary' : 'primary'}
            onClick={handleClick}
            size='small'
            disabled={isUploading} 
            id='skoop_record_button'
            >
            {capturing ? 'Stop' : 'Rec'}
          </button>
          
          </>
          
        }
        <button
            variant="outlined"
            color={capturing ? 'secondary' : 'primary'}
            onClick={handleClick2}
            size='small'
            disabled={isUploading} 
          >
            {capturing ? 'Stop' : 'Rec'}
          </button>
      </div>
      

      <div style={{
        position: 'fixed',
        cursor: 'move',
        transform: `translate(${currentX}px, ${currentY}px)`,
        textAlign: 'center'
        }}
        onMouseDown={handleMouseDown}
        >
           {countdown && (
              <div className="text-center">
                <h1 style={{ color: 'red', fontSize: 100, marginTop:'15px' }}>
                  {3 - countTimer}
                </h1>
              </div>
            )}
           {init === true && (
            <div className="card" style={{ zIndex: '10000', textAlign: 'center',width: '100%' ,display: 'block', height: '150%'}}>
            <Webcam audio={true} ref={webcamRef} videoConstraints={Constraints} muted style={{display :'block' , width: '100%', height: '100%', zindex: "30000"}} />
            <h4>
            {`Time remaining: ${60 - time} Seconds`}
            </h4>
          </div>
        )}
        </div>
        <div>
        {!capturing && !isUploading && recordedChunks.length > 0 && (
          <>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <button 
                data-mdb-toggle="tooltip"
                data-mdb-placement="bottom"
                title="Download the recorded video"
                style={{ border: 'none', background: 'none', marginRight: '10px' }}
                onClick={handleDownload}
              >
                <FaDownload id='mail_icons'/>
              </button>

              <button 
                data-mdb-toggle="tooltip"
                data-mdb-placement="bottom"
                title={isPlaying ? 'Close the Preview video' : 'Play the recorded video'}
                style={{ border: 'none', background: 'none', marginRight: '10px' }}
                onClick={preview}
              >
                {isPlaying ? <FaTimesCircle id="mail_icons" /> : <FaRegCirclePlay id="mail_icons" />}
              </button>

              <button 
                data-mdb-toggle="tooltip"
                data-mdb-placement="bottom"
                title="Delete the video"
                style={{ border: 'none', background: 'none' }}
                onClick={() => {setPrev(''); setRecordedChunks([])}}
              >
                <MdDeleteForever id='mail_icons'/>
              </button>
            </div>

            {videoId !== '' && (
              <>
                <button 
                  data-mdb-toggle="tooltip"
                  data-mdb-placement="bottom"
                  title="export to text area"
                  className='homepage-button'
                  onClick={handleInsertion}
                >
                  Send to Chat
                </button>
              </>
            )}
          </>
        )}
      </div>
           { /*<button 
                  data-mdb-toggle="tooltip"
                  data-mdb-placement="bottom"
                  title="Copy video link"
                  style={{ border: 'none', background: 'none', marginRight: '10px' }}
                  onClick={() => {navigator.clipboard.writeText(`https://share.vidyard.com/watch/${videoId}`)}}
                >
                  <IoLinkSharp id='mail_icons'/>
            </button>*/ }

        <div>
          {prev!='' && 
            <div style={{ textAlign: 'center', display: 'inline-block' }}>
            {prev !== '' && (
              <div className="card">
                <div className="embed-responsive embed-responsive-16by9">
                  <video
                    className="embed-responsive-item"
                    src={prev}
                    style={{ display: `${displayForPreview()}`, width: '100%', height: '100%' }}
                    autoPlay
                    muted
                    loop
                    controls
                  ></video>
                </div>
              </div>
            )}
          </div>
          }
        </div>
    </div>
  );
};

export default RecordingButton



