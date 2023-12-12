const buttonId = 'myExtensionButton';

function createButton() {
    const existingButton = document.getElementById(buttonId);

    // If the button already exists, do nothing
    if (existingButton) {
        return;
    }
console.log("Adding button ")
    // Create the button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = buttonId;
    buttonContainer.className = 'extension-button'; 
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.width = '40px';
  buttonContainer.style.height = '40px';
  buttonContainer.style.borderRadius = '50%'; // Make it circular
  buttonContainer.style.backgroundColor = 'red'; 
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.cursor = 'pointer';

    // Create the button icon
    // const buttonIcon = document.createElement('img');
    // buttonIcon.src = chrome.extension.getURL('path/to/your/icon.png'); // Replace with the path to your icon
    // buttonIcon.style.width = '24px'; // Adjust the size as needed
    // buttonIcon.style.height = '24px'; // Adjust the size as needed
    // buttonContainer.appendChild(buttonIcon);

    // Add click event listener to the button
    buttonContainer.addEventListener('click', () => {
        chrome.runtime.sendMessage({ message: 'openPopup' });
    });

    // Inject the button container into the document body
    document.body.appendChild(buttonContainer);
}

// Create the button when the page loads
createButton();
// content.js

function injectNextJS() {
    const nextjsAssets = [
      'nextjs_assets/main.js',
      'nextjs_assets/commons.js',
      // Include other required assets
    ];
  
    nextjsAssets.forEach((asset) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(asset);
      document.head.appendChild(script);
    });
  
    // You may need additional logic to initialize and mount your Next.js app
  }
  
  // Wait for the document to be ready before injecting Next.js assets
  if (document.readyState === 'loading') {
    console.log("injecting dom")
    document.addEventListener('DOMContentLoaded', injectNextJS);
  } else {
    injectNextJS();
  }
  
// MutationObserver to handle dynamic changes in the DOM
const observer = new MutationObserver(createButton);
observer.observe(document.body, { subtree: true, childList: true });

