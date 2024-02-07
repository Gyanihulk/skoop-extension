
// Function to create and inject an iframe into the webpage

function injectIframe() {
    const existingContainer = document.getElementById('skoop-extension-container');
    if (existingContainer) {
        // Toggle visibility if container exists
        existingContainer.style.display =
            existingContainer.style.display === 'none' ? 'block' : 'none';
        return;
    }

    // Create the container
    const container = document.createElement('div');
    container.id = 'skoop-extension-container';
    container.style.position = 'fixed';
    container.style.top = '66px';
    container.style.right = '0';
    container.style.width = '375px'; 
    container.style.height = '812px'; 
    container.style.zIndex = '10000';
    container.style.display = 'block';
    container.style.border = '1px solid #000'; 
    container.style.borderRadius='20px';
    container.style.backgroundClip="padding-box";



    container.ondragstart = function () {
        return false;
    };

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'skoop-extension-iframe';
    iframe.src = `chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/index.html`;
    iframe.setAttribute('allow', 'camera;microphone');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%'; // Height when expanded

    const dragButton = document.createElement('div');
    dragButton.id="skoop-drag-button"
    dragButton.style.left = '10px';
    dragButton.style.top = '10px';
    dragButton.style.width = '40px';
    dragButton.style.height = '40px';
    dragButton.title="Click and Drag To Move"
    dragButton.style.position = 'absolute';
    dragButton.style.cursor = 'move';
    dragButton.style.backgroundImage =
        'url("' + chrome.runtime.getURL('/icons/move.png') + '")';
        dragButton.style.backgroundSize = 'cover'; 
    // Drag functionality
    let isDragging = false;
    let dragStartX, dragStartY;

    const dragStart = (e) => {
        disableTextSelection();
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
        enableTextSelection();
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mousedown', dragEnd);
    };
     dragButton.addEventListener('mousedown', dragStart);

    // Create minimize/expand button
    const toggleButton = document.createElement('button');
    toggleButton.id="skoop-expand-minimize-button";
    toggleButton.style.display="none";

    // Toggle button functionality
    let isMinimized = false;
    toggleButton.onclick = function() {
        if (isMinimized) {
            container.style.height = '800px';
        } else {
            container.style.height = '61px';
        }
        isMinimized = !isMinimized;
    };


    container.appendChild(dragButton);
    container.appendChild(toggleButton);
    container.appendChild(iframe);

    const minWidth = 400;  
    const maxWidth = 800;  
    const minHeight = 230; 
    const maxHeight = 750;
    const resizer = document.createElement('div');
    resizer.style.width = '30px';
    resizer.style.height = '30px';
    resizer.style.position = 'absolute';
    resizer.style.bottom = '0';
    resizer.style.right = '0';
    resizer.style.cursor = 'se-resize';
    resizer.style.backgroundImage =
        'url("' + chrome.runtime.getURL('/icons/resize.png') + '")';
        resizer.style.backgroundSize = 'cover'; 
    resizer.style.backgroundRepeat = 'no-repeat';
    resizer.style.backgroundPosition = 'center'
    resizer.style.transform = 'rotate(-90deg)';
    // container.appendChild(resizer);

    resizer.addEventListener('mousedown', initResize, false);

    function disableTextSelection() {
        document.body.style.userSelect = 'none';  // for most browsers
        document.body.style.webkitUserSelect = 'none'; // for Safari and Chrome
        document.body.style.MozUserSelect = 'none'; // for Firefox
        document.body.style.msUserSelect = 'none'; // for IE and Edge
    }

    function enableTextSelection() {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.MozUserSelect = '';
        document.body.style.msUserSelect = '';
    }


    function initResize(e) {
        disableTextSelection();
        window.addEventListener('mousemove', resize, false);
        window.addEventListener('mouseup', stopResize, false);
        
    }

    function isResizingArea(element) {
        console.log(element,resizer,"test")
    }

    function resize(e) {
        const dimensions = container.getBoundingClientRect();
        let newWidth = e.clientX - dimensions.left;
        let newHeight = e.clientY - dimensions.top;
    
        // Constrain newWidth and newHeight within min/max bounds
        newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    
        container.style.width = newWidth + 'px';
        container.style.height = newHeight + 'px';
    }

    function stopResize(e) {
        enableTextSelection();
        window.removeEventListener('mousemove', resize, false);
        window.removeEventListener('mousedown', stopResize, false);
        window.removeEventListener('mouseleave', stopResize, false);
    }
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

    // Gmail insertion 
    // var accountButtonParent = document.querySelector(".gb_Pd");

    // // Append the new button to the right of the account button
    // if (accountButtonParent) {
    //     accountButtonParent.appendChild(buttonContainer);
    // } else {
    //     console.error("Account button parent element not found.");
    // }
   
    document.body.appendChild(buttonContainer);
    
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
    return hostUrl;
}

