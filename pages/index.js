import React, { useContext, useEffect, useState } from 'react';
import Homepage from '../Screens/Homepage';
import SignIn from '../Screens/SignIn';
import SignUp from '../Screens/SignUp';
import ScreenContext from '../contexts/ScreenContext';
import ContactPage from '../Screens/ContactPage';
import ProfileScraper from '../components/ProfileScraper';
import AccountSettings from '../Screens/AccountSettings';
import ForgotPassword from '../Screens/ForgotPassword';
import LoadingScreen from '../Screens/LoadingScreen';
import AuthContext from '../contexts/AuthContext';
import CalendarSync from '../Screens/CalendarSync';
import Welcome from '../Screens/Welcome';
import Header from '../components/Header';
import HelperVideos from '../Screens/HelperVideos';
import SignInWith from '../Screens/SignInWith';
import SubscriptionScreen from '../Screens/SubscriptionScreen';
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
import FingerprintIframe from '../components/FingerPrint';
import DevicesList from '../Screens/DevicesList';
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
    } = useContext(AuthContext);
    const { activePage, navigateToPage } = useContext(ScreenContext);
    const { isLoading, error, data, getData } = useVisitorData(
        { extendedResult: true },
        { immediate: true }
    );

    // Using useEffect to call getData on component mount
    useEffect(() => {
        // console.log("Component mounted. Calling getData...");

        if (chrome && chrome.runtime && chrome.runtime.getManifest) {
            // Get the manifest using the getManifest() method
            const manifest = chrome.runtime.getManifest();
            // Set the version from the manifest file
            console.log(manifest);
            setVersion(manifest.version);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const res = await verifyToken();
            const showWelcomePage = localStorage.getItem('welcomePageShown');
            console.log(newUser);
            if (isAuthenticated && newUser && !isPro) {
                navigateToPage('Subscription');
            } else if (isAuthenticated && newUser && isPro) {
                navigateToPage('CalendarSync');
            } else if (isAuthenticated && !isPro) {
                navigateToPage('Subscription');
            } else if (isAuthenticated && isPro) {
                navigateToPage('Home');
            } else if (!showWelcomePage) {
                navigateToPage('Welcome');
            } else if (!isAuthenticated) {
                navigateToPage('SignInIntro');
            }
        })();
    }, [isAuthenticated, newUser, isPro]);
    // let isAuthenticated = true;
    // let activePage = 'DevicesList';
    // let isPro = true;
    //   Log when data is being loaded

    return (
        <>
            {![
                'Welcome',
                'SignInIntro',
                'SignIn',
                'SignUp',
                ' ',
                'CalendarSync',
                'ForgotPassword',
                'Subscription',
            ].includes(activePage) && <Header />}
            {activePage === ' ' && <LoadingScreen />}
            {isAuthenticated & isPro ? (
                <>
                    <FingerprintIframe />
                    {activePage === 'Home' && <Homepage />}
                    {activePage === 'HelperVideos' && <HelperVideos />}
                    {activePage === 'AccountSettings' && <AccountSettings />}
                    {activePage == 'ContactPage' && <ContactPage />}
                    {activePage == 'ProfileScraper' && <ProfileScraper />}
                    {activePage == 'ForgotPassword' && <ForgotPassword />}
                    {activePage == 'CalendarSync' && <CalendarSync />}
                    {activePage == 'DevicesList' && <DevicesList />}
                </>
            ) : isAuthenticated ? (
                <>{activePage === 'Subscription' && <SubscriptionScreen />}</>
            ) : (
                <>
                    {activePage === 'SignIn' && <SignIn />}
                    {activePage === 'SignUp' && <SignUp />}
                    {activePage == 'ForgotPassword' && <ForgotPassword />}
                    {activePage == 'Welcome' && <Welcome />}
                    {activePage == 'SignInIntro' && <SignInWith />}
                </>
            )}
        </>
    );
}
