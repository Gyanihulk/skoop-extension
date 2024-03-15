
chrome.storage.local.get("skoopCrmAccessToken", function(items) {
    if (items.skoopCrmAccessToken) {
      localStorage.setItem('skoopCrmAccessToken', JSON.stringify(items.skoopCrmAccessToken));
      
    }
});
  
import('https://fpjscdn.net/v3/DsKyYXvowdS8sg26bY0u') // Make sure to replace with your real public API key
  .then(FingerprintJS => FingerprintJS.load())
  .then(fp => fp.get())
  .then(result => {
    console.log(result,"test fingerprint")
    
  })
  .catch(e => {
    // Handle any errors in loading or executing the FingerprintJS agent
    console.error('Error loading FingerprintJS', e);
  });