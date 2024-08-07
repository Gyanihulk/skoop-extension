function injectIframe() {
  const existingContainer = document.getElementById('skoop-extension-container')
  if (existingContainer) {
    // Toggle visibility if container exists
    existingContainer.style.display = existingContainer.style.display === 'none' ? 'block' : 'none'
    return
  }
  // Create the container
  const container = document.createElement('div')
  container.id = 'skoop-extension-container'
  container.style.display = 'none'
  const extensionDimension = localStorage.getItem('skoopExtensionDimension')
  if (extensionDimension) {
    const { width, height } = JSON.parse(extensionDimension)
    container.style.width = width + 'px'
    container.style.height = height + 'px'
  }

  container.ondragstart = function () {
    return false
  }

  // Create the iframe
  const iframe = document.createElement('iframe')
  iframe.id = 'skoop-extension-iframe'
  iframe.src = `chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/index.html`
  iframe.setAttribute('allow', 'camera;microphone')
  iframe.style.border = 'none'
  iframe.style.width = '100%'
  iframe.style.height = '100%' // Height when expanded
  iframe.style.borderRadius = '10px'

  const dragButton = document.createElement('div');
  dragButton.id = 'skoop-drag-button';
  dragButton.style.left = '10px';
  dragButton.style.top = '10px';
  dragButton.style.width = '170px';
  dragButton.style.height = '25px';
  dragButton.style.position = 'absolute';
  dragButton.style.cursor = 'pointer';
  dragButton.title = 'Click and Drag To Move';
  const dragButtonIcon = document.createElement('div');
  dragButtonIcon.style.width = '25px';
  dragButtonIcon.style.height = '25px';
  dragButtonIcon.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/move.png') + '")';
  dragButtonIcon.style.backgroundSize = 'cover';
  dragButton.appendChild(dragButtonIcon)
  dragButton.style.backgroundColor = 'rgba(65, 65, 65, 0.2)';
  dragButton.style.borderRadius = '4px';
  // Drag functionality
  let isDragging = false;
  let dragStartX, dragStartY;

  const dragStart = (e) => {
    if (e.buttons !== 1) return;
    disableTextSelection();
    isDragging = true;
    dragStartX = e.clientX - container.offsetLeft;
    dragStartY = e.clientY - container.offsetTop;
    document.addEventListener('pointermove', dragMove);
    document.addEventListener('pointerup', dragEnd);
    document.addEventListener('pointerleave', dragEnd); 
  };

  const dragMove = (e) => {
    if (e.buttons !== 1) {
      dragEnd(); // Call dragEnd to stop dragging
      return; // Exit the function to prevent further dragging
    }
    if (isDragging) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      let newX = e.clientX - dragStartX;
      let newY = e.clientY - dragStartY;

      newX = Math.max(newX, 0);
      newY = Math.max(newY, 0);
      newX = Math.min(newX, viewportWidth - containerWidth);
      newY = Math.min(newY, viewportHeight - containerHeight);

      container.style.left = `${newX}px`;
      container.style.top = `${newY}px`;
    }
  };

  const dragEnd = () => {
    isDragging = false;
    enableTextSelection();
    document.removeEventListener('pointermove', dragMove);
    document.removeEventListener('pointerup', dragEnd);
    document.removeEventListener('pointerleave', dragEnd); 
    chrome.storage.sync.get('recordingType', function(result) {
      if (result.recordingType) {
        let positionKey;
        
        // Determine which position key to use based on the recording type
        if (result.recordingType === 'screen') {
          positionKey = 'screenCamera';
        } else if (result.recordingType === 'candid') {
          positionKey = 'candidCamera';
        }
    
        // If a valid position key was found, save the position
        if (positionKey) {
          const position = { left: container.style.left, top: container.style.top };
    

          const storageObject = {};
          storageObject[positionKey] = position;
    
          chrome.storage.sync.set(storageObject, () => {
            console.log(`${positionKey} saved:`, position);
          });
        }
      } else {
        console.log('No recordingType found.');
      }
    });
    chrome.storage.sync.set({ 'containerPosition': { left: container.style.left, top: container.style.top } });
    // Save the position to Chrome storage for persistence
  };

  dragButton.addEventListener('pointerdown', dragStart);

  // Create minimize/expand button
  const toggleButton = document.createElement('button')
  toggleButton.id = 'skoop-expand-minimize-button'
  toggleButton.style.display = 'none'

  // The height when the container is minimized
  toggleButton.onclick = function () {
    let isMinimized = container.style.height == '44px';
    const resizer = document.getElementById('skoop-resizer-buttom')
    if (isMinimized) {
      resizer.style.display = 'block'
      const extensionDimension = localStorage.getItem('skoopExtensionDimension')
      if (extensionDimension) {
        const { width, height } = JSON.parse(extensionDimension)
        container.style.width = width + 'px'
        container.style.height = height + 'px'
      } else {
        container.style.height = '98vh'
      }
    } else {
      container.style.height = '44px'
      resizer.style.display = 'none'
    }
    isMinimized = !isMinimized
  }

  container.appendChild(dragButton)
  container.appendChild(toggleButton)
  container.appendChild(iframe)

  const minWidth = 355
  const maxWidth = 355
  const minHeight = 550
  const resizer = document.createElement('div')

  resizer.id = 'skoop-resizer-buttom'
  resizer.style.width = '20px'
  resizer.style.height = '20px'
  resizer.style.position = 'absolute'
  resizer.style.bottom = '3px'
  resizer.style.right = '3px'
  resizer.style.cursor = 'se-resize'
  resizer.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/resize.png') + '")'
  resizer.style.backgroundSize = 'cover'
  resizer.style.backgroundRepeat = 'no-repeat'
  resizer.style.backgroundPosition = 'center'
  resizer.style.transform = 'rotate(-90deg)'

  resizer.addEventListener('pointerdown', initResize, false)

  function disableTextSelection() {
    document.body.style.userSelect = 'none' // for most browsers
    document.body.style.webkitUserSelect = 'none' // for Safari and Chrome
    document.body.style.MozUserSelect = 'none' // for Firefox
    document.body.style.msUserSelect = 'none' // for IE and Edge
  }

  function enableTextSelection() {
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
    document.body.style.MozUserSelect = ''
    document.body.style.msUserSelect = ''
  }

  function initResize(e) {
    disableTextSelection()
    // Set pointer capture to ensure all pointer events go to the resizer
    resizer.setPointerCapture(e.pointerId)
    window.addEventListener('pointermove', resize, false)
    window.addEventListener('pointerup', stopResize, false)
    window.addEventListener('pointerleave', stopResize, false) // Handle pointer leaving the window
  }

  function resize(e) {
    const dimensions = container.getBoundingClientRect()
    let newWidth = e.clientX - dimensions.left
    let newHeight = e.clientY - dimensions.top
    const maxHeight = window.innerHeight * 0.98
    // Constrain newWidth and newHeight within min/max bounds
    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight))

    // update the container's size
    localStorage.setItem('skoopExtensionDimension', JSON.stringify({ width: newWidth, height: newHeight }))

    container.style.width = newWidth + 'px'
    container.style.height = newHeight + 'px'
    if (!resizer.contains(e.target)) {
      stopResize(e)
    }
  }

  function stopResize(e) {
    enableTextSelection()
    // Release pointer capture
    if (resizer.releasePointerCapture) {
      resizer.releasePointerCapture(e.pointerId)
    }
    window.removeEventListener('pointermove', resize, false)
    window.removeEventListener('pointerup', stopResize, false)
    window.removeEventListener('pointerleave', stopResize, false) // Clean up this listener as well
  }
  // Append the container to the body of the document

  const expandButton = document.createElement('button')
  expandButton.id = 'skoop-expand-button'
  expandButton.style.display = 'none'
  // Expand button functionality
  expandButton.onclick = function () {
    resizer.style.display = 'block' // Show the resizer if it should be visible when expanded

    // Retrieve the last known dimensions from local storage or set default dimensions
    const extensionDimension = localStorage.getItem('skoopExtensionDimension')
    if (extensionDimension) {
      const { width, height } = JSON.parse(extensionDimension)
      container.style.minWidth = width + 'px'
      container.style.width = width + 'px'
      container.style.height = height + 'px'
    } else {
      container.style.height = '78vh'
    }
  }



  // Create the scale down div without setting an initial background image
  var scaleDownDiv = document.createElement('div');
  scaleDownDiv.id = 'container-scale-down';
  scaleDownDiv.style.height = '20px';
  scaleDownDiv.style.width = '20px';
  scaleDownDiv.style.position = 'absolute';
  scaleDownDiv.style.bottom = '10px';
  scaleDownDiv.style.right = '30px';
  scaleDownDiv.style.zIndex = '10002';
  scaleDownDiv.style.backgroundSize = '20px 20px';
  scaleDownDiv.style.cursor = 'pointer'; // To indicate the div is clickable
  scaleDownDiv.style.display = 'none';
  // Define the onclick event handler
  scaleDownDiv.onclick = function () {
    // Toggle the scale of the container between 50% and 100%
    if (container.classList.contains('scaled-down')) {
      container.style.transform = 'scale(1)';
      container.classList.remove('scaled-down');
      // Save the state as not scaled down
      chrome.storage.sync.set({ isScaledDown: false });
      // Change the div's background to the 'maximize' icon
      scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/minimize.png') + '")';
    } else {
      container.style.transform = 'scale(0.5)';
      container.classList.add('scaled-down');
      // Save the state as scaled down
      chrome.storage.sync.set({ isScaledDown: true });
      // Change the div's background to the 'minimize' icon
      scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/maximize.png') + '")';
    }
  };

  // Append the scale down button to the container
  container.appendChild(scaleDownDiv)

  container.appendChild(expandButton)
  container.appendChild(resizer)
  document.body.appendChild(container)
}