function resizeIframe(newWidth, newHeight) {
    // Select the iframe element by ID
    const skoopExtensionContainer = document.getElementById('skoop-extension-container');

    // Check if the element exists
    if (skoopExtensionContainer) {
        // Set the new width and height
        skoopExtensionContainer.style.width = newWidth;
        skoopExtensionContainer.style.height = newHeight;
        skoopExtensionContainer.style.top = '66px';
console.log(newWidth);
        if(newWidth=='430px'){
            skoopExtensionContainer.style.borderRadius='0px';
        }
    } else {
        console.log('Iframe with id "skoop-extension-iframe" not found.');
    }
}

function createWebcamContainer(title,height,width) {
    const container = document.createElement('div');
    container.id = 'skoop-webcam-container';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '11000';
    container.style.display = 'none';
    container.style.height = height;
    container.style.width = width;
    

    const stopButton = document.createElement('button');
    stopButton.id="video-stop-button"
    stopButton.innerText = 'Stop Recording';
    stopButton.style.position = 'absolute';
    stopButton.style.top = '10px';
    stopButton.style.right = '10px';
    container.style.zIndex = '1100000';
    // container.appendChild(stopButton);

    // Create timer display
    const timerDisplay = document.createElement('span');
    timerDisplay.style.position = 'absolute';
    timerDisplay.style.bottom = '10px';
    timerDisplay.style.left = '10px';
    timerDisplay.innerText = '00:00';
    timerDisplay.style.fontSize = '24px'; 
    timerDisplay.style.fontWeight = 'bold';
    container.appendChild(timerDisplay);

    const countDownTimer = document.createElement('div');
    countDownTimer.style.position = 'absolute';
    countDownTimer.style.top = '50%';
    countDownTimer.style.left = '50%';
    countDownTimer.style.transform = 'translate(-50%, -50%)';
    countDownTimer.style.fontSize = '125px'; 
    countDownTimer.style.fontWeight = 'bold';
    countDownTimer.style.color = 'red'; 
    container.appendChild(countDownTimer);

    const loaderBar = document.createElement('div');
    loaderBar.id = 'loader-bar';
    loaderBar.style.position = 'absolute';
    loaderBar.style.bottom = '0';
    loaderBar.style.left  = '10px';
    loaderBar.style.width = '0%';
    loaderBar.style.height = '5px';
    loaderBar.style.backgroundColor = 'green';
    loaderBar.style.zIndex = '10001';
    container.appendChild(loaderBar);


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
        document.removeEventListener('mousedown', dragEnd);
    };
    let seconds = 0;
    let timerInterval = null;
    const updateTimer = () => {
        seconds++;
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
        const totalDuration = 90; // total duration in seconds
        const widthPercent = (seconds / totalDuration) * 100;
        loaderBar.style.width = `${widthPercent}%`;

        // Change color based on time elapsed
        if (seconds <= 45) {
            loaderBar.style.backgroundColor = 'green';
        } else if (seconds <= 60) {
            loaderBar.style.backgroundColor = 'yellow';
        } else if (seconds <= totalDuration) {
            loaderBar.style.backgroundColor = 'red';
        }
    
    };


    container.startTimer = () => {
        if (timerInterval !== null) {
            clearInterval(timerInterval); // Clear existing interval if any
        }
        seconds = 0; // Reset seconds on start
        timerInterval = setInterval(updateTimer, 1000);
    };

    container.stopTimer = () => {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null; // Clear interval reference after stopping
        }
        timerDisplay.innerText = '00:00';
    };

    container.resetTimer = () => {
        seconds = 0;  
    };

    container.showCountdown = () => {
        let countdown = 3; 
        countDownTimer.style.display="block"
        countDownTimer.innerText = countdown; 
        const countdownInterval = setInterval(() => {
            countdown--; // Decrement countdown each second
            countDownTimer.innerText = countdown; // Update display with new countdown value
    
            if (countdown <= 0) {
                clearInterval(countdownInterval); // Clear countdown interval
                countDownTimer.style.display="none"
                timerDisplay.innerText = '00:00'; // Optionally clear the display or set to "00:00"
                container.startTimer(); 
                mediaRecorder.start(); 
            }
        }, 1000);
    };
    // Store the timer interval ID in the container for later reference
    container.timerInterval = timerInterval;
    container.addEventListener('mousedown', dragStart);
    document.body.appendChild(container);
    return  container;
}



