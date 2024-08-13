var mediaRecorder = null
var chunks = []
let videoStoppingTab
let isRestarting = false
let recordingStream
// Message listener for commands from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startRecording':
      startRecording(message.body.currentTab.id)
      sendResponse({ status: 'recordingStarted' })
      break
    case 'stopRecording':
      isRestarting = false

      videoStoppingTab = sender
      if (recordingStream && recordingStream.getTracks) {
        recordingStream.getTracks().forEach((track) => track.stop())
      }
      mediaRecorder.stop()
      break
    case 'togglePauseResumeRecording':
      if (mediaRecorder) {
        if (mediaRecorder.state === 'paused') {
          mediaRecorder.resume()
          sendResponse({ status: 'recordingResumed' })
        } else if (mediaRecorder.state === 'recording') {
          mediaRecorder.pause()
          sendResponse({ status: 'recordingPaused' })
        }
      }
      break
    case 'restartRecording':
      if (mediaRecorder && sender.tab.id) {
        isRestarting = true // Set the flag
        mediaRecorder.stop() // This will trigger the onstop function with the restart logic
        sendResponse({ status: 'recordingRestarted' })
      }
      break
  }
  // Return true to indicate that you will send a response asynchronously
  return true
})
const getStoredDeviceLabels = (callback) => {
  chrome.storage.sync.get(['selectedAudioLabel'], (result) => {
    callback(result.selectedAudioLabel)
  })
}
// Assuming other parts of your script remain unchanged, we'll just update the startRecording function:

async function startRecording(currentTabId) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.info('Camera and microphone access granted')

        chrome.desktopCapture.chooseDesktopMedia(['tab', 'window', 'screen', 'audio'], function (streamId, options) {
          if (!streamId) {
            // Handle the case where the user cancels the media selection
            chrome.runtime.sendMessage({ action: 'resetState' });
            setTimeout(async () => {
              window.close()
              await chrome.tabs.update(currentTabId, { active: true, selected: true })
            }, 1500);
          
            return;
          }
      
          // Capture the desktop stream with system audio
          navigator.mediaDevices.getUserMedia({
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId
              }
            },
            audio: options.canRequestAudioTrack ? {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId
              }
            } : false
          })
          .then((desktopStream) => {
            // Now capture the microphone stream
            getStoredDeviceLabels((storedAudioLabel) => {
              navigator.mediaDevices.enumerateDevices()
                .then((devices) => {
                  const audioDevice = devices.find((device) => device.kind === 'audioinput' && device.label === storedAudioLabel);
                  let audioConstraints = false;
                  if (audioDevice) {
                    audioConstraints = { deviceId: { exact: audioDevice.deviceId } };
                  }
      
                  // If no audio device is found or no label is stored, audioConstraints will remain 'false'
                  // and no microphone audio will be captured.
                  if (audioConstraints) {
                    return navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
                  } else {
                    return Promise.resolve(new MediaStream());
                  }
                })
                .then((microphoneStream) => {
                  const combinedStream = new MediaStream([
                      ...desktopStream.getVideoTracks(),
                      ...microphoneStream.getAudioTracks(),
                    ]);
                  // Now we have a combined stream with desktop video and audio + microphone audio
      
                  setupMediaRecorder(combinedStream);
                })
                .catch((error) => {
                  console.error('Error capturing microphone:', error);
                });
            });
          })
          .catch((error) => {
            console.error('Error capturing desktop:', error);
          }).finally(async () => {
            await chrome.tabs.update(currentTabId, { active: true, selected: true })
            chrome.tabs.sendMessage(currentTabId, { action: 'showScreenRecordingTimer' })
            chrome.tabs.sendMessage(currentTabId,    {
              action: 'screenRecordingStarted', countdown:true
            })
         
          });
        });
      })
      .catch((err) => {
        console.error(`The following error occurred: ${err.name}`)
        // Handle the error here (e.g., show a message to the user)
      })
  } else {
    console.error('getUserMedia not supported')
  }
  
  
}

function setupMediaRecorder(stream) {
  mediaRecorder = new MediaRecorder(stream);
  chunks = [];

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = async function (e) {
    if (!isRestarting) {
      handleRecordingStop(stream, chunks, videoStoppingTab);
    } else {
      restartRecording(stream);
    }
  };

  // Start recording after a delay
  setTimeout(() => {
    mediaRecorder.start();
    chrome.runtime.sendMessage({ action: 'startScreenRecordingTimer' });
  }, 3000);
}

// Other functions (handleRecordingStop, restartRecording) remain unchanged.

function handleRecordingStop(stream, chunks, videoStoppingTab) {
  const blobFile = new Blob(chunks, { type: 'video/webm' })
  const url = URL.createObjectURL(blobFile)
  stream.getTracks().forEach((track) => track.stop())
  chrome.runtime.sendMessage({
    action: 'screenRecordingStopped',
    videoBlob: blobFile,
    url,
    videoStoppingTab,
  })
  setTimeout(() => {
    window.close() // Close the recording tab/window if needed
  }, 5000)
}

function restartRecording(stream) {
  // Clear previous chunks
  chunks = []

  // Reuse the same stream for the new MediaRecorder instance
  mediaRecorder = new MediaRecorder(stream)

  // Reassign the ondataavailable handler
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }
setTimeout(()=>{
  mediaRecorder.start()
},3000)
  // Start the new recording

  mediaRecorder.onstop = async function (e) {
    if (!isRestarting) {
      // Original stop logic
      handleRecordingStop(stream, chunks, videoStoppingTab)
    } else {
      // Restart logic
      restartRecording(stream)
    }
  }
  // Notify the background script to start the timer
  chrome.runtime.sendMessage({ action: 'startScreenRecordingTimer' })

  // Reset the restarting flag
  isRestarting = false
}