function applySavedScaleState() {
  chrome.storage.sync.get(['isScaledDown'], function (result) {
    const container = document.getElementById('skoop-extension-container')
    const scaleDownDiv = document.getElementById('container-scale-down')
    if (result.isScaledDown) {
      container.style.transform = 'scale(0.5)';
      container.classList.add('scaled-down');
      scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/maximize.png') + '")';
    } else {
      container.style.transform = 'scale(1)';
      container.classList.remove('scaled-down');
      scaleDownDiv.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/minimize.png') + '")';
    }
  });
}
function changeContainerPosition(left, top) {
  const container = document.getElementById('skoop-extension-container');

  // Function to set vertical position by percentage
  function setVerticalPositionByPercentage(topPercentage) {
    // Calculate the top value based on the percentage of the viewport height
    const viewportHeight = window.innerHeight;
    const containerHeight = container.offsetHeight;
    const centeredTop = (viewportHeight - containerHeight) * (parseFloat(topPercentage) / 100);
    console.log(centeredTop)
    container.style.top = `${centeredTop}px`;
  }
  
  // Center the container if both left and top are '50%'
  if (left === '50%' && top === '50%') {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const centeredLeft = (viewportWidth - containerWidth) / 2;
    const centeredTop = (viewportHeight - containerHeight) / 2;
    
    container.style.left = `${centeredLeft}px`;
    container.style.top = `${centeredTop}px`;
  } else {
    // Set the left position directly (this can be in pixels or any other valid CSS unit)
    container.style.left = left;
    
    // If top is a percentage, calculate the vertical position accordingly
    if (top.endsWith('%')) {
      setVerticalPositionByPercentage(top);
    } else {
      // If top is not a percentage, set the position directly
      container.style.bottom = top;
    }
  }
}

