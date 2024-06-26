export function sendMessageToBackgroundScript(request, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
        if (callback && response) {
          callback(response)
        }
      })
    }
  })
}
