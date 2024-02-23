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
    dragButton.id = 'skoop-drag-button';
    dragButton.style.left = '10px';
    dragButton.style.top = '19px';
    dragButton.style.width = '24px';
    dragButton.style.height = '24px';
    dragButton.style.position = 'absolute';
    dragButton.style.cursor = 'move';
    dragButton.title = 'Click and Drag To Move';

    dragButton.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/move.png') + '")';
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
    toggleButton.id = 'skoop-expand-minimize-button';
    toggleButton.style.display = 'none';

    // Toggle button functionality
    let isMinimized = false;
    toggleButton.onclick = function () {
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
    resizer.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/resize.png') + '")';
    resizer.style.backgroundSize = 'cover';
    resizer.style.backgroundRepeat = 'no-repeat';
    resizer.style.backgroundPosition = 'center';
    resizer.style.transform = 'rotate(-90deg)';
    // container.appendChild(resizer);

    resizer.addEventListener('mousedown', initResize, false);

    function disableTextSelection() {
        document.body.style.userSelect = 'none'; // for most browsers
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
        console.log(element, resizer, 'test');
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
        if (newWidth == '450px') {
            skoopExtensionContainer.style.borderRadius = '0px';
        }
    } else {
        console.log('Iframe with id "skoop-extension-iframe" not found.');
    }
}

