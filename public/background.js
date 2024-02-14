chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const senderTabId = sender.tab.id;
  if (request.message === 'HomePage' || request.message === 'ContactPage') {
  console.log("HOME PAGE")
  chrome.tabs.query({}, (tabs) => {
    const urlToFindGoogle = "https://mail.google.com/mail";
    const urlToFindLinkedIn = "https://www.linkedin.com/";
    
    const targetTab = tabs.find(tab => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)));    

    if (targetTab) {
      chrome.tabs.sendMessage(targetTab.id, { action: 'collectClasses' }, (response) => {
        if (response) {
          console.log(response)
          chrome.tabs.sendMessage(senderTabId, { action: 'returnClasses', response });
          sendResponse(response)
        }
      });
      chrome.tabs.sendMessage(targetTab.id, {
        action: 'resizeIframe',
        width: request.width?request.width:'450px',
        height: request.height?request.height:'600px',
        screen:"HomePage"
      }, (response) => {
        if (response) {
          console.log(response.result);
        } else {
          console.error('Error resizing iframe:', chrome.runtime.lastError);
        }
      });       
    }
  });
  return true
}
if (request.action === 'startRecording' || request.action === 'stopRecording') {
  // Relay message to the active tab
  console.log("background screen recording")
  chrome.tabs.query({}, (tabs) => {
    const urlToFindGoogle = "https://mail.google.com/mail";
    const urlToFindLinkedIn = "https://www.linkedin.com/";
    

    // Find the tab with either the Google Mail URL or the LinkedIn URL
    const targetTab = tabs.find(tab => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)));    

    if (targetTab) {
      chrome.tabs.sendMessage(targetTab.id, request, (response) => {
        if (response) {
          console.log(response,"background script")
          sendResponse(response)
        }
        return true
      });
    
    }
    return true
  });

}
if (request.action === "storeToken" && request.token) {
  chrome.storage.local.set({skoopCrmAccessToken: request.token}, function() {
    console.log("Token stored in extension local storage.");
  });
}
if (request.message === 'ChatPage') {
  console.log("SignIn")
  chrome.tabs.query({}, (tabs) => {
    const urlToFindGoogle = "https://mail.google.com/mail";
    const urlToFindLinkedIn = "https://www.linkedin.com/";
    

    // Find the tab with either the Google Mail URL or the LinkedIn URL
    const targetTab = tabs.find(tab => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)));    

    if (targetTab) {
      chrome.tabs.sendMessage(targetTab.id, { action: 'collectClasses' }, (response) => {
        if (response) {
          console.log(response)
          chrome.tabs.sendMessage(senderTabId, { action: 'returnClasses', response });
          sendResponse(response)
        }
      });
      chrome.tabs.sendMessage(targetTab.id, {
        action: 'resizeIframe',
        width: request.width?request.width:'150px',
        height: request.height?request.height:'600px'
      }, (response) => {
        if (response) {
          console.log(response.result);
        } else {
          console.error('Error resizing iframe:', chrome.runtime.lastError);
        }
      }); 
    
    }
  });
  
}

if (request.message === 'ContactPage') {
  console.log("SignIn")
  chrome.tabs.query({}, (tabs) => {
    const urlToFindGoogle = "https://mail.google.com/mail";
    const urlToFindLinkedIn = "https://www.linkedin.com/";
    

    // Find the tab with either the Google Mail URL or the LinkedIn URL
    const targetTab = tabs.find(tab => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)));    

    if (targetTab) {
      chrome.tabs.sendMessage(targetTab.id, { action: 'collectClasses' }, (response) => {
        if (response) {
          console.log(response)
          chrome.tabs.sendMessage(senderTabId, { action: 'returnClasses', response });
          sendResponse(response)
        }
      });
      chrome.tabs.sendMessage(targetTab.id, {
        action: 'resizeIframe',
        width: request.width?request.width:'150px',
        height: request.height?request.height:'600px'
      }, (response) => {
        if (response) {
          console.log(response.result);
        } else {
          console.error('Error resizing iframe:', chrome.runtime.lastError);
        }
      }); 
    
    }
  });
  
}
if (request.message === 'Welcome') {
  console.log("SignIn")
  chrome.tabs.query({}, (tabs) => {
    const urlToFindGoogle = "https://mail.google.com/mail";
    const urlToFindLinkedIn = "https://www.linkedin.com/";
    

    // Find the tab with either the Google Mail URL or the LinkedIn URL
    const targetTab = tabs.find(tab => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)));    

    if (targetTab) {
      chrome.tabs.sendMessage(targetTab.id, {
        action: 'resizeIframe',
        width: request.width?request.width:'375px',
        height: request.height?request.height:'812px'
      }, (response) => {
        if (response) {
          console.log(response.result);
        } else {
          console.error('Error resizing iframe:', chrome.runtime.lastError);
        }
      }); 
    
    }
  });
  
}
return true;
}
);