function saveContainerPosition() {
  const container = document.getElementById('skoop-extension-container');
  const left = container.style.left;
  const top = container.style.top;

  // Save the position to Chrome storage
  chrome.storage.sync.set({ 'lastExtensionPositionBeforeRecording': { left: left, top: top } }, function() {
    console.log('Container position has been saved:', { left: left, top: top });
  });
}

function moveContainerToLastSavedPosition() {
  chrome.storage.sync.get('lastExtensionPositionBeforeRecording', function(result) {
    const container = document.getElementById('skoop-extension-container');
    if (result.lastExtensionPositionBeforeRecording) {
      // Apply the saved position
      container.style.left = result.lastExtensionPositionBeforeRecording.left;
      container.style.top = result.lastExtensionPositionBeforeRecording.top;
    } else {
      console.log('No saved container position found. Keeping current position or setting default.');
    }
  });
}

function moveCameraToStoredPosition(request) {
  chrome.storage.sync.get('recordingType', function(result) {
    if (result.recordingType) {
      let positionKey;
      
      // Determine which position key to use based on the recording type
      if (result.recordingType === 'screen') {
        positionKey = 'screenCamera';
      } else if (result.recordingType === 'candid') {
        positionKey = 'candidCamera';
      }

  
      
      // If a valid position key was found, get the position
      if (positionKey) {
        chrome.storage.sync.get(positionKey, function(positionResult) {
          if (positionResult[positionKey]) {
            const { left, top } = positionResult[positionKey];
    
            // Move the camera to the stored position
            moveCamera(left, top);
          } else {

            changeContainerPosition(request.left, request.top);
          }
        });
      }
    } else {
      console.log('No recordingType found.');
    }
  });
}

function moveCamera(left, top) {
  const container = document.getElementById('skoop-extension-container');
  if (container) {

    
    // Explicitly set the position using setProperty
    container.style.setProperty('left', left, 'important');
    container.style.setProperty('top', top, 'important');

    
    // Force a repaint and reflow
    container.offsetHeight;
    
    // Check the actual position using getBoundingClientRect
    const rect = container.getBoundingClientRect();

    
    // Log computed styles for additional debugging
    const computedStyles = window.getComputedStyle(container);
  } else {
    console.log("Container not found");
  }
}