function showScreenRecordingTimer(){
     // Create the overlay div
     const fontLink = document.createElement('link');
     fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap';
     fontLink.rel = 'stylesheet';
   
    // Append the font stylesheet to the head of the document
    document.head.appendChild(fontLink);

    fontLink.onload = () => {const overlay = document.createElement('div');
  overlay.id = 'countdown-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '10004';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.fontSize = '10em';
  overlay.style.color = 'white';

  // Append the overlay to the body
  document.body.appendChild(overlay);

  // Countdown logic
  let countdown = 3;
  overlay.textContent = countdown;

  const intervalId = setInterval(() => {
    countdown -= 1;
    overlay.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(intervalId);
      overlay.remove();
    }
  }, 1000);}
}