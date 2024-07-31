injectIframe()

function requestCameraAndMicrophonePermissions() {
  // Use the modern navigator.mediaDevices.getUserMedia if available
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.info('Camera access granted')

        // Perform any checks or actions you need here

        // Close the stream by stopping all tracks
        stream.getTracks().forEach((track) => track.stop())
        console.info('Camera stream closed')
      })
      .catch((err) => {
        console.error(`The following error occurred: ${err.name}`)
        // Handle the error here (e.g., show a message to the user)
      })
  } else {
    console.error('getUserMedia not supported')
  }
}

// Call the function to request permissions when the page loads

// Function to create a button on the webpage
function createButton() {
  const buttonId = 'skoop-extension-button'
  const extensionButton = document.getElementById(buttonId)
  // If the button already exists, do nothing
  if (extensionButton) {
    return
  }

  // Create the button container
  const buttonContainer = document.createElement('div')
  buttonContainer.id = buttonId
  buttonContainer.className = 'extension-button'
  buttonContainer.style.position = 'fixed'
  buttonContainer.style.top = '10px'
  buttonContainer.style.right = '10px'
  buttonContainer.style.width = '40px'
  buttonContainer.style.height = '40px'
  buttonContainer.style.borderRadius = '50%'
  buttonContainer.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/icon.png') + '")'
  buttonContainer.style.backgroundSize = 'cover'
  buttonContainer.style.backgroundPosition = 'center'
  buttonContainer.style.backgroundRepeat = 'no-repeat'
  buttonContainer.style.zIndex = '10000000000000'
  buttonContainer.style.display = 'flex'
  buttonContainer.style.alignItems = 'center'
  buttonContainer.style.justifyContent = 'center'
  buttonContainer.style.cursor = 'pointer'

  // Add click event listener to the button
  buttonContainer.addEventListener('click', injectIframe)

  // Gmail insertion
  // var accountButtonParent = document.querySelector(".gb_Pd");

  // // Append the new button to the right of the account button
  // if (accountButtonParent) {
  //     accountButtonParent.appendChild(buttonContainer);
  // } else {
  //     console.error("Account button parent element not found.");
  // }

  //     if(url=="mail.google.com"){
  //         const headers1 = document.getElementsByTagName('header');
  //         if (headers1.length > 0) {
  //             const headerElement = headers1[0];
  //             const secondChild = headerElement.children[1].children[2].children[0];
  //             headerElement.children[1].children[2].children[0].children[1].style.display="flex";
  //             secondChild.style.display="flex";
  //             secondChild.style.top="-6px";
  //             secondChild.insertBefore(buttonContainer,headerElement.children[1].children[2].children[0].children[1])
  //             // secondChild.appendChild(buttonContainer);

  //         } else {
  //             console.log('No header element found');
  //         }
  // }else{
  //     buttonContainer.style.position = 'fixed';
  //     buttonContainer.style.top = '15px';
  //     buttonContainer.style.right = '43px';
  // }
  document.body.appendChild(buttonContainer)
}
function collectClasses() {
  const allElements = document.querySelectorAll('*')
  const classes = Array.from(allElements)
    .map((el) => el.className)
    .filter(Boolean)
  return [...new Set(classes)] // Return unique classes only
}
// Create the button when the page loads
createButton()

function getHostUrl() {
  const hostUrl = new URL(window.location.href).hostname
  return hostUrl
}
let skoopExtensionContainer
function resizeIframe(newWidth, newHeight, display = 'block') {
  // Select the iframe element by ID
  skoopExtensionContainer = document.getElementById('skoop-extension-container')

  // Check if the element exists
  if (skoopExtensionContainer) {
    // Set the new width and height
    skoopExtensionContainer.style.width = newWidth + 'px'
    skoopExtensionContainer.style.minWidth = newWidth + 'px'

    skoopExtensionContainer.style.height = newHeight + 'px'
    skoopExtensionContainer.style.display = display
  } else {
    console.error('Iframe with id "skoop-extension-iframe" not found.')
  }
}

