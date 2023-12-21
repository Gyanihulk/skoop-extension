
// Function to create and inject an iframe into the webpage

function injectIframe() {
    const existingContainer = document.getElementById('skoop-extension-container');
    if (existingContainer) {
        // Toggle visibility if container exists
        existingContainer.style.display =
            existingContainer.style.display === 'none' ? 'block' : 'none';
        return;
    }

    // Request camera and microphone permissions

    // Create the container
    const container = document.createElement('div');
    container.id = 'skoop-extension-container';
    container.style.position = 'fixed';
    container.style.top = '66px';
    container.style.right = '0';
    container.style.width = '400px';
    container.style.height = '600px';
    container.style.zIndex = '10000';
    container.style.display = 'block';

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'skoop-extension-iframe';
    iframe.src = `chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/index.html`;
    iframe.setAttribute('allow', 'camera;microphone');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    // Create the close button
    const closeButton = document.createElement('div');
    closeButton.id = 'extension-close-button';
    closeButton.className = 'extension-close-button';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.width = '5px';
    closeButton.style.height = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.textContent = 'x';
    container.style.zIndex = '10000';
    closeButton.addEventListener('click', function close() {
        container.style.display = 'none';
    });

    // Append the iframe and close button to the container
    container.appendChild(iframe);
    container.appendChild(closeButton);

    // Append the container to the body of the document
    document.body.appendChild(container);
}

function requestCameraAndMicrophonePermissions() {
    // Use the modern navigator.mediaDevices.getUserMedia if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: false, video: { width: 1280, height: 720 } })
            .then((stream) => {
                console.log('Camera and microphone access granted');

                // Handle the stream here (e.g., display it in a video element)
            })
            .catch((err) => {
                console.error(`The following error occurred: ${err.name}`);
                // Handle the error here (e.g., show a message to the user)
            });
    } else {
        console.log('getUserMedia not supported');
    }
}

// Function to create a button on the webpage
function createButton() {
    const buttonId = 'skoop-extension-button';
    const existingButton = document.getElementById(buttonId);

    // If the button already exists, do nothing
    if (existingButton) {
        return;
    }

    console.log('Adding Extension button');

    // Create the button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = buttonId;
    buttonContainer.className = 'extension-button';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.width = '40px';
    buttonContainer.style.height = '40px';
    buttonContainer.style.borderRadius = '50%';
    buttonContainer.style.backgroundImage =
        'url("' + chrome.runtime.getURL('/icons/icon.png') + '")';
    buttonContainer.style.backgroundSize = 'cover';
    buttonContainer.style.backgroundPosition = 'center';
    buttonContainer.style.backgroundRepeat = 'no-repeat';
    buttonContainer.style.zIndex = '9998';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.cursor = 'pointer';

    // Add click event listener to the button
    buttonContainer.addEventListener('click', injectIframe);

    // Inject the button container into the document body
    document.body.appendChild(buttonContainer);
    // const accountButtonParent = document.querySelector('.gb_0c');

    // // Only proceed if the account button parent is found.
    // if (accountButtonParent) {

    //     // Insert your button before the account button parent in the DOM.
    //     accountButtonParent.insertBefore(buttonContainer, accountButtonParent.firstChild);
    // } else {
    //     console.error('The account button parent element was not found.');
    // }
}
function collectClasses() {
    const allElements = document.querySelectorAll('*');
    const classes = Array.from(allElements)
        .map((el) => el.className)
        .filter(Boolean);
    return [...new Set(classes)]; // Return unique classes only
}
// Create the button when the page loads
createButton();

function getHostUrl() {
    const hostUrl = new URL(window.location.href).hostname;
    console.log('Sending ', hostUrl);
    return hostUrl;
}

function resizeIframe(newWidth, newHeight) {
    // Select the iframe element by ID
    console.log(`Resizing extesnion to ${newWidth},${newHeight}`);
    const skoopExtensionContainer = document.getElementById('skoop-extension-container');

    // Check if the element exists
    if (skoopExtensionContainer) {
        // Set the new width and height
        skoopExtensionContainer.style.width = newWidth;
        skoopExtensionContainer.style.height = newHeight;
        skoopExtensionContainer.style.top = '66px';
    } else {
        console.log('Iframe with id "skoop-extension-iframe" not found.');
    }
}

function createWebcamContainer(title,height,width) {
    console.log('starting webcamcontainer ',title,height,width);
    const container = document.createElement('div');
    container.id = 'skoop-webcam-container';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '11000';
    container.style.display = 'none';
    container.style.height = '120px';
    container.style.width = '210px';
    

    const stopButton = document.createElement('button');
    stopButton.id="video-stop-button"
    stopButton.innerText = 'Stop Recording';
    stopButton.style.position = 'absolute';
    stopButton.style.top = '10px';
    stopButton.style.left = '10px';
    container.style.zIndex = '1100000';
    container.appendChild(stopButton);

    // Create timer display
    const timerDisplay = document.createElement('span');
    timerDisplay.style.position = 'absolute';
    timerDisplay.style.top = '10px';
    timerDisplay.style.right = '10px';
    timerDisplay.innerText = '00:00';
    container.appendChild(timerDisplay);

    // Drag functionality
    let isDragging = false;
    let dragStartX, dragStartY;

    const dragStart = (e) => {
        isDragging = true;
        dragStartX = e.clientX - container.offsetLeft;
        dragStartY = e.clientY - container.offsetTop;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    };

    const dragMove = (e) => {
        if (isDragging) {
            container.style.left = `${e.clientX - dragStartX}px`;
            container.style.top = `${e.clientY - dragStartY}px`;
        }
    };

    const dragEnd = () => {
        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    };
    let seconds = 0;
    const updateTimer = () => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        timerDisplay.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Start the timer
    let timerInterval = setInterval(updateTimer, 1000);

    // Store the timer interval ID in the container for later reference
    container.timerInterval = timerInterval;
    container.addEventListener('mousedown', dragStart);
    document.body.appendChild(container);
    return  container;
}

