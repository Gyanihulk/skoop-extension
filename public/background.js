chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const senderTabId = sender.tab.id;
  console.log(sender,"sender")
  console.log("background js",request)
if (request.message === 'HomePage') {
  console.log("inside")
  chrome.tabs.query({}, (tabs) => {
    const urlToFind = "https://mail.google.com/mail";
    console.log(tabs);
    // Find the tab with the specified URL
    const targetTab = tabs.find(tab => tab.url.startsWith(urlToFind));
    console.log(targetTab,"selected tab")
    if (targetTab) {
      chrome.tabs.sendMessage(targetTab.id, { action: 'collectClasses' }, (response) => {
        if (response) {
          console.log('Collected classes:', response.classes);
          chrome.tabs.sendMessage(senderTabId, { action: 'returnClasses', classes: response.classes });
          sendResponse({classes:response.classes})
          
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


