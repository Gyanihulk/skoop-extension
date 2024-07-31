// This function will request the media stream based on the provided streamId
function getMediaStreamFromStreamId(streamId) {
  const constraints = {
    audio: false, 
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: streamId
      }
    }
  };

  return navigator.mediaDevices.getUserMedia(constraints);
}


function fadeIn(element) {
  element.style.opacity = 0; // Set initial opacity to 0
  element.style.display = 'block'; // Make the element visible

  let start = performance.now(); // Timestamp of when the animation starts

  const duration = 2000; // Total duration of the fade-in in milliseconds

  let tick = function(now) {
    // Calculate the current time elapsed since the start of the animation
    let timeElapsed = now - start;

    // Calculate the current opacity based on the time elapsed and the desired duration
    element.style.opacity = Math.min(timeElapsed / duration, 1);

    if (timeElapsed < duration) {
      // Continue the animation as long as the time elapsed is less than the duration
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick); // Start the animation
}