function attachScreenRecordingContainer(height, width) {
  // Check if the webcam container exists
  if (skoopVideoContainer) {
    skoopVideoContainer.reinitialize()
  } else {
    skoopVideoContainer = createWebcamContainer(height, width)
    // The container does not exist, create it
  }
  skoopVideoContainer.show()
  // Check if the webcam container is not already in the current document's body
  if (document.body.contains(skoopVideoContainer)) {
    // The webcam container is already in place, no need to re-attach

    return
  }

  document.body.appendChild(skoopVideoContainer)
}
// Function to stop the webcam

let mediaRecorder
let recordedChunks = []
let skoopVideoContainer
let isRecording = false
let isRestarting = false
let stopTimeoutId
let isTimerPaused = false
function stopStream() {
  skoopVideoContainer.stopTimer()
  skoopVideoContainer.resetTimer()
  mediaRecorder.stop()
  if (!isRestarting) {
    skoopVideoContainer.style.display = 'none'
  }
  clearTimeout(stopTimeoutId)
  isRecording = false
}
function saveRecordingChunk(blob) {
  const reader = new FileReader()
  reader.onloadend = function () {
    // Convert the ArrayBuffer to a Uint8Array
    const uInt8Array = new Uint8Array(reader.result)
    let binaryString = ''
    for (let i = 0; i < uInt8Array.length; i++) {
      binaryString += String.fromCharCode(uInt8Array[i])
    }

    const base64data = btoa(binaryString)
    chrome.storage.local.get({ recordedChunks: [] }, function (result) {
      // Append the Base64 string to the recordedChunks array
      const newChunks = [...result.recordedChunks, base64data]
      // Save the updated array back to storage
      chrome.storage.local.set({ recordedChunks: newChunks }, function () {
        // console.log('Recording chunk saved', newChunks.length, newChunks)
      })
    })
  }
  // Start reading the Blob as an ArrayBuffer
  reader.readAsArrayBuffer(blob)
}

