let currentWebcamTabId = null
let webcamDimensions = { width: null, height: null }
let isScreenRecording = false
let screenRecordingTab
let recordingStartTime = null
let timerInterval = null
let recordingStreamId = null
let previousWebcamTabId = null
let isRecordingPaused = false
let pausedTime = 0
let captureCameraWithScreen

chrome.action.onClicked.addListener((tab) => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {

        chrome.tabs.sendMessage(tabs[0].id, { action: "openExtension" }, (response) => {
            console.info("Message sent to active tab:", response);
        });
    }
});
});


const startScreenRecording = async () => {
  await chrome.tabs.query({ active: true, lastFocusedWindow: true, currentWindow: true }, async function (tabs) {
    // Get current tab to focus on it after start recording on recording screen tab
    const currentTab = tabs[0]

    // Create recording screen tab
    const tab = await chrome.tabs.create({
      url: chrome.runtime.getURL('recorder.html'),
      pinned: true,
      active: true,
    })

    // Wait for recording screen tab to be loaded and send message to it with the currentTab
    chrome.tabs.onUpdated.addListener(async function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener)
        screenRecordingTab = tabId
        await chrome.tabs.sendMessage(tabId, {
          action: 'startRecording',
          body: {
            currentTab: currentTab,
          },
        })
      }
    })
  })
}

function updateTimer() {
  if (recordingStartTime !== null) {
    const elapsedTime = Date.now() - recordingStartTime
    // Format elapsedTime into a human-readable format (e.g., "mm:ss")
    const formattedTime = formatTime(elapsedTime)

    // Send the formatted time to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateTimer',
          time: formattedTime,
        })
      }
    })
  }
}

function startTimer() {
  // Wait for 3 seconds before starting the timer
    if (timerInterval) {
    clearInterval(timerInterval);
  }
  setTimeout(() => {
    recordingStartTime = Date.now()
    timerInterval = setInterval(updateTimer, 1000) // Update every second
  }, 3) // 3000 milliseconds delay for the initial countdown
}
let pauseInterval;

