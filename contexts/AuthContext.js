
import React, { createContext, useContext, useState } from 'react';
import API_ENDPOINTS from '../components/apiConfig';
import ScreenContext from './ScreenContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAutheticated, setisAutheticated] = useState(false);
    const [user,setUser]=useState(null)
    const {navigateToPage}=useContext(ScreenContext)

    const handleSkoopLogin = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');
        try {
          const response = await fetch(API_ENDPOINTS.signIn, {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              password: password,
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
          if (response.ok) {
            const resjson = await response.json();
            localStorage.setItem('accessToken', JSON.stringify(resjson.accessToken));
            localStorage.setItem('skoopUsername', JSON.stringify(resjson.skoopUsername));
            navigateToPage('Home');
          } else {
            alert('Incorrect username or password');
          }
        } catch (err) {
          alert('Something went wrong, please try again');
        }
      };
    
      const handleAuthCode = async (authCode, type) => {
        const url = type === 1 ? API_ENDPOINTS.linkedInLogIn : API_ENDPOINTS.GoogleLogIn;

        try {
          var result = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              code: authCode,
            }),
          });
          console.log("the token",result);
          result = await result.json();
          //alert("the login was successfull check console for token");
          // these are commented for now 
          localStorage.setItem('skoopAccessToken', JSON.stringify(result.accessToken));
          localStorage.setItem('skoopUsername', JSON.stringify(result.skoopUsername));
          navigateToPage('Home'); 
        } catch (err) {
          console.log("the error",err);
          alert("could not sign in")
        }
      }
    
      const handleSocialLogin = async (type) => {
        console.log(chrome.identity.getRedirectURL())
        try {
          if (type === 2) {
            const GoogleAuthUrl=`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=120051053340-6o9itlmoo5ruo2k8l0qi42sf3nagbmkv.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(chrome.identity.getRedirectURL())}&scope=profile%20email%20openid`
            chrome.identity.launchWebAuthFlow({ url: GoogleAuthUrl, interactive: true },async function(redirectUrl) {
              const code = new URL(redirectUrl).searchParams.get('code');
              handleAuthCode(code,type);
            });
          } else {
            const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77au9mtqfad5jq&redirect_uri=${encodeURIComponent(chrome.identity.getRedirectURL())}&scope=openid%20profile%20email`;
            chrome.identity.launchWebAuthFlow({ url: linkedInAuthUrl, interactive: true }, function(redirectUrl) {
              const code = new URL(redirectUrl).searchParams.get('code');
              handleAuthCode(code,type);
            });
          }
        } catch (err) {
          console.log(err);
          alert('Something went wrong, please try again');
        }
      };
    
      const handleRegister = async(event) => {
        event.preventDefault();
        try{
          const data = new FormData(event.currentTarget);
          if(data.get("password")!==data.get("confirmPassword")){
            alert("Password fields do not match try again")
            return ;
          }
          if(data.get("timezone")=="Select Timezone"){
            alert("please select a timezone")
            return ;
          }
          const res=await fetch(API_ENDPOINTS.signUp,{
              method: "POST",
              body: JSON.stringify({
                  password : data.get("password"),
                  first_name: data.get("firstName"),
                  last_name: data.get("lastName"),
                  email: data.get("email"),
                  timezone: data.get("timezone"),
                  services: [1,2,3]
              }),
              headers:{
                  "Content-type": "application/json; charset=UTF-8"
              }
          })
          if(res.ok){
              alert("sign-up was successfull")
          }
          else alert("username already exists pick a different username")
        }catch(err){
          console.log(err)
          alert("some error occurred")
        }
      };
      const verifyToken = async () => {
        try {
          const res = await fetch(API_ENDPOINTS.tokenStatus, {
            method: 'GET',
            headers: {
              authorization: `Bearer ${JSON.parse(localStorage.getItem('skoopAccessToken'))}`,
            },
          });
          return res;
        } catch (err) {
          return { ok: false };
        }
      };
    
  return (
    <AuthContext.Provider value={{isAutheticated , user, handleSkoopLogin, handleSocialLogin,handleRegister}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;