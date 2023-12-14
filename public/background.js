chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("background js",request)
      if (request.message === 'closeExtension') {
        console.log("inside")
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1280, height: 720 } })
              .then((stream) => {
                  console.log('Camera and microphone access granted');
                  console.log(stream)
              })
              .catch((err) => {
                  console.error(`The following error occurred: ${err.name}`);
                  // Handle the error here (e.g., show a message to the user)
              });
      } else {
          console.log("getUserMedia not supported");
      }
      }
 
    }
    );
    