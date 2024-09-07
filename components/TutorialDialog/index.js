import React, { useContext, useRef, useEffect, useState } from 'react'
import GlobalStatesContext from '../../contexts/GlobalStates.js'
import AuthContext from '../../contexts/AuthContext.js'
import { IoMdClose } from 'react-icons/io'
import { TbMessage2Plus } from 'react-icons/tb'
import { BiSolidVideoRecording } from 'react-icons/bi'
import { FaCalendarDay } from 'react-icons/fa6'
import Tutorial from '../SVG/Tutorial.jsx'
import Tour from './Tour'
import { sendMessageToBackgroundScript } from '../../lib/sendMessageToBackground.js'
import { FaExpand } from 'react-icons/fa'
import { useUserSettings } from '../../contexts/UserSettingsContext'
import TourContext from '../../contexts/TourContext.js'

const videoUrls = {
  messages: {
    path: 'https://play.vidyard.com/jZHDP7zXEfBXoSHqmkgDNF?',
    title: 'Customize Messages and Save as Template',
  },
  videos: {
    path: 'https://play.vidyard.com/J4mxeP18eH81nXf9GhLfPF?',
    title: 'Creating your first Candid Video on LinkedIn',
  },
}

const TutorialDialog = () => {
  const { selectedTutorial, setSelectedTutorial, setEnableTutorialScreen, enableTutorialScreen } = useContext(GlobalStatesContext)
  const { isPro, isSignupOrLogin } = useContext(AuthContext)
  const iframeRef = useRef(null)
  const [iframeLoaded, setIframeLoaded] = useState(false) // Track iframe loading
  const modalRef = useRef(null)
  const [popUp, setPopUp] = useState(false)
  const [isInitialState, setIsInitialState] = useState(true)
  const [toggleTutorial, setToggleTutorial] = useState(false)
  const [activeTutorial, setActiveTutorial] = useState(null)
  const [showTutorialVideo, setShowTutorialVideo] = useState(false)
  const { fetchMySettings, updateUserSettings, userSettings } = useUserSettings()
  const [reloadIframe, setReloadIframe] = useState(false);
  let { latestBlob } = useContext(GlobalStatesContext)
  const {  setIsToorActive } = useContext(TourContext);
  const handlePopUpChange = () => {
    setIsInitialState(false)
    setPopUp(!popUp)
  }

  const handleClose = () => {
    setToggleTutorial(false)
    setSelectedTutorial('')
    setIframeLoaded(false)
    setShowTutorialVideo(false)
    setIsToorActive(false)
  }

  const handleSelectedTutorial = (tutorial) => {
    setShowTutorialVideo(true)
    setActiveTutorial(tutorial)
  }

  const handleTourStart = () => {
    setSelectedTutorial(activeTutorial)
    setToggleTutorial(false)
    setShowTutorialVideo(false)
    setActiveTutorial(null)
    setIframeLoaded(false)
  }

  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  useEffect(() => {
    if (userSettings) {
      setEnableTutorialScreen(userSettings?.show_tutorials);
      setToggleTutorial(userSettings?.show_tutorials)
    }
  }, [userSettings])

  useEffect(() => {
    if (isSignupOrLogin && isPro) {
      (async () => { 
        let userSettingsData = await fetchMySettings();
        if (userSettingsData) {
          const { show_tutorials } = userSettingsData;
          setToggleTutorial(show_tutorials)
          setEnableTutorialScreen(show_tutorials)
          setPopUp(!show_tutorials)
        } else {
          setToggleTutorial(true)
          setPopUp(false)
          setEnableTutorialScreen(true)
        }
      })()
    }
    setSelectedTutorial('')
  }, [isSignupOrLogin, isPro])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return ()=> {
      document.removeEventListener('keydown', handleKeyDown);
    }
   }, [])

  useEffect(() => {
    if (!isInitialState) {
      updateUserSettings({ show_tutorials: !popUp })
    }
  }, [popUp])

  const handleExpandVideo = (e) => {
    e.preventDefault()
    setReloadIframe(true);
    setTimeout(()=>{
      setReloadIframe(false);
    }, 100);
    const src = videoUrls[activeTutorial]?.path

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
      {toggleTutorial && !latestBlob ? (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-overlay modal-dialog-centered" role="document">
            <div className="modal-content mx-4 justify-content-center align-items-center" ref={modalRef}>
              <div className="modal-header d-flex justify-content-between align-items-start fw-500 mt--7 w-100 px-3 pt-3 pb-2">
                {showTutorialVideo ? videoUrls[activeTutorial]?.title : 'Get Started - with Step-by-Step Guides'}
                <button
                  type="button" title="Close"
                  className="custom-close-button px-0 mx-0 mt-0-2 d-flex align-items-center justify-content-center"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  <IoMdClose size={16} />
                </button>
              </div>
              <div className="modal-content mx-4 justify-content-center align-items-center">
              <div className="modal-body align-items-center justify-content-center w-100">
                <div className="flex">
                  {!showTutorialVideo ? (
                    <div className="d-flex flex-column align-items-center gap-2">
                      <div
                        className={`cursor-pointer d-flex align-items-center justify-content-center tutorial-image-container ${selectedTutorial == 'messages' ? 'bg-selected-videoMode' : ''}`}
                        onClick={() => handleSelectedTutorial('messages')}
                      >
                        <img src="/images/tutorial1.png" alt="messages" className='tutorial-image' />
                      </div>
                      <div
                        className={`cursor-pointer d-flex align-items-center justify-content-center tutorial-image-container ${selectedTutorial == 'videos' ? 'bg-selected-videoMode' : ''}`}
                        onClick={() => handleSelectedTutorial('videos')}
                      >
                        <img src="/images/tutorial2.png" alt="messages" className='tutorial-image' />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="embed-responsive embed-responsive-16by9">
                        {!reloadIframe  && (<iframe className="embed-responsive-item tutorial-video-frame" src={videoUrls[activeTutorial]?.path} ref={iframeRef} allow="autoplay; fullscreen; picture-in-picture" onLoad={handleIframeLoad} />)}
                        {iframeLoaded && (
                          <div className="expand-video-button d-flex justify-content-center align-items-center" onClick={handleExpandVideo}>
                            <FaExpand className="expand-icon" size={18} />
                          </div>
                        )}
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
              </div>
              <div className="modal-footer">
                <div className="d-flex">
                  <div className="ms-5 mt-0-8 switch-container">
                    <div className=" form-check form-switch switch-button-container">
                      <input className="form-check-input custom-switch switch-sm" name="toggle-modal" type="checkbox" role="switch" checked={!popUp} onChange={handlePopUpChange} />
                    </div>
                  </div>
                  <p className="tutorial-dialog-text mt-0 mb-0 fw-500">Keep enabled to show the guides on next login or refresh. You can change this setting from the top of the helper section.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ): null}
      <Tour />
    </>
  )
}

export default TutorialDialog