// This function retrieves all recording chunks from Chrome storage and compiles them into a Blob
function compileRecordingChunks(callback) {
  chrome.storage.local.get('recordedChunks', function (result) {
    if (result.recordedChunks && result.recordedChunks.length > 0) {
      // Convert Base64 strings back to ArrayBuffers
      const arrayBuffers = result.recordedChunks.map((base64) => {
        const binary_string = atob(base64)
        const len = binary_string.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i)
        }
        return bytes.buffer
      })
      // Create a Blob from the ArrayBuffers
      const blob = new Blob(arrayBuffers, { type: 'video/webm' })
      const blobUrl = URL.createObjectURL(blob)
      callback(blob, blobUrl)
      // Optionally clear the stored chunks after compiling them
      chrome.storage.local.remove('recordedChunks')
    } else {
      console.error('No recorded chunks found or empty recording.')
    }
  })
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'collectClasses') {
      const classes = collectClasses()
      const url = getHostUrl()
      sendResponse({ classes: classes, url })
    }
    if (request.action === 'showScreenRecordingTimer') {
      showScreenRecordingTimer()
      applySavedScaleState()
    }
    if (request.action === 'resizeIframe') {
      skoopExtensionContainer = document.getElementById('skoop-extension-container')
      if (request.reset) {
        skoopExtensionContainer.style.setProperty('min-width', '355px', 'important')
        skoopExtensionContainer.style.setProperty('width', '355px', 'important')
      } else {
        resizeIframe(request.width, request.height)
      }
      if (request.hideResizer) {
        const resizer = document.getElementById('skoop-resizer-buttom')
        if (resizer) {
          resizer.style.display = 'none'
        }
        const scaleButton = document.getElementById('container-scale-down')
        if (scaleButton) {
          scaleButton.style.display = 'block'
          applySavedScaleState()
        }
      }
      if (request.showResizer) {
        const resizer = document.getElementById('skoop-resizer-buttom')
        if (resizer) {
          resizer.style.display = 'block'
        }
        const scaleButton = document.getElementById('container-scale-down')
        if (scaleButton) {
          scaleButton.style.display = 'none'
        }
        const container = document.getElementById('skoop-extension-container')
        if (container) {
          container.style.transform = 'scale(1)'
        }
      }
      sendResponse({ result: 'Iframe resized' })
    }

    if (request.action === 'screenRecordingStopped') {
      const resizer = document.getElementById('skoop-resizer-buttom')
      if (resizer) {
        resizer.style.display = 'block'
      }
      const scaleButton = document.getElementById('container-scale-down')
      if (scaleButton) {
        scaleButton.style.display = 'none'
      }
      const container = document.getElementById('skoop-extension-container')
      if (container) {
        container.style.transform = 'scale(1)'
      }
    }

    if (request.action === 'startRecording' && !request.isScreenRecording) {
      const getStoredDeviceLabels = (callback) => {
        chrome.storage.sync.get(['selectedVideoLabel', 'selectedAudioLabel'], (result) => {
          callback(result.selectedVideoLabel, result.selectedAudioLabel)
        })
      }

      skoopVideoContainer = document.getElementById('skoop-webcam-container')
      if (!skoopVideoContainer) {
        skoopVideoContainer = createWebcamContainer(request.height, request.width, false)
      }
      requestCameraAndMicrophonePermissions()
      getStoredDeviceLabels((storedVideoLabel, storedAudioLabel) => {
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === 'videoinput')
            const audioDevices = devices.filter((device) => device.kind === 'audioinput')

            let videoDevice
            if (storedVideoLabel) {
              videoDevice = videoDevices.find((device) => device.label === storedVideoLabel)
            }
            if (!videoDevice && videoDevices.length > 0) {
              videoDevice = videoDevices[0] // Select the first video device if no stored label matches
            }

            let audioDevice
            if (storedAudioLabel) {
              audioDevice = audioDevices.find((device) => device.label === storedAudioLabel)
            }
            if (!audioDevice && audioDevices.length > 0) {
              audioDevice = audioDevices[0] // Select the first audio device if no stored label matches
            }

            let videoConstraints = {
              width: { ideal: request.width },
              height: { ideal: request.height },
            }
            if (videoDevice && videoDevice.deviceId != '') {
              videoConstraints.deviceId = { exact: videoDevice.deviceId }
            }

            let audioConstraints = {}
            if (audioDevice && audioDevice.deviceId != '') {
              audioConstraints.deviceId = { exact: audioDevice.deviceId }
            } else {
              audioConstraints = true // Use the default audio device
            }
            return navigator.mediaDevices.getUserMedia({
              video: videoConstraints,
              audio: audioConstraints,
            })
          })
          .then((stream) => {
            function startRecording() {
              mediaRecorder = new MediaRecorder(stream)
              mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) recordedChunks.push(event.data)
              }
              mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' })
                const blobUrl = URL.createObjectURL(blob)
                recordedChunks = []
                isRecording = false
                if (!isRestarting) {
                  const videos = skoopVideoContainer.getElementsByTagName('video')

                  const video = videos[videos.length - 1] // Last video element

                  if (stream) {
                    stream.getTracks().forEach((track) => track.stop())
                  }
                  if (video && video?.srcObject) {
                    video.srcObject.getTracks().forEach((track) => track.stop())
                    skoopVideoContainer.removeChild(video)
                    skoopVideoContainer.destroy()
                    skoopVideoContainer = null
                  } else {
                    console.error('The last video element is undefined, or srcObject is null.')
                  }

                  sendResponse({ videoBlob: blob, url: blobUrl })
                }
              }
              isRecording = true
              mediaRecorder.start()
              stopTimeoutId = setTimeout(() => {
                if (isRecording) {
                  stopStream()
                }
              }, 120000)
            }
            const video = document.createElement('video')
            video.id = 'skoop-video-recording'
            video.srcObject = stream
            video.autoplay = true
            video.muted = true
            video.style.height = request.height + 'px'
            // video.style.width = request.width + 'px'
            video.style.zIndex = '9998'
            video.style.borderTopLeftRadius = '10px'
            video.style.borderTopRightRadius = '10px'
            video.className = 'skoop-video-recorder'
            skoopVideoContainer.style.height = request.height + 98 + 'px'
            skoopVideoContainer.style.backgroundColor = 'black'
            // skoopVideoContainer.style.width = request.width + 'px'
            skoopVideoContainer.appendChild(video)
            skoopVideoContainer.style

            skoopVideoContainer.showCountdown()

            function stopStream() {
              skoopVideoContainer.stopTimer()
              skoopVideoContainer.resetTimer()
              mediaRecorder.stop()
              if (!isRestarting) {
                skoopVideoContainer.style.display = 'none'
              }
              clearTimeout(stopTimeoutId)

              isRecording = false
            }
            function restartStream() {
              recordedChunks = []
              skoopVideoContainer.showCountdown()

              isRestarting = true
              stopStream()
              setTimeout(() => {
                startRecording()
                isRestarting = false
              }, 3000)
            }
            const playingIcon = document.getElementById('playing')
            const pausedIcon = document.getElementById('paused')
            function togglePauseResumeMediaRecorder() {
              // Check if the mediaRecorder is defined and has a state

              if (mediaRecorder && mediaRecorder.state) {
                // If the mediaRecorder is recording, pause it
                if (mediaRecorder.state === 'recording') {
                  mediaRecorder.pause()
                  skoopVideoContainer.pauseTimer()
                  playingIcon.style.display = 'none'
                  pausedIcon.style.display = 'block'
                }
                // If the mediaRecorder is paused, resume it
                else if (mediaRecorder.state === 'paused') {
                  mediaRecorder.resume()
                  skoopVideoContainer.resumeFromPause()
                  pausedIcon.style.display = 'none'
                  playingIcon.style.display = 'block'
                } else {
                  console.error('MediaRecorder is in an unexpected state:', mediaRecorder.state)
                }
              } else {
                console.error('MediaRecorder is not initialized or does not exist')
              }
            }

            setTimeout(() => {
              startRecording()
            }, 3000)

            skoopVideoContainer.style.display = 'block'

            const stopButton = document.getElementById('video-stop-button')
            if (stopButton) {
              stopButton.addEventListener('click', stopStream)
            }

            const pauseButton = document.getElementById('video-pause-button')
            if (pauseButton) {
              pauseButton.addEventListener('click', togglePauseResumeMediaRecorder)
            }

            const restartButton = document.getElementById('video-restart-button')
            if (restartButton) {
              restartButton.addEventListener('click', restartStream)
            }
          })
          .catch((err) => {
            console.error(`[Creating web cam in website]: ${err}`)
            sendResponse({ error: err })
            if (err.message.includes('in use') || err.message.includes('hardware error') || err.name === 'NotAllowedError') {
              alert('Could not access your camera. It appears to be in use by another application. Please close the other application and try again.')
            }
          })
      })
      return true
    }
    if (request.action === 'stopRecording') {
      const stopButton = document.getElementById('video-stop-button')
      stopButton.click()

      return true
    }
    if (request.action === 'showWebcam') {
      // Get the container by ID

      const container = document.getElementById('skoop-extension-container')

      if (container) {
        applySavedScaleState()
        // Retrieve the position from Chrome storage
        chrome.storage.sync.get('containerPosition', (data) => {
          if (data.containerPosition) {
            // Check if stored positions are not undefined
            const { left, top } = data.containerPosition
            if (left && top) {
              // Set the position of the container
              container.style.position = 'fixed' // Ensure it's positioned absolutely
              container.style.left = left
              container.style.top = top
            }
          } else {
            // Optionally set a default position if nothing is stored
            container.style.left = '14px' // Default left position
            container.style.top = '13px' // Default top position
          }
        })
        const resizer = document.getElementById('skoop-resizer-buttom')
        if (resizer) {
          resizer.style.display = 'none'
        }
        const scaleButton = document.getElementById('container-scale-down')

        if (scaleButton && request.captureCameraWithScreen) {
          scaleButton.style.display = 'block'
        }
      } else {
        console.error('Failed to find the container with ID "skoop-extension-container".')
      }

      sendResponse({ message: 'Webcam container attached and displayed with updated timer' })
    }

    if (request.action === 'closeWebcam') {
      // Check if the webcam container is not already in the current document's body
      if (document.body.contains(skoopVideoContainer)) {
        skoopVideoContainer.destroy()
      }
    }
    if (request.action === 'stopRecording') {
      const stopButton = document.getElementById('video-stop-button')
      stopButton.click()

      return true
    }

    if (request.action === 'restartRecording') {
      const restartButton = document.getElementById('video-restart-button')
      if (restartButton) {
        restartButton.click()
      }
      skoopVideoContainer.updateTimerDisplay(0)
      return true
    }
    if (request.action === 'showVideoPreview') {
      return true
    }

    if (request.action === 'startPlayingVideo') {
      let existingContainer = document.getElementById('skoop-helper-video-element')
      let existingOverlay = document.getElementById('skoop-helper-video-overlay')
      if (existingContainer) {
        // Toggle visibility if container exists
        existingContainer.remove()
        existingOverlay.remove()
      }

      // create the container
      let container = document.createElement('div')
      container.id = 'skoop-helper-video-element'
      container.style.position = 'absolute'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100%'
      container.style.height = '100vh'
      container.style.display = 'grid'
      container.style.placeItems = 'center'
      container.style.zIndex = '999999'

      // create-overlay for container
      let overlay = document.createElement('div')
      overlay.id = 'skoop-helper-video-overlay'
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100%'
      overlay.style.height = '100%'
      overlay.style.backgroundColor = 'rgba(42, 43, 57, 0.244)'
      overlay.style.zIndex = '99999'

      // create the modal
      let modal = document.createElement('div')
      modal.id = 'skoop-helper-video-modal'
      modal.style.position = 'relative'
      modal.style.display = 'flex'
      modal.style.justifyContent = 'center'
      modal.style.alignItems = 'center'

      // create modal box
      let modalBox = document.createElement('div')
      modalBox.id = 'skoop-helper-video-modal-box'
      modalBox.style.position = 'fixed'
      modalBox.style.top = '50%'
      modalBox.style.left = '50%'
      modalBox.style.transform = 'translate(-50%, -50%)'
      modalBox.style.width = request.width + 'px'
      modalBox.style.height = '100%'
      modalBox.style.display = 'flex'
      modalBox.style.justifyContent = 'center'
      modalBox.style.alignItems = 'center'
      modalBox.style.flexDirection = 'column'
      modalBox.style.borderRadius = '8px'

      // button container
      let buttonContainer = document.createElement('div')
      buttonContainer.id = 'skoop-helper-video-button-container'
      buttonContainer.style.position = 'absolute'
      buttonContainer.style.top = '0'
      buttonContainer.style.right = '0'
      buttonContainer.style.display = 'flex'
      buttonContainer.style.justifyContent = 'end'
      buttonContainer.style.width = '100%'
      buttonContainer.style.zIndex = '999999'

      // button
      let button = document.createElement('button')
      button.id = 'skoop-helper-video-close-button'
      button.textContent = 'Close'
      button.innerHTML = `<svg stroke="currentColor" fill="#ffffff" stroke-width="0" viewBox="0 0 512 512" class="text-light" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>`
      button.style.backgroundColor = 'transparent'
      button.style.border = 'none'
      button.style.cursor = 'pointer'
      button.style.outline = 'none'
      button.style.marginRight = '10px'
      button.style.paddingTop = '5px'

      button.addEventListener('click', () => {
        container.remove()
        overlay.remove()
      })

      // modal content
      let modalContent = document.createElement('div')
      modalContent.id = 'skoop-helper-video-modal-content'
      modalContent.style.position = 'relative'
      modalContent.style.width = request.width + 'px'
      modalContent.style.height = request.height + 'px'
      modalContent.style.borderRadius = '8px'
      modalContent.style.overflow = 'hidden'

      // close the video when clicked outside of the video
      document.addEventListener('click', function (event) {
        if (!modalContent.contains(event.target)) {
          container.remove()
          overlay.remove()
        }
      })

      // create the iframe
      let iframe = document.createElement('iframe')
      iframe.id = 'skoop-helper-video-iframe'
      iframe.src = request.src
      iframe.style.border = 'none'
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.position = 'relative'

      modalContent.appendChild(iframe)
      buttonContainer.appendChild(button)
      modalContent.appendChild(buttonContainer)
      modalBox.appendChild(modalContent)
      modal.appendChild(modalBox)
      container.appendChild(modal)
      document.body.appendChild(overlay)
      document.body.appendChild(container)
    }

    if (request.action === 'initializeExtensionDimension') {
      const extensionDimension = localStorage.getItem('skoopExtensionDimension')
      if (extensionDimension) {
        localStorage.removeItem('skoopExtensionDimension')
        const container = document.getElementById('skoop-extension-container')
        container.style.width = '12.2vw'
        container.style.height = '98vh'
      }
      return true
    }

    return true
  } catch (err) {
    console.error(err)
  }
})

