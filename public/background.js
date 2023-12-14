chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background js",request)
if (request.message === 'closeExtension') {
  console.log("inside")
  chrome.tabs.query({}, (tabs) => {
    const urlToFind = "https://mail.google.com";
    
    // Find the tab with the specified URL
    const targetTab = tabs.find(tab => tab.url.startsWith(urlToFind));
    console.log(targetTab,"selected tab")
    if (targetTab) {
      chrome.tabs.sendMessage(targetTab.id, { action: 'collectClasses' }, (response) => {
        if (response) {
          console.log('Collected classes:', response.classes);
        }
      });
      chrome.tabs.sendMessage(targetTab.id, {
        action: 'resizeIframe',
        width: '750px',
        height: '572px'
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

}
);