function createWebcamContainer(title, height, width) {
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
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    container.style.backgroundColor = '#fff';
    var overlay = document.createElement('div');

    // Style the overlay
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Black color with opacity
    overlay.style.zIndex = '10';
    overlay.style.display = 'none';
    container.showOverlay = () => {
        overlay.style.display = 'block';
    };
    container.hideOverlay = () => {
        overlay.style.display = 'none';
    };
    container.appendChild(overlay);
    const timerDisplay = document.createElement('span');
    timerDisplay.style.position = 'absolute';
    timerDisplay.style.top = '10px';
    timerDisplay.style.right = '10px';
    timerDisplay.innerText = '00:00';
    timerDisplay.style.fontSize = '24px';
    timerDisplay.style.fontWeight = 'bold';
    timerDisplay.style.color = 'white';
    container.appendChild(timerDisplay);

    const countDownTimer = document.createElement('div');
    countDownTimer.style.position = 'absolute';
    countDownTimer.style.top = '50%';
    countDownTimer.style.zIndex = '20';
    countDownTimer.style.left = '50%';
    countDownTimer.style.transform = 'translate(-50%, -50%)';
    countDownTimer.style.fontSize = '125px';
    countDownTimer.style.fontWeight = 'bold';
    countDownTimer.style.color = 'white';
    container.appendChild(countDownTimer);

    const loaderBar = document.createElement('div');
    loaderBar.id = 'loader-bar';
    loaderBar.style.position = 'absolute';
    loaderBar.style.bottom = '96px';
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

    container.addEventListener('mousedown', dragStart);
    let seconds = 0;
    let timerInterval = null;
    const updateTimer = () => {
        seconds++;
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
            2,
            '0'
        )}`;

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
        loaderBar.style.width = '0px';
        loaderBar.style.backgroundColor = 'green';
    };

    container.showCountdown = () => {
        let countdown = 3;
        countDownTimer.style.display = 'block';
        overlay.style.display = 'block';
        countDownTimer.innerText = countdown;
        const countdownInterval = setInterval(() => {
            countdown--; // Decrement countdown each second
            countDownTimer.innerText = countdown; // Update display with new countdown value

            if (countdown <= 0) {
                clearInterval(countdownInterval); // Clear countdown interval
                countDownTimer.style.display = 'none';
                overlay.style.display = 'none';
                timerDisplay.innerText = '00:00'; // Optionally clear the display or set to "00:00"
                container.startTimer();
                mediaRecorder.start();
            }
        }, 1000);
    };
    // Store the timer interval ID in the container for later reference
    container.timerInterval = timerInterval;

    var controlBar = document.createElement('div');
    controlBar.style.position = 'fixed';
    controlBar.style.bottom = '0px';
    controlBar.style.backgroundColor = '#2D68C4';
    controlBar.style.borderBottomLeftRadius = '10px';
    controlBar.style.borderBottomRightRadius = '10px';
    controlBar.style.display = 'flex';
    controlBar.style.justifyContent = 'center';
    controlBar.style.alignItems = 'center';
    controlBar.style.width = '100%';
    controlBar.style.height = '98px';

    // Create the power button
    var restartButton = document.createElement('button');
    restartButton.id = 'video-restart-button';
    restartButton.style.backgroundColor = 'white';
    restartButton.style.border = 'none';
    restartButton.style.cursor = 'pointer';
    restartButton.style.borderRadius = '50%';
    restartButton.style.marginRight = '8px';
    restartButton.onclick = function () {
        console.log('Power button clicked');
        // Add your power button functionality here
    };
    restartButton.style.display = 'flex';
    restartButton.style.justifyContent = 'center';
    restartButton.style.alignItems = 'center';
    restartButton.style.width = '40px';
    restartButton.style.height = '40px';

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 20 20');
    var path = document.createElementNS(svgNS, 'path');
    path.setAttribute(
        'd',
        'M9.9998 0.799885C9.8938 0.798385 9.78854 0.81797 9.69017 0.857501C9.5918 0.897032 9.50226 0.955721 9.42676 1.03016C9.35127 1.10459 9.29132 1.19329 9.2504 1.2911C9.20948 1.3889 9.18841 1.49386 9.18841 1.59988C9.18841 1.7059 9.20948 1.81087 9.2504 1.90867C9.29132 2.00648 9.35127 2.09518 9.42676 2.16961C9.50226 2.24405 9.5918 2.30274 9.69017 2.34227C9.78854 2.3818 9.8938 2.40138 9.9998 2.39988C14.2067 2.39988 17.5998 5.79304 17.5998 9.99988C17.5998 14.2067 14.2067 17.5999 9.9998 17.5999C5.79295 17.5999 2.3998 14.2067 2.3998 9.99988C2.3998 7.80957 3.32301 5.84313 4.7998 4.4577V5.99989C4.79831 6.10589 4.81789 6.21114 4.85742 6.30952C4.89695 6.40789 4.95564 6.49743 5.03008 6.57293C5.10451 6.64842 5.19321 6.70837 5.29102 6.74929C5.38882 6.79021 5.49378 6.81128 5.5998 6.81128C5.70582 6.81128 5.81079 6.79021 5.90859 6.74929C6.0064 6.70837 6.0951 6.64842 6.16953 6.57293C6.24397 6.49743 6.30266 6.40789 6.34219 6.30952C6.38172 6.21114 6.4013 6.10589 6.3998 5.99989V1.59988H1.9998C1.8938 1.59839 1.78854 1.61797 1.69017 1.6575C1.5918 1.69703 1.50226 1.75572 1.42676 1.83016C1.35127 1.90459 1.29132 1.99329 1.2504 2.0911C1.20948 2.1889 1.18841 2.29386 1.18841 2.39988C1.18841 2.5059 1.20948 2.61087 1.2504 2.70867C1.29132 2.80648 1.35127 2.89518 1.42676 2.96961C1.50226 3.04405 1.5918 3.10274 1.69017 3.14227C1.78854 3.1818 1.8938 3.20138 1.9998 3.19988H3.80996C1.96249 4.88368 0.799805 7.30882 0.799805 9.99988C0.799805 15.0714 4.92825 19.1999 9.9998 19.1999C15.0714 19.1999 19.1998 15.0714 19.1998 9.99988C19.1998 4.92833 15.0714 0.799885 9.9998 0.799885Z'
    );
    path.setAttribute('fill', 'currentColor');

    svg.appendChild(path);
    restartButton.appendChild(svg);

    const stopButton = document.createElement('button');
    stopButton.id = 'video-stop-button';
    stopButton.style.borderRadius = '50%';
    stopButton.style.backgroundColor = 'white';
    stopButton.style.border = 'none';
    stopButton.style.color = 'red';
    stopButton.style.fontSize = '24px';
    stopButton.style.cursor = 'pointer';
    stopButton.onclick = function () {
        console.log('Record button clicked');
        // Add your record button functionality here
    };
    stopButton.style.display = 'flex';
    stopButton.style.alignItems = 'center';
    stopButton.style.justifyContent = 'center';
    stopButton.style.width = '60px';
    stopButton.style.height = '60px';
    const svgHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="10" fill="#E31A1A"/>
        </svg>`;

    stopButton.innerHTML = svgHTML;
    // Create the pause button
    var pauseButton = document.createElement('button');
    pauseButton.style.backgroundColor = 'white';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '50%';
    // pauseButton.style.cursor = 'pointer';
    pauseButton.onclick = function () {
        console.log('Pause button clicked');
        // Add your pause button functionality here
    };
    pauseButton.disabled = true;
    pauseButton.style.width = '40px';
    pauseButton.style.height = '40px';
    pauseButton.style.marginLeft = '8px';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 10 12');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Create the first rectangle
    var rect1 = document.createElementNS(svgNS, 'rect');
    rect1.setAttribute('width', '3');
    rect1.setAttribute('height', '25');
    rect1.setAttribute('fill', '#E31A1A');

    // Create the second rectangle
    var rect2 = document.createElementNS(svgNS, 'rect');
    rect2.setAttribute('width', '3');
    rect2.setAttribute('height', '25');
    rect2.setAttribute('transform', 'translate(7)');
    rect2.setAttribute('fill', '#E31A1A');

    // Append the rectangles to the SVG
    svg.appendChild(rect1);
    svg.appendChild(rect2);
    pauseButton.appendChild(svg);
    // Append the SVG to the body or another container element

    controlBar.appendChild(restartButton);
    controlBar.appendChild(stopButton);
    controlBar.appendChild(pauseButton);
    container.appendChild(controlBar);
    document.body.appendChild(container);
    return container;
}

