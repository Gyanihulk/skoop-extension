chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("background js",request)
      if (request.message === 'closeExtension') {
        console.log("inside")
        document.getElementById('skoop-extension-iframe').style.display = 'none';
      }
 
    }
    );
    