function createWebcamContainer(height, width, stream = true) {
  const container = document.createElement('div')
  container.id = 'skoop-webcam-container'
  container.style.position = 'fixed'
  chrome.storage.local.get('webcamPosition', (result) => {
    if (result.webcamPosition) {
      container.style.left = result.webcamPosition.left
      container.style.top = result.webcamPosition.top
    } else {
      // Set default position or keep it as is
      container.style.left = '50%'
      container.style.top = '50%'
    }
  })
  container.style.transform = 'translate(-50%, -50%)'
  container.style.zIndex = '11000'
  container.style.display = 'none'
  container.style.height = height
  container.style.width = width
  container.style.borderRadius = '10px'
  container.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'
  var overlay = document.createElement('div')

  // Style the overlay
  overlay.style.position = 'absolute'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)' // Black color with opacity
  overlay.style.zIndex = '10'
  overlay.style.display = 'none'
  overlay.style.borderRadius = '6px'
  container.showOverlay = () => {
    overlay.style.display = 'block'
  }
  container.hideOverlay = () => {
    overlay.style.display = 'none'
  }
  container.appendChild(overlay)
  const timerDisplay = document.createElement('span')
  timerDisplay.style.position = 'absolute'
  timerDisplay.style.top = '10px'
  timerDisplay.style.right = '10px'
  timerDisplay.innerText = '00:00'
  timerDisplay.style.fontSize = '24px'
  timerDisplay.style.fontWeight = 'bold'
  timerDisplay.style.color = 'white'
  container.appendChild(timerDisplay)

  const countDownTimer = document.createElement('div')
  countDownTimer.style.position = 'absolute'
  countDownTimer.style.top = '50%'
  countDownTimer.style.zIndex = '20'
  countDownTimer.style.left = '50%'
  countDownTimer.style.transform = 'translate(-50%, -50%)'
  countDownTimer.style.fontSize = '125px'
  countDownTimer.style.fontWeight = 'bold'
  countDownTimer.style.color = 'white'
  container.appendChild(countDownTimer)

  const loaderBar = document.createElement('div')
  loaderBar.id = 'loader-bar'
  loaderBar.style.position = 'absolute'
  loaderBar.style.bottom = '96px'
  loaderBar.style.width = '0%'
  loaderBar.style.height = '5px'
  loaderBar.style.backgroundColor = 'green'
  loaderBar.style.zIndex = '10001'
  container.appendChild(loaderBar)

  // Drag functionality
  let isDragging = false
  let dragStartX, dragStartY
  let seconds
  const dragStart = (e) => {
    isDragging = true
    dragStartX = e.clientX - container.offsetLeft
    dragStartY = e.clientY - container.offsetTop
    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragEnd)
  }

  const dragMove = (e) => {
    if (isDragging) {
      container.style.left = `${e.clientX - dragStartX}px`
      container.style.top = `${e.clientY - dragStartY}px`
    }
  }
  const dragEnd = () => {
    if (isDragging) {
      isDragging = false
      // Save the position when the drag ends
      const position = {
        left: container.style.left,
        top: container.style.top,
      }
      chrome.storage.local.set({ webcamPosition: position }, () => {
        // console.log('Position saved:', position)
      })
      document.removeEventListener('mousemove', dragMove)
      document.removeEventListener('mouseup', dragEnd)
    }
  }

  container.addEventListener('mousedown', dragStart)
  let pausedSeconds = 0
  let totalDuration = 120 // total duration in seconds

  let timerInterval = null

  const updateTimer = () => {
    seconds++
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

    const elapsedSeconds = seconds - pausedSeconds
    const widthPercent = (elapsedSeconds / totalDuration) * 100
    loaderBar.style.width = `${widthPercent}%`

    // Change color based on time elapsed
    if (elapsedSeconds <= 45) {
      loaderBar.style.backgroundColor = 'green'
    } else if (elapsedSeconds <= 60) {
      loaderBar.style.backgroundColor = 'yellow'
    } else if (elapsedSeconds <= totalDuration) {
      loaderBar.style.backgroundColor = 'red'
    }
  }

  container.startTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval) // Clear existing interval if any
    }
    seconds = 0 // Reset seconds on start
    timerInterval = setInterval(updateTimer, 1000)
  }

  container.stopTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval)
      timerInterval = null // Clear interval reference after stopping
    }
    timerDisplay.innerText = '00:00'
    pausedSeconds = 0
  }

  container.resetTimer = () => {
    seconds = 0
    loaderBar.style.width = '0px'
    loaderBar.style.backgroundColor = 'green'
    pausedSeconds = 0
  }

  let countdownInterval

  container.showCountdown = () => {
    let countdown = 3
    countDownTimer.style.display = 'block'
    overlay.style.display = 'block'
    countDownTimer.innerText = countdown
    countdownInterval = setInterval(() => {
      countdown--
      countDownTimer.innerText = countdown

      if (countdown <= 0) {
        clearInterval(countdownInterval)
        countDownTimer.style.display = 'none'
        overlay.style.display = 'none'
        timerDisplay.innerText = '00:00'
        container.startTimer()
      }
    }, 1000)
  }
  container.destroy = function () {
    // Hide the container if it's still visible
    if (container.style.display !== 'none') {
      container.style.display = 'none'
    }

    // Stop and destroy the camera feed if it's running
    const video = document.getElementById('skoop-video-recording')
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks()
      tracks.forEach((track) => track.stop()) // Stop each track
      video.srcObject = null // Clear the video source
      video.parentNode.removeChild(video)
    }

    // Remove the container from the DOM
    // if (container.parentNode) {
    //   container.parentNode.removeChild(container)
    // }

    // Reset any variables or state related to the container
    isRecording = false
    isRestarting = false
    recordedChunks = []
  }
  container.reinitialize = function () {
    // Restore the saved position
    applySavedScaleState()
    chrome.storage.local.get('webcamPosition', (result) => {
      if (result.webcamPosition) {
        container.style.left = result.webcamPosition.left
        container.style.top = result.webcamPosition.top
      }
    })
    // Check if the video element already exists
    let video = document.getElementById('skoop-video-recording')
    if (!video) {
      // Create a new video element if it doesn't exist
      video = document.createElement('video')
      video.id = 'skoop-video-recording'
      video.autoplay = true
      video.muted = true
      video.style.height = height + 'px'
      video.style.width = width + 'px'
      video.style.zIndex = '9998'
      video.style.borderTopLeftRadius = '10px'
      video.style.borderTopRightRadius = '10px'
      video.className = 'skoop-video-recorder'
      container.appendChild(video)
    }

    // Re-acquire the camera stream and set it to the video element
    getCameraStream()
      .then((cameraStream) => {
        // Stop the previous stream if it exists
        if (video.srcObject) {
          const oldTracks = video.srcObject.getTracks()
          oldTracks.forEach((track) => track.stop())
        }
        video.srcObject = cameraStream
        video.play().catch((error) => console.error('Error playing video:', error))
        
      })
      .catch((error) => {
        console.error('Error getting camera stream:', error)
      })
  }
  container.show = function () {
    fadeIn(this); 
  }

  // Hide the webcam container
  container.hide = function () {
    this.style.display = 'none';
  }
  container.updateTimerDisplay = (elapsedTimeMillis) => {
    if (!isTimerPaused) {
      // Clear any existing timer interval
      if (timerInterval !== null) {
        clearInterval(timerInterval)
      }

      // Update the display immediately with the elapsed time
      const updateDisplay = () => {
        const minutes = Math.floor(elapsedTimeMillis / 60000)
        seconds = Math.floor((elapsedTimeMillis % 60000) / 1000)
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        elapsedTimeMillis += 1000 // Increment the elapsed time by one second
      }

      updateDisplay() // Update the timer display immediately

      // Start a new timer interval to update the display every second
      timerInterval = setInterval(updateDisplay, 1000)

      // Store the timer interval ID in the container for later reference or cleanup
      container.timerInterval = timerInterval
    }
  }
  // Store the timer interval ID in the container for later reference
  container.timerInterval = timerInterval

  var controlBar = document.createElement('div')
  controlBar.style.position = 'fixed'
  controlBar.style.bottom = '0px'
  controlBar.style.backgroundColor = '#2D68C4'
  controlBar.style.borderBottomLeftRadius = '10px'
  controlBar.style.borderBottomRightRadius = '10px'
  controlBar.style.display = 'flex'
  controlBar.style.justifyContent = 'center'
  controlBar.style.alignItems = 'center'
  controlBar.style.width = '100%'
  controlBar.style.height = '98px'

  // Create the power button
  var restartButton = document.createElement('button')
  restartButton.id = 'video-restart-button'
  restartButton.style.backgroundColor = 'white'
  restartButton.style.border = 'none'
  restartButton.style.cursor = 'pointer'
  restartButton.style.borderRadius = '50%'
  restartButton.style.marginRight = '8px'
  restartButton.onclick = function () {
    // Add your power button functionality here
  }
  restartButton.style.display = 'flex'
  restartButton.style.justifyContent = 'center'
  restartButton.style.alignItems = 'center'
  restartButton.style.width = '40px'
  restartButton.style.height = '40px'

  var svgNS = 'http://www.w3.org/2000/svg'
  var svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('width', '20')
  svg.setAttribute('height', '20')
  svg.setAttribute('viewBox', '0 0 20 20')
  var path = document.createElementNS(svgNS, 'path')
  path.setAttribute(
    'd',
    'M9.9998 0.799885C9.8938 0.798385 9.78854 0.81797 9.69017 0.857501C9.5918 0.897032 9.50226 0.955721 9.42676 1.03016C9.35127 1.10459 9.29132 1.19329 9.2504 1.2911C9.20948 1.3889 9.18841 1.49386 9.18841 1.59988C9.18841 1.7059 9.20948 1.81087 9.2504 1.90867C9.29132 2.00648 9.35127 2.09518 9.42676 2.16961C9.50226 2.24405 9.5918 2.30274 9.69017 2.34227C9.78854 2.3818 9.8938 2.40138 9.9998 2.39988C14.2067 2.39988 17.5998 5.79304 17.5998 9.99988C17.5998 14.2067 14.2067 17.5999 9.9998 17.5999C5.79295 17.5999 2.3998 14.2067 2.3998 9.99988C2.3998 7.80957 3.32301 5.84313 4.7998 4.4577V5.99989C4.79831 6.10589 4.81789 6.21114 4.85742 6.30952C4.89695 6.40789 4.95564 6.49743 5.03008 6.57293C5.10451 6.64842 5.19321 6.70837 5.29102 6.74929C5.38882 6.79021 5.49378 6.81128 5.5998 6.81128C5.70582 6.81128 5.81079 6.79021 5.90859 6.74929C6.0064 6.70837 6.0951 6.64842 6.16953 6.57293C6.24397 6.49743 6.30266 6.40789 6.34219 6.30952C6.38172 6.21114 6.4013 6.10589 6.3998 5.99989V1.59988H1.9998C1.8938 1.59839 1.78854 1.61797 1.69017 1.6575C1.5918 1.69703 1.50226 1.75572 1.42676 1.83016C1.35127 1.90459 1.29132 1.99329 1.2504 2.0911C1.20948 2.1889 1.18841 2.29386 1.18841 2.39988C1.18841 2.5059 1.20948 2.61087 1.2504 2.70867C1.29132 2.80648 1.35127 2.89518 1.42676 2.96961C1.50226 3.04405 1.5918 3.10274 1.69017 3.14227C1.78854 3.1818 1.8938 3.20138 1.9998 3.19988H3.80996C1.96249 4.88368 0.799805 7.30882 0.799805 9.99988C0.799805 15.0714 4.92825 19.1999 9.9998 19.1999C15.0714 19.1999 19.1998 15.0714 19.1998 9.99988C19.1998 4.92833 15.0714 0.799885 9.9998 0.799885Z'
  )
  path.setAttribute('fill', 'currentColor')

  svg.appendChild(path)
  restartButton.appendChild(svg)

  const stopButton = document.createElement('button')
  stopButton.id = 'video-stop-button'
  stopButton.style.borderRadius = '50%'
  stopButton.style.backgroundColor = 'white'
  stopButton.style.border = 'none'
  stopButton.style.color = 'red'
  stopButton.style.fontSize = '24px'
  stopButton.style.cursor = 'pointer'
  stopButton.onclick = function () {
    // Add your record button functionality here
  }
  stopButton.style.display = 'flex'
  stopButton.style.alignItems = 'center'
  stopButton.style.justifyContent = 'center'
  stopButton.style.width = '60px'
  stopButton.style.height = '60px'
  const svgHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" rx="10" fill="#E31A1A"/>
          </svg>`

  stopButton.innerHTML = svgHTML
  // Create the pause button
  var pauseButton = document.createElement('button')
  pauseButton.id = 'video-pause-button'
  pauseButton.style.backgroundColor = 'white'
  pauseButton.style.display = 'flex'
  pauseButton.style.alignItems = 'center'
  pauseButton.style.justifyContent = 'center'
  pauseButton.style.border = 'none'
  pauseButton.style.borderRadius = '50%'
  pauseButton.style.cursor = 'pointer'
  pauseButton.onclick = function () {
    // Add your pause button functionality here
  }
  pauseButton.style.width = '40px'
  pauseButton.style.height = '40px'
  pauseButton.style.marginLeft = '8px'
  var svg = document.createElementNS(svgNS, 'svg')
  svg.id = 'playing'
  svg.setAttribute('width', '10')
  svg.setAttribute('height', '15')
  svg.setAttribute('viewBox', '0 0 10 12')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // Create the first rectangle
  var rect1 = document.createElementNS(svgNS, 'rect')
  rect1.setAttribute('width', '3')
  rect1.setAttribute('height', '25')
  rect1.setAttribute('fill', '#E31A1A')

  // Create the second rectangle
  var rect2 = document.createElementNS(svgNS, 'rect')
  rect2.setAttribute('width', '3')
  rect2.setAttribute('height', '25')
  rect2.setAttribute('transform', 'translate(7)')
  rect2.setAttribute('fill', '#E31A1A')

  // Append the rectangles to the SVG
  svg.appendChild(rect1)
  svg.appendChild(rect2)
  pauseButton.appendChild(svg)
  container.pauseTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval)
      timerInterval = null
      pausedSeconds = seconds
      svg.style.display = 'none'
      playSVG.style.display = 'block'
    }
  }

  container.resumeFromPause = () => {
    if (timerInterval === null) {
      timerInterval = setInterval(updateTimer, 1000)
      seconds = pausedSeconds
      pausedSeconds = 0
      svg.style.display = 'block'
      playSVG.style.display = 'none'
    }
  }
  var playSVG = document.createElementNS(svgNS, 'svg')
  playSVG.id = 'paused'
  playSVG.style.display = 'none'
  playSVG.setAttribute('width', '10')
  playSVG.setAttribute('height', '20')
  playSVG.setAttribute('viewBox', '0 0 10 12')
  playSVG.setAttribute('fill', 'none')
  playSVG.setAttribute('xmlns', svgNS)

  var playPath = document.createElementNS(svgNS, 'path')
  playPath.setAttribute('d', 'M0 0L10 6L0 12Z') // Triangle pointing right
  playPath.setAttribute('fill', '#E31A1A')
  playSVG.appendChild(playPath)
  pauseButton.appendChild(playSVG)
if(stream){
  restartButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'restartRecording' })
    container.updateTimerDisplay(0)
    showScreenRecordingTimer()
  })

  stopButton.addEventListener('click', () => {
    container.style.display = 'none'
    chrome.runtime.sendMessage({ action: 'stopRecording' })
  })

  pauseButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'togglePauseResumeRecording' })
    if (request.isRecordingPaused) {
      container.resumeFromPause()
    } else {
      container.pauseTimer()
    }
  })
}
  controlBar.appendChild(restartButton)
  controlBar.appendChild(stopButton)
  controlBar.appendChild(pauseButton)

  function applySavedScaleState() {
    chrome.storage.sync.get(['isScaledDown'], function (result) {
      if (result.isScaledDown) {
        container.style.transform = 'translate(-50%, -50%) scale(0.5)';
        container.classList.add('scaled-down');
        scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/maximize.png') + '")';
      } else {
        container.style.transform = 'translate(-50%, -50%) scale(1)';
        container.classList.remove('scaled-down');
        scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/minimize.png') + '")';
      }
    });
  }
  
  // Create the scale down div without setting an initial background image
  var scaleDownDiv = document.createElement('div');
  scaleDownDiv.id = 'video-scale-down';
  scaleDownDiv.style.height = '20px';
  scaleDownDiv.style.width = '20px';
  scaleDownDiv.style.position = 'absolute';
  scaleDownDiv.style.bottom = '10px';
  scaleDownDiv.style.right = '10px';
  scaleDownDiv.style.zIndex = '10002';
  scaleDownDiv.style.backgroundSize = '20px 20px';
  scaleDownDiv.style.cursor = 'pointer'; // To indicate the div is clickable
  
  // Define the onclick event handler
  scaleDownDiv.onclick = function () {
    // Toggle the scale of the container between 50% and 100%
    if (container.classList.contains('scaled-down')) {
      container.style.transform = 'translate(-50%, -50%) scale(1)';
      container.classList.remove('scaled-down');
      // Save the state as not scaled down
      chrome.storage.sync.set({ isScaledDown: false });
      // Change the div's background to the 'maximize' icon
      scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/minimize.png') + '")';
    } else {
      container.style.transform = 'translate(-50%, -50%) scale(0.5)';
      container.classList.add('scaled-down');
      // Save the state as scaled down
      chrome.storage.sync.set({ isScaledDown: true });
      // Change the div's background to the 'minimize' icon
      scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/maximize.png') + '")';
    }
  };
  
  // Apply the saved scale state, which will also set the initial background image
  applySavedScaleState();
  // Append the scale down button to the container
  container.appendChild(scaleDownDiv)

  function getCameraStream() {
    return new Promise((resolve, reject) => {
      // Retrieve the saved video device label from Chrome storage
      chrome.storage.sync.get(['selectedVideoLabel'], (result) => {
        const savedVideoLabel = result.selectedVideoLabel;
  
        // Enumerate devices to find the one matching the saved label
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            let videoDevice;
  
            if (savedVideoLabel) {
              videoDevice = videoDevices.find(device => device.label === savedVideoLabel);
            }
  
            const videoConstraints = {
              width: { ideal: width },
              height: { ideal: height },
            };
  
            // If a matching device is found, use its device ID in constraints
            if (videoDevice &&  videoDevice.deviceId !='') {
              videoConstraints.deviceId = { exact: videoDevice.deviceId };
            } else if (videoDevices.length > 0 && videoDevices[0].deviceId) {
              // If no saved label is found, choose the first available device
              videoConstraints.deviceId = { exact: videoDevices[0].deviceId };
            }
  
            // Request the camera stream with the constraints
            return navigator.mediaDevices.getUserMedia({ video: videoConstraints });
          })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  if (stream) {
    const existingContainer = document.getElementById('skoop-extension-container')
    if (existingContainer) {
      // Toggle visibility if container exists
      existingContainer.style.display = 'block'
      existingContainer.style.height = '44px'
      const resizer = document.getElementById('skoop-resizer-buttom')
      resizer.style.display = 'none'
    }
    getCameraStream()
      .then((cameraStream) => {
        const existingVideo = document.getElementById('skoop-video-recording');
        if (!existingVideo) {
        const video = document.createElement('video');
        video.id = 'skoop-video-recording';
        video.srcObject = cameraStream;
        video.autoplay = true;
        video.muted = true;
        video.style.height = height + 'px';
        video.style.width = width + 'px';
        video.style.zIndex = '9998';
        video.style.borderTopLeftRadius = '10px';
        video.style.borderTopRightRadius = '10px';
        video.className = 'skoop-video-recorder';
        container.style.height = height + 98 + 'px';
        container.style.width = width + 'px';
        container.appendChild(video);}
 
      })
      .catch((error) => {
        console.error(`Error getting camera stream: ${error}`)
      })

      
  }
  container.appendChild(controlBar)
  document.body.appendChild(container)
  return container
}
