import React, { useContext, useRef, useEffect, useState } from 'react'
import GlobalStatesContext from '../../contexts/GlobalStates.js'
import AuthContext from '../../contexts/AuthContext.js';
import { IoMdClose } from 'react-icons/io'
import { TbMessage2Plus } from 'react-icons/tb'
import { BiSolidVideoRecording } from 'react-icons/bi'
import { FaCalendarDay } from 'react-icons/fa6'
import Tutorial from '../SVG/Tutorial.jsx'
import Tour from './Tour'
import { sendMessageToBackgroundScript } from '../../lib/sendMessageToBackground.js'

const videoUrls = {
   messages: {
      path: "https://play.vidyard.com/jZHDP7zXEfBXoSHqmkgDNF?",
      title: "Customize Messages and Save as Template",
   },
   videos: {
      path: "https://play.vidyard.com/J4mxeP18eH81nXf9GhLfPF?",
      title: "Record Videos with Professional Techniques",
   }

}

const TutorialDialog = () => {
  const { selectedTutorial, setSelectedTutorial, setEnableTutorialScreen, enableTutorialScreen  } = useContext(GlobalStatesContext);
  const { updateUserSettings, getProfileDetails,  isPro, isSignupOrLogin } = useContext(AuthContext);
  const iframeRef = useRef(null);
  const modalRef = useRef(null)
  const [popUp, setPopUp] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [toggleTutorial, setToggleTutorial] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [showTutorialVideo, setShowTutorialVideo] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const handlePopUpChange = () => {
    setIsInitialState(false);
    setPopUp(!popUp);
  }

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setToggleTutorial(false)
      setSelectedTutorial('');
    }
  }

  const handleSelectedTutorial = (tutorial) => {
      setShowTutorialVideo(true);
      setActiveTutorial(tutorial);
  }

  const handleTourStart = () => {
    setSelectedTutorial(activeTutorial);
      setToggleTutorial(false);
      setShowTutorialVideo(false);
      setActiveTutorial(null);
  }

  // useEffect(() => {
  //    setToggleTutorial(enableTutorialScreen);
  // }, [enableTutorialScreen])


  useEffect(() => {
    if(isSignupOrLogin && isPro) {
      (async () => {
        let user = await getProfileDetails();
        if(user?.user_setting) {
          const { show_tutorials } = user.user_setting;
          setToggleTutorial(show_tutorials);
          setEnableTutorialScreen(show_tutorials);
          setPopUp(!show_tutorials);
        } else {
          setToggleTutorial(true);
          setPopUp(false);
          setEnableTutorialScreen(true);
        }
      })()
    }
    setSelectedTutorial('');
  }, [isSignupOrLogin, isPro])

  useEffect(() => {
    if (toggleTutorial) {
      document.addEventListener('mousedown', handleOverlayClick)
    } else {
      document.removeEventListener('mousedown', handleOverlayClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOverlayClick)
    }
  }, [toggleTutorial])

  useEffect(()=> {
     if(!isInitialState) {
      updateUserSettings({show_tutorials: !popUp}) 
     }
  }, [popUp])

  const handleExpandVideo = (e) => {
      e.preventDefault();
      const src = videoUrls[activeTutorial]?.path;

      const height = 322 * 2
      const width = 574 * 2
  
      sendMessageToBackgroundScript({
        action: 'startPlayingVideo',
        height,
        width,
        src,
      })
  }

  return (
    <>
      {toggleTutorial && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-overlay modal-dialog-centered" role="document">
            <div className="modal-content mx-4 justify-content-center align-items-center" ref={modalRef}>
              <div className="modal-header d-flex justify-content-between align-items-start fw-500 mt--7 w-100 px-3 pt-3 pb-2">
                { showTutorialVideo ? videoUrls[activeTutorial]?.title : "Our Step-by-Step Guides"}
                <button type="button" className="custom-close-button px-0 mx-0 mt-0-2 d-flex align-items-center justify-content-center" onClick={() => { setSelectedTutorial(''); setToggleTutorial(false)}} aria-label="Close">
                  <IoMdClose size={16} />
                </button>
              </div>
              <div className="modal-body align-items-center justify-content-center">
                <div className="flex">
                  {!showTutorialVideo ? (<div className="d-flex flex-row space-between gap-2">
                    <div className="text-center flex-1">
                      <div
                        className={`cursor-pointer tutorial-icon-box d-flex align-items-center justify-content-center border-video-selector ${selectedTutorial == 'messages' ? 'bg-selected-videoMode' : ''}`}
                        onClick={() => handleSelectedTutorial('messages')}
                      >
                        <Tutorial>
                          <TbMessage2Plus size={20} color="white" />
                        </Tutorial>
                      </div>
                      <p className="tutorial-dialog-text fw-500 light-grey mb-0">Customize Messages and Save as Template</p>
                    </div>
                    <div className="text-center flex-1">
                      <div
                        className={`cursor-pointer tutorial-icon-box d-flex align-items-center justify-content-center border-video-selector ${selectedTutorial == 'videos' ? 'bg-selected-videoMode' : ''}`}
                        onClick={() => handleSelectedTutorial('videos')}
                      >
                        <Tutorial>
                          <BiSolidVideoRecording size={20} color="white" className="ml-0-5" />
                        </Tutorial>
                      </div>
                      <p className="tutorial-dialog-text fw-500 light-grey mb-0">Record Videos with Professional Techniques</p>
                    </div>
                    <div className="text-center flex-1">
                      <div className={`cursor-pointer tutorial-icon-box d-flex align-items-center justify-content-center border-video-selector ${selectedTutorial == 'Square' ? 'bg-selected-videoMode' : ''}`} onClick={() => handleSelectedTutorial('Square')}>
                        <Tutorial>
                          <FaCalendarDay size={16} color="white" className="ml-0-5" />
                        </Tutorial>
                      </div>
                      <div className="d-flex flex-column">
                        <p className="tutorial-dialog-text fw-500 light-grey mb-0">Optimize Scheduling</p>
                        <p className="mt-0 tutorial-dialog-text fw-500 light-grey mb-0">with the Skoop</p>
                        <p className="mt-0 tutorial-dialog-text fw-500 light-grey mb-0 d-flex no-wrap">Appointment System</p>
                      </div>
                    </div>
                  </div>)
                  :(
                    <>
                    <div className="embed-responsive embed-responsive-16by9">
              <iframe
                className="embed-responsive-item tutorial-video-frame"
                src={videoUrls[activeTutorial]?.path}
                ref={iframeRef}
                allow="autoplay; fullscreen; picture-in-picture"
              />
              <div className='expand-video-button' onClick={handleExpandVideo}></div>
            </div>
            <div class="mt-2 d-flex justify-content-center">
                  <button type="button" class="card-btn" onClick={handleTourStart}>
                    Start
                  </button>
                </div>
            </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex">
                  <div className="ms-5 mt-0-8 switch-container">
                    <div className=" form-check form-switch switch-button-container">
                      <input className="form-check-input custom-switch switch-sm" name="toggle-modal" type="checkbox" role="switch" checked={popUp} onChange={handlePopUpChange} />
                    </div>
                  </div>
                  <p className="tutorial-dialog-text mt-0 mb-0 fw-500">Don't show the tutorial popup again on next login. You can re-enable it from the top of the helper section.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Tour/>
    </>
  )
}

export default TutorialDialog
