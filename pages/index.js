import React, { useContext, useEffect, useState } from 'react'
import Homepage from '../Screens/Homepage'
import SignIn from '../Screens/SignIn'
import SignUp from '../Screens/SignUp'
import ScreenContext from '../contexts/ScreenContext'
import ContactPage from '../Screens/ContactPage'
import ProfileScraper from '../components/ProfileScraper'
import AccountSettings from '../Screens/AccountSettings'
import ForgotPassword from '../Screens/ForgotPassword'
import LoadingScreen from '../Screens/LoadingScreen'
import AuthContext from '../contexts/AuthContext'
import CalendarSync from '../Screens/CalendarSync'
import Welcome from '../Screens/Welcome'
import Header from '../components/Header'
import HelperVideos from '../Screens/HelperVideos'
import SignInWith from '../Screens/SignInWith'
import SubscriptionScreen from '../Screens/SubscriptionScreen'
import DevicesList from '../Screens/DevicesList'
import { ThankYouScreen } from '../Screens/ThankYou'
import RecordVideos from '../Screens/RecordVideos'
import ContactUs from '../Screens/ContactUs'
import ReportBug from '../Screens/ReportBug'
import { PaymentScreen } from '../Screens/PaymentScreen'
import CantUseScreen from '../Screens/CantUseScreen'
import GlobalStatesContext from '../contexts/GlobalStates'
import { useRecording } from '../contexts/RecordingContext'
import { sendMessageToBackgroundScript } from '../lib/sendMessageToBackground'
import { CameraScreen } from '../Screens/CameraScreen'
import { useTimer } from '../contexts/TimerContext'
import VideoRecording from '../Screens/VideoRecording'
import TutorialDialog from '../components/TutorialDialog'
import { useUserSettings } from '../contexts/UserSettingsContext'
import WelcomeAppsumo from '../Screens/WelcomeAppsumo'
import WelcomeStripe from '../Screens/WelcomeStripe'
import AppTour from '../components/TutorialDialog/Tour'
import API_ENDPOINTS from '../components/apiConfig'
import { appDefaultVersion } from '../constants'

