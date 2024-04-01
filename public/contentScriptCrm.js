
chrome.storage.local.get("skoopCrmAccessToken", function(items) {
    if (items.skoopCrmAccessToken) {
      localStorage.setItem('skoopCrmAccessToken', JSON.stringify(items.skoopCrmAccessToken));
    }
});
  