// Function to stop the webcam


let mediaRecorder;
let recordedChunks = [];
let skoopVideoContainer;
let isRecording = false;
let isRestarting = false;
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
        skoopVideoContainer = document.getElementById('skoop-webcam-container');
        if (!skoopVideoContainer) {
            skoopVideoContainer = createWebcamContainer('title', request.height, request.width);
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    video: { width: { ideal: request.width }, height: { ideal: request.height } },
                    audio: true,
                })
                .then((stream) => {
                    function startRecording() {
                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0) recordedChunks.push(event.data);
                        };
                        mediaRecorder.onstop = () => {
                            const blob = new Blob(recordedChunks, { type: 'video/webm' });
                            const blobUrl = URL.createObjectURL(blob);
                            recordedChunks = [];
                            isRecording = false;
                            console.log(isRestarting, 'is restarting ');
                            if (!isRestarting) {
                                const videos = skoopVideoContainer.getElementsByTagName('video');

                                    const video = videos[videos.length - 1]; // Last video element

                                    if (video && video.srcObject) {
                                        video.srcObject.getTracks().forEach((track) => track.stop());
                                        skoopVideoContainer.removeChild(video);
                                    } else {
                                        console.error('The last video element is undefined, or srcObject is null.');
                                    }

                                sendResponse({ videoBlob: blob, url: blobUrl });
                            }
                        };
                        isRecording = true;
                        mediaRecorder.start();
                    }
                    const video = document.createElement('video');
                    video.id = 'skoop-video-recording';
                    video.srcObject = stream;
                    video.autoplay = true;
                    video.muted = true;
                    video.style.height = request.height + 'px';
                    video.style.width = request.width + 'px';
                    video.style.zIndex = '9998';
                    video.style.borderRadius = '10px';
                    video.className = 'skoop-video-recorder';
                    skoopVideoContainer.style.height = request.height + 98 + 'px';
                    skoopVideoContainer.style.width = request.width + 2 + 'px';
                    skoopVideoContainer.appendChild(video);
                    skoopVideoContainer.style;

                    skoopVideoContainer.showCountdown();

                    function stopStream() {
                        console.log('Stop Button pressed');
                  
                        if (!isRestarting) {
                            skoopVideoContainer.style.display = 'none';
                        }
                        skoopVideoContainer.stopTimer();
                        skoopVideoContainer.resetTimer();
                        mediaRecorder.stop();
                        isRecording = false;
                    }
                    setTimeout(() => {
                        startRecording();
                    }, 3000);

                    setTimeout(() => {
                        if (isRecording) {
                            stopStream();
                        }
                    }, 93000);

                    skoopVideoContainer.style.display = 'block';

                    const stopButton = document.getElementById('video-stop-button');
                    if (stopButton) {
                        stopButton.addEventListener('click', stopStream);
                    }

                    function restartStream() {
                        recordedChunks = [];
                        skoopVideoContainer.showCountdown();

                        isRestarting = true;
                        stopStream();
                        setTimeout(() => {
                            startRecording();
                            isRestarting = false;
                        }, 3000);
                        setTimeout(() => {
                            if (isRecording) {
                                stopStream();
                            }
                        }, 93000);
                    }

                    const restartButton = document.getElementById('video-restart-button');
                    if (restartButton) {
                        restartButton.addEventListener('click', restartStream);
                    }
                    
                })
                .catch((err) => {
                    console.error(`[Creating web cam in website]: ${err}`);
                });
        } else {
            console.log('getUserMedia not supported');
        }
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

