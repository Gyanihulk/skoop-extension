chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background js",request)
    if (request.message === 'openPopup') {
      console.log("inside")
    //   chrome.windows.create({
    //     url: "index.html",
    //     // type: "panel",
    //     // focused: true,
    //     width: 400,
    //     height: 600,
    //     top: 0,
    //     // left: screen.width - 400,
    // }, () => {
    //     console.log("Opened popup!")
    // })
    const [tab] = chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab);
    chrome.sidePanel.open({ windowId: tab.windowId });
    }
    if (request.message === 'openSignInPopup') {
      const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78hm5gmgooj98f&redirect_uri=${encodeURIComponent(chrome.identity.getRedirectURL())}&scope=openid%20profile`;

      chrome.identity.launchWebAuthFlow({ url: linkedInAuthUrl, interactive: true }, function(redirectUrl) {
        // Extract the authorization code from the redirect URL
        const code = new URL(redirectUrl).searchParams.get('code');
        
        // Now exchange the code for an access token
        fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(chrome.identity.getRedirectURL())}&client_id=78hm5gmgooj98f&client_secret=GndON4BKBRtCCZU5`
        })
        .then(response => response.json())
        .then(data => {
          const accessToken = data.access_token;
          console.log(accessToken,"linkdein access token ")
          // Use the access token to fetch user data from LinkedIn
          // ...
          // Once you have the user data
          fetch('https://api.linkedin.com/v2/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
          .then(response => response.json())
          .then(userData => {
            // Send back user data to the content script
            sendResponse({ userInfo: userData });
          })
          .catch(error => {
            console.error('Error fetching LinkedIn user data:', error);
          })
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
  
      return true; // Indicates that you wish to send a response asynchronously
    }
  }
 
  
  
  
  );
  