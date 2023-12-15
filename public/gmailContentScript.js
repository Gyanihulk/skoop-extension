// Function to create and inject an iframe into the webpage
function injectIframe() {
  const existingContainer = document.getElementById('skoop-extension-container');
  if (existingContainer) {
      // Toggle visibility if container exists
      existingContainer.style.display = existingContainer.style.display === 'none' ? 'block' : 'none';
      return;
  }
  
  // Request camera and microphone permissions
  requestCameraAndMicrophonePermissions();
  
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
  closeButton.textContent = 'X';
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
    buttonContainer.style.zIndex = '9999';
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
  const classes = Array.from(allElements).map(el => el.className).filter(Boolean);
  return [...new Set(classes)]; // Return unique classes only
}
// Create the button when the page loads
createButton();

function getHostUrl() {
  const hostUrl = new URL(window.location.href).hostname;
  console.log("Sending ",hostUrl)
  return hostUrl;
}

function resizeIframe(newWidth, newHeight) {
  // Select the iframe element by ID
  console.log(`Resizing extesnion to ${newWidth},${newHeight}`)
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


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "collectClasses") {
    console.log("getting classes")
    const classes = collectClasses();
    const url=getHostUrl();
    sendResponse({ classes: classes ,url});
  }

  if (request.action === 'resizeIframe') {
    
    resizeIframe(request.width, request.height);
    sendResponse({ result: 'Iframe resized' });
  }

 
  return true; 
});
// MutationObserver to handle dynamic changes in the DOM
const observer = new MutationObserver(createButton);
observer.observe(document.body, { subtree: true, childList: true });
