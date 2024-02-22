import React, { useContext, useEffect, useState } from "react";
import Homepage from "../Screens/Homepage";
import SignIn from "../Screens/SignIn";
import SignUp from "../Screens/SignUp";
import ScreenContext from "../contexts/ScreenContext";
import ChatPage from "../Screens/ChatPage";
import ContactPage from "../Screens/ContactPage";
import ProfileScraper from "../components/ProfileScraper";
import AccountSettings from "../Screens/AccountSettings";
import ForgotPassword from "../Screens/ForgotPassword";
import LoadingScreen from "../Screens/LoadingScreen";
import AuthContext from "../contexts/AuthContext";
import CalendarSync from "../Screens/CalendarSync";
import Welcome from "../Screens/Welcome";
import Header from "../components/Header";
import SignInWith from "../Screens/SignInWith";

export default function Home() {
  const { verifyToken, isAutheticated, newUser, setNewUser } =
    useContext(AuthContext);
  const { activePage, navigateToPage } = useContext(ScreenContext);
  useEffect(() => {
    (async () => {
      console.log(`isAuthenticated: ${isAutheticated}`);
      console.log(`newUser: ${newUser}`);

      const res = await verifyToken();
      const showWelcomePage = localStorage.getItem("welcomePageShown");
      if (isAutheticated && newUser) {
        navigateToPage("CalendarSync");
      } else if (isAutheticated) {
        navigateToPage("Home");
      } else if (!showWelcomePage) {
        navigateToPage("Welcome");
      } else if (!isAutheticated) {
        navigateToPage("SignInIntro");
      }
    })();
  }, [isAutheticated, newUser]);

  return (
    <>
      {![
        "Welcome",
        "SignInIntro",
        "SignIn",
        "SignUp",
        " ",
        "CalendarSync",
        "ForgotPassword",
      ].includes(activePage) && <Header />}

      {activePage === " " && <LoadingScreen />}
      {activePage === "Home" && <Homepage />}
      {activePage === "SignIn" && <SignIn />}
      {activePage === "SignUp" && <SignUp />}
      {activePage === "AccountSettings" && <AccountSettings />}
      {activePage == "ChatPage" && <ChatPage />}
      {activePage == "ContactPage" && <ContactPage />}
      {activePage == "ProfileScraper" && <ProfileScraper />}
      {activePage == "ForgotPassword" && <ForgotPassword />}
      {activePage == "CalendarSync" && <CalendarSync />}
      {activePage == "Welcome" && <Welcome />}
      {activePage == "SignInIntro" && <SignInWith />}
    </>
  );
}