function pauseTimer() {
  if (timerInterval) {
    pausedTime = Date.now() - recordingStartTime;
    clearInterval(timerInterval);
    timerInterval = null;
    isRecordingPaused=true
    // Start an interval to send the paused state every second
    pauseInterval = setInterval(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateTimer',
            time: formatTime(pausedTime),
            isPaused: true
          });
        }
      });
    }, 1000);
  }
}
function resumeTimer() {

  if (!timerInterval && recordingStartTime !== null && isRecordingPaused) {
    // Clear any pause interval that might be running
    clearInterval(pauseInterval);
    pauseInterval = null;

    recordingStartTime = Date.now() - pausedTime;
    timerInterval = setInterval(updateTimer, 1000); // Resume regular updates
    isRecordingPaused = false; // Make sure to reset the pause flag
  }
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval)
  recordingStartTime = null
}
function restartTimer() {
  // Stop the current timer if it's running
  stopTimer()

  // Reset the recording start time and paused time
  recordingStartTime = Date.now()
  pausedTime = 0

  // Start the timer again with a 3-second delay
  startTimer()
}
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { 
  try {
    if (request.action === 'startRecording') {
      currentWebcamTabId = sender.tab.id
      screenRecordingTab = sender.tab.id
      webcamDimensions.width = request.width
      webcamDimensions.height = request.height
      captureCameraWithScreen = request.captureCameraWithScreen

      if (request.isScreenRecording) {
        startScreenRecording()
 
        isScreenRecording = true
        
      } 
      return true
    } else if (request.action === 'stopRecording') {
      webcamDimensions = { width: null, height: null }
      isScreenRecording = false
      captureCameraWithScreen = false
      
      stopTimer()

      chrome.tabs.sendMessage(screenRecordingTab, { action: 'stopRecording' })
    } else if (request.action === 'togglePauseResumeRecording') {
      if (isScreenRecording) {
        if (!isRecordingPaused) {
       
          pauseTimer()
        } else {
      
          resumeTimer()
        }
        sendResponse({ status: isRecordingPaused ? 'paused' : 'resumed' }) // Send response back to content script
      }
    } else if (request.action === 'restartRecording') {
      if (isScreenRecording) {
        setTimeout(()=>{restartTimer()},3000)
        
        
      }
    }

    if (request.action === 'startScreenRecordingTimer') {
      startTimer()
    }
    if (request.action === 'screenRecordingStopped') {
      isScreenRecording = false
      clearInterval(pauseInterval);
      pauseInterval = null;
  

      isRecordingPaused = false;
      if (currentWebcamTabId !== null) {
        chrome.tabs.sendMessage(currentWebcamTabId, {
          action: 'screenRecordingStopped',
          videoBlob: request.videoBlob,
          url: request.url,
          currentWebcamTabId,
        })
        chrome.tabs.query({}, function(tabs) {
          for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {
              action: 'screenRecordingStopped'
            }, function(response) {
              // Handle response from the content script
            });
          }
        });
       
        currentWebcamTabId = null
      }
    }

    let senderTabId
    if (sender && sender.tab && sender.tab.id) {
      senderTabId = sender.tab.id
    }
    if (request.action === 'getTabId') {
      if (sender.tab) {
        // Message is from a content script in a tab
        sendResponse({ tabId: sender.tab.id, url: sender.tab.url, source: 'tab' });
      } else {
      
        sendResponse({ tabId: null, url: null, source: 'popup' });
      }
    }

    if (request.action === 'storeToken' && request.token) {
      chrome.storage.local.set({ skoopCrmAccessToken: request.token }, function () {
        console.info('Token stored in extension local storage.')
      })
    }


  

    if (request.action === 'startPlayingVideo') {
      chrome.tabs.sendMessage(
        sender.tab.id,
        {
          action: 'startPlayingVideo',
          width: request.width ? request.width : '589',
          height: request.height ? request.height : '322',
          src: request.src ? request.src : '',
        },
        (response) => {
          if (!response) {
            console.error('Error resizing iframe:', chrome.runtime.lastError)
          }
        }
      )
    }

    if (request.action === 'showImagePreview') {
      chrome.tabs.sendMessage(
        sender.tab.id,
        {
          action: 'showImagePreview',
          width: request.width ? request.width : '589',
          height: request.height ? request.height : '322',
          src: request.src ? request.src : '',
        },
        (response) => {
          if (!response) {
            console.error('Error resizing iframe:', chrome.runtime.lastError)
          }
        }
      )
    }
   
    if (request.action === 'resizeIframe') {
      
      chrome.tabs.sendMessage(
        sender.tab.id,
        {
          action: 'resizeIframe',
          width: request.width ? request.width : '375px',
          height: request.height ? request.height : '812px',
          reset:request.reset,
          showResizer:request.showResizer,
          hideResizer:request.hideResizer,
          
        },
        (response) => {
          if (!response) {
            console.error('Error resizing iframe:', chrome.runtime.lastError)
          }
        }
      )
    }
    if (request.message === 'initializeExtensionDimension') {
      chrome.tabs.query({}, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        // Find the tab with either the Google Mail URL or the LinkedIn URL
        const targetTab = tabs.find((tab) => tab.active && (tab.url.startsWith(urlToFindGoogle) || tab.url.startsWith(urlToFindLinkedIn)))

        if (targetTab) {
          chrome.tabs.sendMessage(
            targetTab.id,
            {
              action: 'initializeExtensionDimension',
            },
            (response) => {
              if (!response) {
                console.error('Error while initializing extension dimension:', chrome.runtime.lastError)
              }
            }
          )
        }
      })
    }
    if (request.action === 'resetState') {
   
      webcamDimensions = { width: null, height: null }
      isScreenRecording = false
      captureCameraWithScreen = false

    }
  } catch (err) {
    console.error(err, 'backgeound error')
  }
  return true
})

function handleTabActivation(tabId) {

  if (isScreenRecording) {
    // If there was a previous webcam tab and it's different from the current tab, send a message to close the webcam container
    if (previousWebcamTabId && previousWebcamTabId !== tabId) {
      chrome.tabs.sendMessage(previousWebcamTabId, {
        action: 'closeWebcam',
      })
    }

    // Update the current webcam tab ID
    currentWebcamTabId = tabId

    // Calculate the elapsed time since recording started
    const elapsedTime = isRecordingPaused ? pausedTime : recordingStartTime ? Date.now() - recordingStartTime : 0
    // Format elapsedTime into a human-readable format, e.g., "mm:ss"
    // You may want to implement a function to format the elapsed time accordingly
    const formattedTime = elapsedTime // Replace with a function call if necessary

    // Send the updated timer and webcam dimensions to the active tab
    chrome.tabs.sendMessage(tabId, {
      action: 'showWebcam',
      width: webcamDimensions.width,
      height: webcamDimensions.height,
      time: formattedTime,
      screenRecordingTab,
      isRecordingPaused,
      captureCameraWithScreen
    })

    // Remember the current tab as the previous webcam tab for next time
    previousWebcamTabId = tabId
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab's status is 'complete', which indicates that the page has finished loading
  
  if (changeInfo.status === 'complete' && tab.active) {
    handleTabActivation(tabId)
    if (isScreenRecording && captureCameraWithScreen) {
      setTimeout(()=>{ chrome.tabs.sendMessage(tabId, {
        action: 'screenRecordingStarted',countdown:false,captureCameraWithScreen
      })},1500)
      
    }
  }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  handleTabActivation(activeInfo.tabId)
})
