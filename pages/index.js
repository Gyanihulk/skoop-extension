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
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import DevicesList from '../Screens/DevicesList'
import { ThankYouScreen } from '../Screens/ThankYou'
import RecordVideos from '../Screens/RecordVideos'
import ContactUs from '../Screens/ContactUs'
import ReportBug from '../Screens/ReportBug'
import { PaymentScreen } from '../Screens/PaymentScreen'
export default function Home() {
  const {
    verifyToken,
    isAuthenticated,
    newUser,
    isPro,
    setVersion,
    createUserDevice,
    ipAddress,
    operatingSystem,
    fingerPrint,
  } = useContext(AuthContext)
  const { activePage, navigateToPage } = useContext(ScreenContext)
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  )

  // Using useEffect to call getData on component mount
  useEffect(() => {
    // console.log("Component mounted. Calling getData...");

    if (chrome && chrome.runtime && chrome.runtime.getManifest) {
      // Get the manifest using the getManifest() method
      const manifest = chrome.runtime.getManifest()
      // Set the version from the manifest file
      setVersion(manifest.version)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const res = await verifyToken()
      const showWelcomePage = localStorage.getItem('welcomePageShown')

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
    })()
  }, [isAuthenticated, newUser, isPro])
  // let isAuthenticated = true;
  // let activePage = 'ThankYouScreen';
  // let isPro = true;
  // //   Log when data is being loaded

  return (
    <>
      <div id="skoop-extension-body">
      {![
        'Welcome',
        'SignInIntro',
        'SignIn',
        'SignUp',
        ' ',
        'ForgotPassword',
      ].includes(activePage) && <Header />}
      {activePage === ' ' && <LoadingScreen />}
      {isAuthenticated & isPro ? (
        <>
          {activePage === 'Home' && <Homepage />}
          {activePage === 'RecordVideos' && <RecordVideos />}
          {activePage === 'HelperVideos' && <HelperVideos navigateTo={"Home"}/>}
          {activePage === 'ContactUs' && <ContactUs navigateTo={"Home"}/>}
          {activePage === 'ReportBug' && <ReportBug navigateTo={"Home"}/>}
          {activePage === 'AccountSettings' && <AccountSettings />}
          {activePage == 'ContactPage' && <ContactPage />}
          {activePage == 'ProfileScraper' && <ProfileScraper />}
          {activePage == 'ForgotPassword' && <ForgotPassword />}
          {activePage == 'CalendarSync' && <CalendarSync />}
          {activePage == 'DevicesList' && <DevicesList />}
          {activePage == 'ThankYouScreen' && <ThankYouScreen />}
        </>
      ) : isAuthenticated ? (
        <>{activePage === 'Subscription' && <SubscriptionScreen />}
        {activePage == 'PaymentScreen' && <PaymentScreen />}
        {activePage === 'ContactUs' && <ContactUs navigateTo={"Subscription"}/>}
        {activePage === 'ReportBug' && <ReportBug navigateTo={"Subscription"}/>}
        {activePage === 'HelperVideos' && <HelperVideos navigateTo={"Subscription"} />}</>
      ) : (
        <>
          {activePage === 'SignIn' && <SignIn />}
          {activePage === 'SignUp' && <SignUp />}
          {activePage == 'ForgotPassword' && <ForgotPassword />}
          {activePage == 'Welcome' && <Welcome />}
          {activePage == 'SignInIntro' && <SignInWith />}
        </>
      )}
      </div>
    </>
  )
}