// MutationObserver to handle dynamic changes in the DOM
const observer = new MutationObserver(createButton)
observer.observe(document.body, { subtree: true, childList: true })

var isProfilePage = false
// Function to handle mutations
function handleMutations(mutationsList) {
  mutationsList.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.nodeType === 1 && addedNode.classList && addedNode.classList.contains('msg-convo-wrapper')) {
          // Send a message or perform actions for the added element
          chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
            if (response.tabId) {
              chrome.runtime.sendMessage({
                action: 'elementAdded',
                element: addedNode.outerHTML,
                tabId: response.tabId,
              })
            }
          })
        }
      })

      mutation.removedNodes.forEach((removedNode) => {
        if (removedNode.nodeType === 1 && removedNode.classList && removedNode.classList.contains('msg-convo-wrapper')) {
          // Send a message or perform actions for the removed element
          chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
            if (response.tabId) {
              chrome.runtime.sendMessage({
                action: 'elementRemoved',
                element: removedNode.outerHTML,
                tabId: response.tabId,
              })
            }
          })
        }
      })
    }

    mutation.removedNodes.forEach((removedNode) => {
      if (removedNode.nodeType === 1) {
        // Check if an h1 tag with inner text "Messaging" is removed
        const h1Elements = removedNode.querySelectorAll('h1')
        const MessagingTabFound = false
        h1Elements.forEach((h1) => {
          if (h1.innerText == 'Messaging') {
            MessagingTabFound = true
          }
        })
        if (MessagingTabFound == false) {
          chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
            if (response.tabId) {
              chrome.runtime.sendMessage({
                action: 'elementRemoved',
                tabId: response.tabId,
              })
            }
          })
        }
      }
    })

    if (window.location.href.includes('www.linkedin.com/in') && !isProfilePage) {
      isProfilePage = true
      chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
        if (response.tabId) {
          chrome.runtime.sendMessage({
            action: 'skoopMsgIsProfilePage',
            tabId: response.tabId,
          })
        }
      })
    }

    if (window.location.href.includes('www.linkedin.com/in') == false && isProfilePage) {
      isProfilePage = false
      chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
        if (response.tabId) {
          chrome.runtime.sendMessage({
            action: 'skoopMsgIsNotProfilePage',
            tabId: response.tabId,
          })
        }
      })
    }
  })
}

