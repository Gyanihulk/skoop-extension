import { useState } from 'react';
import getUserInfo from '../../lib/googleApis';
import styles from '../../styles/Pages.module.css';

export default function Index({ navigateToPage }) {
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = () => {
    console.log("button pressed");
    chrome.identity.getAuthToken({ interactive: true, scopes: ['openid', 'profile', 'email'] }, async function(token) {
        if (chrome.runtime.lastError) {
            // Handle error from chrome.identity.getAuthToken
            console.error(chrome.runtime.lastError);
            return;
        }

        console.log(token);
        if (token) {
            try {
                const userInfo = await getUserInfo(token);
                console.log(userInfo);

                // Store user information in state or do further processing
                setUserInfo(userInfo);
            } catch (error) {
                // Handle error from getUserInfo
                console.error(error);
            }
        }
    });
};

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Skoop extension</h1>
        {/* <p className={styles.description}>
          This is an example of a Browser Extension built with NEXT.JS. Please
          refer to the GitHub repo for running instructions and documentation
        </p>
        <h1 className={styles.code}>Index Page ./components/Index/index.js</h1> */}
        <p>{"[ - This is Index page content - ]"}</p>
        <button onClick={handleLogin}>Login with Google</button>
        <p onClick={() => navigateToPage('new')}>{"Go to New Page >"}</p>
      </main>
    </div>
  );
}
