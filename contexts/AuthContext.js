import React, { createContext, useContext, useEffect, useState } from "react";
import API_ENDPOINTS from "../components/apiConfig";
import ScreenContext from "./ScreenContext";
import toast from "react-hot-toast";
import { sendMessageToBackgroundScript } from "../lib/sendMessageToBackground";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAutheticated, setisAutheticated] = useState();
  const [user, setUser] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { navigateToPage } = useContext(ScreenContext);
  const [newUser, setNewUser] = useState(false);

  const validatePassword = (password) => {
    if (!password) {
      return false;
    }
    // Password should contain minimum 8 characters, at least one uppercase letter, and one special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+,\-.;:'"<>=?/\|[\]{}~])(.{8,})$/;
    return passwordRegex.test(password);
  };

  const handleSkoopLogin = async (username, password) => {
    const toastId = toast.loading("Signing In...");
    try {
      const response = await fetch(API_ENDPOINTS.signIn, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
          rememberMe: rememberMe,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (response.ok) {
        toast.success("signed in", { id: toastId });
        const resjson = await response.json();
        localStorage.setItem(
          "accessToken",
          JSON.stringify(resjson.accessToken)
        );
        localStorage.setItem(
          "skoopUsername",
          JSON.stringify(resjson.skoopUsername)
        );
        sendMessageToBackgroundScript({
          action: "storeToken",
          token: resjson.accessToken,
        });
        setisAutheticated(true);
        navigateToPage("Home");
      } else {
        toast.error("incorrect username or password", { id: toastId });
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong, please try again");
    }
  };

  const handleAuthCode = async (authCode, type) => {
    const url =
      type === 1 ? API_ENDPOINTS.linkedInLogIn : API_ENDPOINTS.GoogleLogIn;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          code: authCode,
          timezone,
        }),
      });
 
      if (Number(response.status) === 200) {
        let result = await response.json();
        setisAutheticated(true);
        localStorage.setItem("accessToken", JSON.stringify(result.accessToken));
        localStorage.setItem(
          "skoopUsername",
          JSON.stringify(result.skoopUsername)
        );
        sendMessageToBackgroundScript({
          action: "storeToken",
          token: result.accessToken,
        });
        if (result.newUser) {
          setNewUser(true);
          navigateToPage("CalendarSync");
        } else {
          navigateToPage("Home");
        }
      } else {
        toast.error("Could not sign in Correctly.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Could not sign in");
      navigateToPage("SignInIntro");
    }
  };

  const handleSocialLogin = async (type) => {
    try {
      if (type === 2) {
        const GoogleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=148000187265-8v7ggl7msakbtt5qbk1vddvtkjegkpf4.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
          chrome.identity.getRedirectURL()
        )}&scope=profile%20email%20openid%20&access_type=offline`;
        chrome.identity.launchWebAuthFlow(
          { url: GoogleAuthUrl, interactive: true },
          async function (redirectUrl) {
            const code = new URL(redirectUrl).searchParams.get("code");
            handleAuthCode(code, type);
          }
        );
      } else {
        const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77au9mtqfad5jq&redirect_uri=${encodeURIComponent(
          chrome.identity.getRedirectURL()
        )}&scope=openid%20profile%20email`;
        chrome.identity.launchWebAuthFlow(
          { url: linkedInAuthUrl, interactive: true },
          function (redirectUrl) {
            const code = new URL(redirectUrl).searchParams.get("code");
            handleAuthCode(code, type);
          }
        );
      }
    } catch (err) {
      toast.error("Something went wrong, please try again");
    }
  };

  const handleCalendarAuthCode = async (authCode, type) => {
    try {
      var response = await fetch(API_ENDPOINTS.syncCalendar, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
        },
        body: JSON.stringify({
          code: authCode,
          type,
        }),
      });
      console.log(response);
      if (Number(response.status) === 200) {
        navigateToPage("Home");
      } else {
        toast.error("Could not sign in.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Could not sign in");
    }
  };

  const calendarSync = async (type) => {
    navigateToPage(" ");
    if (type === "google") {
      const GoogleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=148000187265-8v7ggl7msakbtt5qbk1vddvtkjegkpf4.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
        chrome.identity.getRedirectURL()
      )}&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;
      chrome.identity.launchWebAuthFlow(
        { url: GoogleAuthUrl, interactive: true },
        async function (redirectUrl) {
          const code = new URL(redirectUrl).searchParams.get("code");
          handleCalendarAuthCode(code, type);
        }
      );
    } else if (type === "calendly") {
      const clientId = "d9bQY7A_1IZ-svcemjqlmvmGXvIPvsLZlsD2kMyCJ_o";
      const clientSecret = "vkm8Lm4b2iBNrWptU5wrtZ-r1GtjvnV4tHQ8K1q2L3U";
      const redirectUri = chrome.identity.getRedirectURL();
      const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl,
          interactive: true,
        },
        function (redirectUrl) {
          if (chrome.runtime.lastError || !redirectUrl) {
            // Handle errors or user cancellation of the auth flow
            console.error(
              chrome.runtime.lastError
                ? chrome.runtime.lastError.message
                : "Authorization flow failed."
            );
            return;
          }

          // Extract the authorization code from the redirect URL
          let code = new URL(redirectUrl).searchParams.get("code");
          if (!code) {
            console.error("No authorization code found.");
            return;
          }
          handleCalendarAuthCode(code, type);
        }
      );
    } else if (type == "microsoft") {
      console.log(type);
      const microsoftAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=bf6b5ce3-919e-4a92-819f-b9147926e3d0&response_type=code&redirect_uri=${encodeURIComponent(
        chrome.identity.getRedirectURL()
      )}&scope=User.Read%20Calendars.ReadWrite%20offline_access&response_mode=query&state=12345&nonce=678910`;
      chrome.identity.launchWebAuthFlow(
        { url: microsoftAuthUrl, interactive: true },
        async function (redirectUrl) {
          if (chrome.runtime.lastError || !redirectUrl) {
            // Handle errors or user cancellation here
            console.error(
              chrome.runtime.lastError
                ? chrome.runtime.lastError.message
                : "No redirect URL"
            );
            return;
          }
          const code = new URL(redirectUrl).searchParams.get("code");
          console.log(code, type);
          handleCalendarAuthCode(code, type);
        }
      );
    }
  };

  const handleRegister = async (fullname, email, password, timezone) => {
    try {
      if (!validatePassword(password)) {
        toast.error(
          "Password should contain minimum 8 characters, at least one uppercase letter, and one special character"
        );
        return;
      }

      const toastId = toast.loading("Signing Up ...");
      const res = await fetch(API_ENDPOINTS.signUp, {
        method: "POST",
        body: JSON.stringify({
          first_name: fullname,
          email: email,
          password: password,
          timezone: timezone,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (res.ok) {
        const resjson = await res.json();
        localStorage.setItem(
          "accessToken",
          JSON.stringify(resjson.accessToken)
        );
        localStorage.setItem(
          "skoopUsername",
          JSON.stringify(resjson.skoopUsername)
        );
        sendMessageToBackgroundScript({
          action: "storeToken",
          token: resjson.accessToken,
        });
        toast.success("Sign up was complete", { id: toastId });
        setNewUser(true);
        setisAutheticated(true);
        navigateToPage("CalendarSync");
      } else toast.error("Email already exists ", { id: toastId });
    } catch (err) {
      toast.dismiss();
      toast.error("Something Went Wrong");
    }
  };
  const verifyToken = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.tokenStatus, {
        method: "GET",
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
        },
      });

      if (res.ok) {
        setisAutheticated(true);
      } else {
        setisAutheticated(false);
      }
      return res;
    } catch (err) {
      return { ok: false };
    }
  };

  const getOtpForPasswordReset = async (username) => {
    try {
      const responseCode = await fetch(
        API_ENDPOINTS.getOtpForPasswordReset +
          new URLSearchParams({ username: username }),
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (responseCode.ok) return true;
      else return false;
    } catch (err) {
      console.log("some error occured in getting the otp for password reset");
      return false;
    }
  };

  const resetPasswordUsingOtp = async (username, otp, newPassword) => {
    try {
      const responseCode = await fetch(API_ENDPOINTS.resetPasswordUsingOtp, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          username: username,
          otp: otp,
          newPassword: newPassword,
        }),
      });
      console.log(`response status: ${responseCode.ok}`);
      console.log(`response code: ${responseCode.status}`);
      if (responseCode.ok) return true;
      else return false;
    } catch (err) {
      console.log("could not make the call to reset password", err);
      return false;
    }
  };

  const getCalendarUrl = async (authCode, type) => {
    try {
      var response = await fetch(API_ENDPOINTS.getCalendarUrl, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
        },
      });
      if (Number(response.status) === 200) {
        console.log(response);
        const data = await response.text();
        return data;
      } else {
        toast.error("Could not get calendar url.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Could not get calendar url");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAutheticated,
        setisAutheticated,
        user,
        handleSkoopLogin,
        handleSocialLogin,
        handleRegister,
        verifyToken,
        getOtpForPasswordReset,
        resetPasswordUsingOtp,
        rememberMe,
        setRememberMe,
        newUser,
        setNewUser,
        calendarSync,
        getCalendarUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