var isProfilePage = false;
// Function to handle mutations
function handleMutations(mutationsList) {
    mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((addedNode) => {
                if (
                    addedNode.nodeType === 1 &&
                    addedNode.classList &&
                    addedNode.classList.contains('msg-convo-wrapper')
                ) {
                    // Send a message or perform actions for the added element
                    chrome.runtime.sendMessage({
                        action: 'elementAdded',
                        element: addedNode.outerHTML,
                    });
                }
            });

            mutation.removedNodes.forEach((removedNode) => {
                if (
                    removedNode.nodeType === 1 &&
                    removedNode.classList &&
                    removedNode.classList.contains('msg-convo-wrapper')
                ) {
                    // Send a message or perform actions for the removed element
                    chrome.runtime.sendMessage({
                        action: 'elementRemoved',
                        element: removedNode.outerHTML,
                    });
                }
            });
        }

        mutation.removedNodes.forEach((removedNode) => {
            if (removedNode.nodeType === 1) {
                // Check if an h1 tag with inner text "Messaging" is removed
                const h1Elements = removedNode.querySelectorAll('h1');
                const MessagingTabFound = false;
                h1Elements.forEach((h1) => {
                    if (h1.innerText == 'Messaging') {
                        MessagingTabFound = true;
                    }
                });
                if (MessagingTabFound == false) {
                    chrome.runtime.sendMessage({
                        action: 'elementRemoved',
                    });
                }
            }
        });

        if (window.location.href.includes('www.linkedin.com/in') && !isProfilePage) {
            isProfilePage = true;
            chrome.runtime.sendMessage({
                action: 'skoopMsgIsProfilePage',
            });
        }

        if (window.location.href.includes('www.linkedin.com/in') == false && isProfilePage) {
            isProfilePage = false;
            chrome.runtime.sendMessage({
                action: 'skoopMsgIsNotProfilePage',
            });
        }
    });
}

// Create a Mutation Observer instance
const observerForCheckboxes = new MutationObserver(handleMutations);

// Start observing the document
observerForCheckboxes.observe(document, {
    childList: true,
    subtree: true,
});

// adding event listner to find the last selected element for insertion at Gmail

document.addEventListener('focusin', (event) => {
    chrome.runtime.sendMessage({
        action: 'skoopFocusedElementChanged',
        elementId: event.target.id,
    });
});

// .............................................................................//