export default function Home() {
  const { setTabId, expandExtension, tabId, setIsMatchingUrl, setExpand, expand, setIsLinkedin, setIsGmail, setIsProfilePage } = useContext(GlobalStatesContext)
  const {
    capturing,
    height,
    setHeight,
    width,
    setWidth,
    videoSettingsOpen,
    setVideoSettingsOpen,
    selectedVideoStyle,
    setSelectedVideoStyle,
    isRecordStart,
    setIsRecordStart,
    setIsVideo,
    isScreenRecording,
    setIsScreenRecording,
    setCaptureCameraWithScreen,
    handleScreenVideoBlob,
    stopMediaStreams,
    isRecording,
  } = useRecording()
  const { startCountdown } = useTimer()
  const { verifyToken, isAuthenticated, newUser, isPro, version, setVersion, createUserDevice, ipAddress, operatingSystem, fingerPrint } = useContext(AuthContext)
  const { activePage, navigateToPage } = useContext(ScreenContext)
  const [isWebPage, setIsWebPage] = useState(false)
  const { fetchMySettings } = useUserSettings()

  const getManifestVersion = () => {
    if (chrome && chrome.runtime && chrome.runtime.getManifest) {
      const manifest = chrome.runtime.getManifest()
      return manifest.version
    }
    return null
  }

  useEffect(() => {
    // Define the handler inside the useEffect hook so it has access to the latest tabId
    const messageHandler = (request, sender, sendResponse) => {
      if (request.action === 'screenRecordingStopped' || request.action === 'resetState') {
        chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
          if (response.tabId && request.currentWebcamTabId && response.tabId == request.currentWebcamTabId) {
            handleScreenVideoBlob(request)
          } else {
            setIsRecordStart(false)
            setIsVideo(false)
            setIsScreenRecording(false)
            setIsRecordStart(false)
          }
          expandExtension()
          setExpand(false)
          navigateToPage('Home')
        })
        fetchMySettings()
        // Set the color for .header-text and svg inside #Header to #2d68c4
        let skoopExtensionBody = document.getElementById('skoop-extension-body')
        skoopExtensionBody.style.backgroundColor = 'transparent'
        document.body.style.backgroundColor = 'var(--bs-body-bg)'
        chrome.runtime.sendMessage({ action: 'resizeIframe', reset: true }, function (response) {
          // console.info(response)
        })
      } else if (request.action == 'screenRecordingStarted') {
        setIsRecordStart(true)
        setIsVideo(true)
        setIsScreenRecording(true)
        setIsRecordStart(true)
        setExpand(true)
        if (!request.captureCameraWithScreen) {
          let skoopExtensionBody = document.getElementById('skoop-extension-body')
          if (skoopExtensionBody) {
            skoopExtensionBody.style.setProperty('background-color', 'rgba(191, 191, 191, 0.5)', 'important')
            document.body.style.backgroundColor = 'transparent'
          }
        } else {
          navigateToPage('Camera')
        }
        if (request.countdown) {
          startCountdown(3)
        }

        setCaptureCameraWithScreen(request.captureCameraWithScreen)
        const message = { action: 'resizeIframe', width: request.captureCameraWithScreen ? request.width : '355', height: request.captureCameraWithScreen ? request.height : '100' }
        chrome.runtime.sendMessage(message, function (response) {
          // console.info(response)
        })
      } else if (request.action == 'showWebcam') {
        chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
          setWidth(request.width)
          setHeight(request.height)
          navigateToPage('Camera')
          setCaptureCameraWithScreen(request.captureCameraWithScreen)
          if (!request.captureCameraWithScreen) {
            let skoopExtensionBody = document.getElementById('skoop-extension-body')
            if (skoopExtensionBody) {
              skoopExtensionBody.style.setProperty('background-color', 'rgba(191, 191, 191, 0.5)', 'important')
              document.body.style.backgroundColor = 'transparent'
            }
          }
          const message = { action: 'resizeIframe', width: request.captureCameraWithScreen ? request.width : '355', height: request.captureCameraWithScreen ? request.height : '100' }
          chrome.runtime.sendMessage(message, function (response) {
            // console.info(response)
          })
        })
      } else if (request.action === 'closeWebcam') {
        stopMediaStreams()
        navigateToPage('Home')
      }
      return true
    }

    // Add the message listener with the newly defined handler
    chrome.runtime.onMessage.addListener(messageHandler)

    // Make sure to remove the listener when the component unmounts or when tabId changes
    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
    }
  }, [tabId, width, height])
  // Using useEffect to call getData on component mount
  useEffect(() => {
    if (chrome.tabs) {
      // Query the tabs
      sendMessageToBackgroundScript(
        {
          action: 'getTabId',
        },
        (res) => {
          // Define the URLs to check against
          if (res.source === 'tab') {
            const linkedInBaseUrl = 'https://www.linkedin.com/'
            const gmailBaseUrl = 'https://mail.google.com/'

            // Initialize states
            let isLinkedIn = false
            let isLinkedInProfilePage = false
            let isGmail = false

            // Check and set states based on the URL
            if (res.url.startsWith(linkedInBaseUrl)) {
              isLinkedIn = true
              if (res.url.includes('/in/')) {
                // LinkedIn profile pages often include '/in/' in the URL
                isLinkedInProfilePage = true
              }
              setIsMatchingUrl(true)
            } else if (res.url.startsWith(gmailBaseUrl)) {
              isGmail = true
              setIsMatchingUrl(true)
            }

            // Now, we update the states accordingly
            setTabId(res.tabId) // Update the tab ID state
            setIsLinkedin(isLinkedIn) // Update the LinkedIn state
            setIsProfilePage(isLinkedInProfilePage) // Update the LinkedIn profile page state
            setIsGmail(isGmail)

            let skoopExtensionBody = document.getElementById('skoop-extension-body')
            let body = document.body
            if (expand) {
              skoopExtensionBody.style.setProperty('overflow-y', 'hidden', 'important')
              body.style.overflow = 'initial'
            } else {
              skoopExtensionBody.style.removeProperty('overflow-y')
              skoopExtensionBody.style.overflow = 'initial'

              if (isRecordStart) {
                body.style.overflow = 'hidden'
                skoopExtensionBody.style.removeProperty('min-width')
              } else {
                body.style.overflow = 'auto'
                // skoopExtensionBody.style.removeProperty('min-width');
              }
            }
          } else {
            navigateToPage('CantUseScreen')
          } // Update the Gmail state
        }
      )
    }
  }, [])

  useEffect(() => {
    let skoopExtensionBody = document.getElementById('skoop-extension-body')
    let body = document.body
    if (expand) {
      skoopExtensionBody.style.setProperty('overflow-y', 'hidden', 'important')
      body.style.overflow = 'hidden'
    } else {
      skoopExtensionBody.style.removeProperty('overflow-y')
      skoopExtensionBody.style.overflow = 'initial'

      if (isRecordStart) {
        body.style.overflow = 'hidden'
        skoopExtensionBody.style.removeProperty('min-width')
      } else {
        body.style.overflow = 'auto'
        // skoopExtensionBody.style.removeProperty('min-width');
      }
    }
  }, [expand, isRecordStart])

  useEffect(() => {
    ;(async () => {
      if (version !== appDefaultVersion) {
        const res = await verifyToken()
      }
      const showWelcomePage = localStorage.getItem('welcomePageShown')
      if (isAuthenticated) {
        fetchMySettings()
      }
      if (isWebPage && chrome.tabs) {
        // Query the tabs

        if (isAuthenticated && newUser && !isPro) {
          navigateToPage('Subscription')
        } else if (isAuthenticated && newUser && isPro) {
          navigateToPage('ThankYouScreen')
        } else if (isAuthenticated && !isPro) {
          navigateToPage('Subscription')
        } else if (isAuthenticated && isPro) {
          navigateToPage('Home')
        } else if (!showWelcomePage) {
          navigateToPage('Welcome')
        } else if (!isAuthenticated) {
          navigateToPage('SignInIntro')
        }
      }
    })()
  }, [isAuthenticated, newUser, isPro, isWebPage])
  useEffect(() => {
    if (chrome && chrome.runtime && chrome.runtime.getManifest) {
      const globalWindowObject = window
      let skoopExtensionBody = document.getElementById('skoop-extension-body')
      if (skoopExtensionBody && globalWindowObject?.location.ancestorOrigins?.length > 0) {
        skoopExtensionBody.style.height = '100vh'
        setIsWebPage(true)
      } else {
        skoopExtensionBody.style.height = '500px'
        navigateToPage('Home')
      }
      // Get the manifest using the getManifest() method
      const manifest = chrome.runtime.getManifest()
      // Set the version from the manifest file
      setVersion(manifest.version)
    }
  }, [])

  // let isAuthenticated = true;
  // let activePage = 'ThankYouScreen';
  // let isPro = true;
  // //   Log when data is being loaded

  const messageHandler = async (message, sender, sendResponse) => {
    if (message.action === 'generateCommentCGPT') {
      let manifestVersion = getManifestVersion()
      const res = await verifyToken(manifestVersion)
      // Check if accessToken is valid or not.
      if (!res.ok) {
        sendResponse('Please login or register to use Skoop extension.')
        return true
      }
      try {
        const response = await getAIInteractionsResponse(message)
        sendResponse(response)
      } catch (error) {
        console.error('Error processing message:', error)
        sendResponse(null)
      }
    }else if (message.action === 'getUserSettings') {
      let manifestVersion = getManifestVersion()
      const res = await verifyToken(manifestVersion)
      // Check if accessToken is valid or not.
      if (!res.ok) {
        sendResponse({message:'Please login or register to use Skoop extension.',status:401})
        return true
      }
      try {
        const userSettings=await fetchMySettings();
        sendResponse(userSettings)
      } catch (error) {
        console.error('Error processing message:', error)
        sendResponse(null)
      }
    }else if (message.action === 'navigateToSubscriptionScreen') {
      if(isAuthenticated){
        navigateToPage("Subscription")
      }else{
        navigateToPage("SignUp")
      }
    }
    return true
  }

  const getAIInteractionsResponse = async (message) => {
    const updatedQuery = {
      prompt: `${message.query}`,
    }

    const response = await fetch(API_ENDPOINTS.aiInteractions, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
      },
      body: JSON.stringify(updatedQuery),
    })

    const data = await response.json()
 
    if (data?.data?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.data.response.candidates[0].content.parts[0].text
    } else if (response.status == 402) {
      return data.message
    } else {
      throw new Error('Invalid response format from AI service')
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageHandler)
    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
    }
  }, [])

  return (
    <>
      <div id="skoop-extension-body">
        {!['Welcome', 'SignInIntro', 'SignIn', 'SignUp', ' ', 'RecordVideo', 'ForgotPassword', 'CantUseScreen', 'Camera'].includes(activePage) && <Header />}
        {activePage === ' ' && <LoadingScreen />}
        {activePage === 'CantUseScreen' && <CantUseScreen />}
        {activePage === 'Camera' && <CameraScreen />}
        {activePage === 'RecordVideo' && <VideoRecording />}
        {isAuthenticated & isPro ? (
          <>
            {!['Welcome', 'CalendarSync', 'SignInIntro', 'RecordVideo', 'Camera', 'Subscription', 'SignIn', 'ContactUs', 'ReportBug', 'PaymentScreen', 'SignUp', ' ', 'ForgotPassword', 'CantUseScreen', 'ThankYouScreen'].includes(activePage) &&
              !isRecordStart &&
              !isScreenRecording && <TutorialDialog />}
            {activePage === 'Home' && <Homepage />}
            {activePage === 'RecordVideos' && <RecordVideos />}
            {activePage === 'HelperVideos' && <HelperVideos navigateTo={'Home'} />}
            {activePage === 'ContactUs' && <ContactUs navigateTo={'Home'} />}
            {activePage === 'ReportBug' && <ReportBug navigateTo={'Home'} />}
            {activePage === 'AccountSettings' && <AccountSettings />}
            {activePage == 'ContactPage' && <ContactPage />}
            {activePage == 'ProfileScraper' && <ProfileScraper />}
            {activePage == 'ForgotPassword' && <ForgotPassword />}
            {activePage == 'CalendarSync' && <CalendarSync />}
            {activePage == 'DevicesList' && <DevicesList />}
            {activePage == 'ThankYouScreen' && <ThankYouScreen />}
            {activePage === 'Subscription' && <SubscriptionScreen />}
            <AppTour />
          </>
        ) : isAuthenticated ? (
          <>
            {activePage === 'Subscription' && <SubscriptionScreen />}
            {activePage == 'PaymentScreen' && <PaymentScreen />}
            {activePage === 'ContactUs' && <ContactUs navigateTo={'Subscription'} />}
            {activePage === 'ReportBug' && <ReportBug navigateTo={'Subscription'} />}
            {activePage === 'HelperVideos' && <HelperVideos navigateTo={'Subscription'} />}
          </>
        ) : (
          <>
            {activePage === 'SignIn' && <SignIn />}
            {activePage === 'SignUp' && <SignUp />}
            {activePage == 'ForgotPassword' && <ForgotPassword />}
            {activePage == 'Welcome' && <Welcome />}
            {activePage == 'WelcomeStripe' && <WelcomeStripe />}
            {activePage == 'WelcomeAppsumo' && <WelcomeAppsumo />}
            {activePage == 'SignInIntro' && <SignInWith />}
          </>
        )}
      </div>
    </>
  )
}