function startWebcam(title,height,width) {
    
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
           
            
       
        })
        .catch((error) => {
            console.error('Error accessing the webcam', error);
        });
}

// Function to stop the webcam
function stopWebcam(container) {
  if (container && container.hasChildNodes()) {
    container.style.display = 'none';
    // Retrieve all video elements within the container
    const videos = container.getElementsByTagName('video');
    // Select the last video element
    const video = videos[videos.length - 1]; // Last video element
    console.log(video)
    // Make sure the selected video element is not undefined
    if (video && video.srcObject) {
        // Stop all tracks of the video's srcObject
        
        video.srcObject.getTracks().forEach((track) => track.stop());
        // Remove the video element after stopping the tracks
        container.removeChild(video);
    } else {
        console.error('The last video element is undefined, or srcObject is null.');
    }
} else {
    console.error('Container is null, or there are no video elements.');
}
}



let mediaRecorder;
let recordedChunks = [];
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'collectClasses') {
        console.log('getting classes');
        const classes = collectClasses();
        const url = getHostUrl();
        sendResponse({ classes: classes, url });
    }

    if (request.action === 'resizeIframe') {
        resizeIframe(request.width, request.height);
        sendResponse({ result: 'Iframe resized' });
    }
    if (request.action === 'startRecording') {
        console.log(request)
        // startWebcam("title",request.height,request.width);
        const skoopVideoContainer = createWebcamContainer("title",request.height,request.width);
        skoopVideoContainer.style.display = 'block';
        console.log('starting webcam',request.height,request.width);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: {width:{ideal:request.width},height:{ideal:request.height}} })
                .then((stream) => {
                    const video = document.createElement('video');
                    video.id="title"
                    video.srcObject = stream;
                    video.autoplay = true;
                    video.style.height = request.height+"px";
                    video.style.width = request.width+"px";
                    video.style.zIndex = '9998';
                    video.className = 'skoop-video-recorder';
                    skoopVideoContainer.appendChild(video);
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) recordedChunks.push(event.data);
                    };
                    mediaRecorder.start();
                    function stopStream() {
                        stream.getTracks().forEach(track => track.stop());
                    }
            
                   
                    const stopButton = document.getElementById('video-stop-button');
                    if (stopButton) {
                        console.log("stop stream")
                        stopButton.addEventListener('click', stopStream);
                    }
                })
                .catch((err) => {
                    console.error(`[Creating web cam in website]: ${err}`);
                    // Handle the error here (e.g., show a message to the user)
                });
        } else {
            console.log('getUserMedia not supported');
        }
    }

    if (request.action === 'stopRecording') {
        const skoopVideoContainer=document.getElementById("skoop-webcam-container")
        
        stopWebcam(skoopVideoContainer);
        
        mediaRecorder.stop();
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            console.log(blob, 'from content script');
            const blobUrl = URL.createObjectURL(blob);
            console.log(blobUrl, 'Blob URL from content script');
            recordedChunks = [];
            sendResponse({ videoBlob: blob, url: blobUrl });
        };
      
        return true;
    }
    if (request.action === 'showVideoPreview') {
        console.log(request)
      
        return true;
    }

    return true;
});

// MutationObserver to handle dynamic changes in the DOM
const observer = new MutationObserver(createButton);
observer.observe(document.body, { subtree: true, childList: true });


// Function to handle mutations
function handleMutations(mutationsList) {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((addedNode) => {
          if (addedNode.nodeType === 1 && addedNode.classList && addedNode.classList.contains('msg-convo-wrapper')) {
            // Send a message or perform actions for the added element
            chrome.runtime.sendMessage({
              action: 'elementAdded',
              element: addedNode.outerHTML
            });
          }
        });
  
        mutation.removedNodes.forEach((removedNode) => {
          if (removedNode.nodeType === 1 && removedNode.classList && removedNode.classList.contains('msg-convo-wrapper')) {
            // Send a message or perform actions for the removed element
            chrome.runtime.sendMessage({
              action: 'elementRemoved',
              element: removedNode.outerHTML
            });
          }
        });
      }

      mutation.removedNodes.forEach((removedNode) => {
        if (removedNode.nodeType === 1) {
          // Check if an h1 tag with inner text "Messaging" is removed
          const h1Elements = removedNode.querySelectorAll('h1');
          const MessagingTabFound=false;
          h1Elements.forEach((h1) => {
            if (h1.innerText == 'Messaging') {
                MessagingTabFound=true;
            }
          });
          if(MessagingTabFound==false){
            console.log("the messaging tab not found")
            chrome.runtime.sendMessage({
                action: 'elementRemoved'
            });
          }
        }
      });

    });
  }
  
  // Create a Mutation Observer instance
  const observerForCheckboxes = new MutationObserver(handleMutations);
  
  // Start observing the document
  observerForCheckboxes.observe(document, {
    childList: true,
    subtree: true 
  });
  