// Create a Mutation Observer instance
const observerForCheckboxes = new MutationObserver(handleMutations)

// Start observing the document
observerForCheckboxes.observe(document, {
  childList: true,
  subtree: true,
})

// adding event listner to find the last selected element for insertion at Gmail

document.addEventListener('focusin', (event) => {
  chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
    if (response.tabId) {
      chrome.runtime.sendMessage({
        action: 'skoopFocusedElementChanged',
        elementId: event.target.id,
        tabId: response.tabId,
      })
    }
  })
})

document.addEventListener('focusin', (event) => {
  let targetElement = event.target // The element that triggered the focus event
  let parentElement = targetElement.closest('[data-id], [data-urn], [data-chameleon-result-urn]')

  if (parentElement && targetElement.ariaPlaceholder) {
    // Determine which identifier is present on the parentElement
    let identifierType
    let identifierValue

    if (parentElement.hasAttribute('data-id')) {
      identifierType = 'data-id'
      identifierValue = parentElement.getAttribute('data-id')
    } else if (parentElement.hasAttribute('data-urn')) {
      identifierType = 'data-urn'
      identifierValue = parentElement.getAttribute('data-urn')
    } else if (parentElement.hasAttribute('data-chameleon-result-urn')) {
      identifierType = 'data-chameleon-result-urn'
      identifierValue = parentElement.getAttribute('data-chameleon-result-urn')
    }

    // If an identifier was found, collect element information
    if (identifierType && identifierValue) {
      const elementInfo = {
        className: targetElement.classList,
        placeholder: targetElement.ariaPlaceholder,
        postId: identifierValue, // Use the value of the found identifier
        identifierType: identifierType, // Specify which identifier was found
      }
      chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
        if (response.tabId) {
          chrome.runtime.sendMessage({
            action: 'skoopFocusedElementLinkedin',
            element: elementInfo,
            tabId: response.tabId,
          })
        }
      })
    }
  } else {
    chrome.runtime.sendMessage({ action: 'getTabId' }, function (response) {
      if (response.tabId) {
        chrome.runtime.sendMessage({
          action: 'skoopFocusedElementLinkedin',
          element: false,
          tabId: response.tabId,
        })
      }
    })
  }
})