// Function to stop the webcam
function stopWebcam(container) {
  if (container && container.hasChildNodes()) {
    container.style.display = 'none';
    // Retrieve all video elements within the container
    const videos = container.getElementsByTagName('video');

    const video = videos[videos.length - 1]; // Last video element

    if (video && video.srcObject) {     
        video.srcObject.getTracks().forEach((track) => track.stop());
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
let skoopVideoContainer;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'collectClasses') {
        const classes = collectClasses();
        const url = getHostUrl();
        sendResponse({ classes: classes, url });
    }

    if (request.action === 'resizeIframe') {
        resizeIframe(request.width, request.height);
        sendResponse({ result: 'Iframe resized' });
    }
    if (request.action === 'startRecording') {
     
        skoopVideoContainer=document.getElementById("skoop-webcam-container")
        if(!skoopVideoContainer){
            skoopVideoContainer = createWebcamContainer("title",request.height,request.width);
        }
        
        
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: {width:{ideal:request.width},height:{ideal:request.height}}, audio: true  })
                .then((stream) => {
                    const video = document.createElement('video');
                    video.id="title"
                    video.srcObject = stream;
                    video.autoplay = true;
                    video.muted = true;
                    video.style.height = request.height+"px";
                    video.style.width = request.width+"px";
                    video.style.zIndex = '9998';
                    video.className = 'skoop-video-recorder';
                    skoopVideoContainer.appendChild(video);
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) recordedChunks.push(event.data);
                    };
                    skoopVideoContainer.showCountdown();
                    setTimeout(()=>{
                        mediaRecorder.start();
                    },3000)
                  
                    function stopStream() {
                        stream.getTracks().forEach(track => track.stop());
                    }
                  
                    skoopVideoContainer.style.display = 'block';
                   
                    const stopButton = document.getElementById('video-stop-button');
                    if (stopButton) {
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
        skoopVideoContainer=document.getElementById("skoop-webcam-container")
        stopWebcam(skoopVideoContainer);
        skoopVideoContainer.stopTimer();
        skoopVideoContainer.resetTimer();
        mediaRecorder.stop();
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const blobUrl = URL.createObjectURL(blob);
            recordedChunks = [];
            sendResponse({ videoBlob: blob, url: blobUrl });
        };
      
        return true;
    }
    if (request.action === 'showVideoPreview') {
      
        return true;
    }

    return true;
});

// MutationObserver to handle dynamic changes in the DOM
const observer = new MutationObserver(createButton);
observer.observe(document.body, { subtree: true, childList: true });

var isProfilePage=false;
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

            chrome.runtime.sendMessage({
                action: 'elementRemoved'
            });

         
          }
        }
      });

      if(window.location.href.includes('www.linkedin.com/in') && !isProfilePage){
        isProfilePage=true;
        chrome.runtime.sendMessage({
            action: 'skoopMsgIsProfilePage'
        });
    }

    if(window.location.href.includes('www.linkedin.com/in')==false && isProfilePage){
        isProfilePage=false;
        chrome.runtime.sendMessage({
            action: 'skoopMsgIsNotProfilePage'
        });
    }

    });
  }
  
  // Create a Mutation Observer instance
  const observerForCheckboxes = new MutationObserver(handleMutations);
  
  // Start observing the document
  observerForCheckboxes.observe(document, {
    childList: true,
    subtree: true 
  });
  

// adding event listner to find the last selected element for insertion at Gmail

document.addEventListener('focusin', (event) => {

    chrome.runtime.sendMessage({
        action: "skoopFocusedElementChanged",
        elementId: event.target.id
    });

});

// .............................................................................//