export function sendMessageToBackgroundScript(request, callback) {
    chrome.runtime.sendMessage(request, (response) => {
        if (callback && response) {
            callback(response);
        }
    });
}