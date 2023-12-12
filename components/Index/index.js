import React, { useState } from 'react';
import getUserInfo from '../../lib/googleApis';
import styles from '../../styles/Pages.module.css';
import { useSession, signIn, signOut } from "next-auth/react"
const Index = ({ navigateToPage }) => {
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = () => {
    chrome.identity.getAuthToken({ interactive: true, scopes: ['openid', 'profile', 'email'] }, async function (token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      if (token) {
        try {
          const userInfo = await getUserInfo(token);
          console.log(userInfo);
          setUserInfo(userInfo);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const scrapePage = () => {
    const pageHTML = document.body.innerHTML;
    console.log(pageHTML);
    alert('Page ' + pageHTML);
  };

  const handleScrape = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapePage
    });
  };
  const handleLinkedInLogin = () => {
    // Construct the LinkedIn authorization URL with your client_id and redirect_uri
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78hm5gmgooj98f&redirect_uri=${encodeURIComponent('https://lekjjhjjcjghpjffgamknpaemfmplbml.chromiumapp.org/')}&scope=r_liteprofile%20r_emailaddress`;
    // Redirect user to LinkedIn's authorization page
    window.location.href = linkedInAuthUrl;
  }
  const openSignInPopUp=()=>{
    chrome.runtime.sendMessage({ message: 'openSignInPopup' });
   }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Skoop extension</h1>
        <p>{"[ - This is Index page content - ]"}</p>
        <button onClick={handleLogin}>Login with Google</button>
        <button onClick={handleLinkedInLogin}>Login with LinkedIn</button>
        <button onClick={() => openSignInPopUp()}>Sign in</button>
        <button onClick={handleScrape}>Scrape website</button>
        {userInfo && (
          <div>
            <p>User Info:</p>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
          </div>
        )}
        <p onClick={() => navigateToPage('new')}>{"Go to New Page >"}</p>
      </main>
    </div>
  );
};

export default Index;
