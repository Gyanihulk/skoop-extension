
// Function to create and inject an iframe into the webpage
function injectIframe() {
  // Check if the iframe already exists
  const existingIframe = document.getElementById('my-extension-iframe');
  if (existingIframe) {
    // Toggle visibility if iframe exists
    existingIframe.style.display = existingIframe.style.display === 'none' ? 'block' : 'none';
    return;
  }

  // Request camera and microphone permissions
  requestCameraAndMicrophonePermissions();

  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'skoop-extension-iframe';
  iframe.src = `chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/index.html`;
  iframe.style.border = 'none';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.right = '0';
  iframe.style.width = '400px'; 
  iframe.style.height = '100%'; 
  iframe.style.zIndex = '10000'; 
  iframe.style.display = 'block'; 


  const closeButton = document.createElement('div');
  closeButton.id = 'extension-close-button';
  closeButton.className = 'extension-close-button';
  closeButton.style.position = 'fixed';
  closeButton.style.top = '10px';
  closeButton.style.left = '10px';
  closeButton.style.width = '40px';
  closeButton.style.height = '40px';
  closeButton.style.backgroundColor = 'red';
  closeButton.addEventListener('click', function close(){
    document.getElementById('skoop-extension-iframe').style.display = 'none';
  });


  iframe.appendChild(closeButton);
  // Append the iframe to the body of the document
  document.body.appendChild(iframe);
}

function requestCameraAndMicrophonePermissions() {
  // Use the modern navigator.mediaDevices.getUserMedia if available
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1280, height: 720 } })
          .then((stream) => {
              console.log('Camera and microphone access granted');

          })
          .catch((err) => {
              console.error(`The following error occurred: ${err.name}`);
              // Handle the error here (e.g., show a message to the user)
          });
  } else {
      console.log("getUserMedia not supported");
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
  
    console.log("Adding Extension button");
  
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
    buttonContainer.style.backgroundImage = 'url("' + chrome.runtime.getURL('/icons/icon.png') + '")'; 
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
  
  // Create the button when the page loads
  createButton();
  
  // MutationObserver to handle dynamic changes in the DOM
  const observer = new MutationObserver(createButton);
  observer.observe(document.body, { subtree: true, childList: true });