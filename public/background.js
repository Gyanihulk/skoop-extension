chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const senderTabId = sender.tab.id;
if (request.message === 'HomePage') {
  console.log("HOME PAGE")
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
        width: request.width?request.width:'750px',
        height: request.height?request.height:'572px'
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


