chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    let senderTabId
    if (sender && sender.tab && sender.tab.id) {
      senderTabId = sender.tab.id
    }
    if (
      request.action === 'startRecording' ||
      request.action === 'stopRecording' ||
      request.action === 'restartRecording'
    ) {
      // Relay message to the active tab
      chrome.tabs.query({}, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'
        // Find the tab with either the Google Mail URL or the LinkedIn URL
        const targetTab = tabs.find(
          (tab) =>
            tab.active &&
            (tab.url.startsWith(urlToFindGoogle) ||
              tab.url.startsWith(urlToFindLinkedIn))
        )
        if (targetTab) {
          chrome.tabs.sendMessage(targetTab.id, request, (response) => {
            if (response) {
              sendResponse(response)
            }
            return true
          })
        }
        return true
      })
    }
    if (request.action === 'storeToken' && request.token) {
      chrome.storage.local.set(
        { skoopCrmAccessToken: request.token },
        function () {
          console.info('Token stored in extension local storage.')
        }
      )
    }
    if (request.message === 'ChatPage') {
      chrome.tabs.query({}, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        // Find the tab with either the Google Mail URL or the LinkedIn URL
        const targetTab = tabs.find(
          (tab) =>
            tab.active &&
            (tab.url.startsWith(urlToFindGoogle) ||
              tab.url.startsWith(urlToFindLinkedIn))
        )

        if (targetTab) {
          chrome.tabs.sendMessage(
            targetTab.id,
            { action: 'collectClasses' },
            (response) => {
              if (response) {
                chrome.tabs.sendMessage(senderTabId, {
                  action: 'returnClasses',
                  response,
                })
                sendResponse(response)
              }
            }
          )
          chrome.tabs.sendMessage(
            targetTab.id,
            {
              action: 'resizeIframe',
              width: request.width ? request.width : '150px',
              height: request.height ? request.height : '600px',
            },
            (response) => {
              if (response) {
              } else {
                console.error(
                  'Error resizing iframe:',
                  chrome.runtime.lastError
                )
              }
            }
          )
        }
      })
    }

    if (request.message === 'ContactPage') {
      chrome.tabs.query({}, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        // Find the tab with either the Google Mail URL or the LinkedIn URL
        const targetTab = tabs.find(
          (tab) =>
            tab.active &&
            (tab.url.startsWith(urlToFindGoogle) ||
              tab.url.startsWith(urlToFindLinkedIn))
        )

        if (targetTab) {
          chrome.tabs.sendMessage(
            targetTab.id,
            { action: 'collectClasses' },
            (response) => {
              if (response) {
                chrome.tabs.sendMessage(senderTabId, {
                  action: 'returnClasses',
                  response,
                })
                sendResponse(response)
              }
            }
          )
          chrome.tabs.sendMessage(
            targetTab.id,
            {
              action: 'resizeIframe',
              width: request.width ? request.width : '150px',
              height: request.height ? request.height : '600px',
            },
            (response) => {
              if (response) {
              } else {
                console.error(
                  'Error resizing iframe:',
                  chrome.runtime.lastError
                )
              }
            }
          )
        }
      })
    }
    if (request.message === 'Welcome') {
      chrome.tabs.query({}, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        // Find the tab with either the Google Mail URL or the LinkedIn URL
        const targetTab = tabs.find(
          (tab) =>
            tab.active &&
            (tab.url.startsWith(urlToFindGoogle) ||
              tab.url.startsWith(urlToFindLinkedIn))
        )

        if (targetTab) {
          chrome.tabs.sendMessage(
            targetTab.id,
            {
              action: 'resizeIframe',
              width: request.width ? request.width : '375px',
              height: request.height ? request.height : '812px',
            },
            (response) => {
              if (!response) {
                console.error(
                  'Error resizing iframe:',
                  chrome.runtime.lastError
                )
              }
            }
          )
        }
      })
    }
    if (request.action === 'startPlayingVideo') {
      chrome.tabs.query({}, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        // Find the tab with either the Google Mail URL or the LinkedIn URL
        const targetTab = tabs.find(
          (tab) =>
            tab.active &&
            (tab.url.startsWith(urlToFindGoogle) ||
              tab.url.startsWith(urlToFindLinkedIn))
        )

        if (targetTab) {
          chrome.tabs.sendMessage(
            targetTab.id,
            {
              action: 'startPlayingVideo',
              width: request.width ? request.width : '589',
              height: request.height ? request.height : '322',
              src: request.src ? request.src : '',
            },
            (response) => {
              if (!response) {
                console.error(
                  'Error resizing iframe:',
                  chrome.runtime.lastError
                )
              }
            }
          )
        }
      })
    }
    if (request.message === 'resizeIframe') {
      chrome.tabs.query({}, (tabs) => {
        const urlToFindGoogle = 'https://mail.google.com/mail'
        const urlToFindLinkedIn = 'https://www.linkedin.com/'

        // Find the tab with either the Google Mail URL or the LinkedIn URL
        const targetTab = tabs.find(
          (tab) =>
            tab.active &&
            (tab.url.startsWith(urlToFindGoogle) ||
              tab.url.startsWith(urlToFindLinkedIn))
        )

        if (targetTab) {
          chrome.tabs.sendMessage(
            targetTab.id,
            {
              action: 'resizeIframe',
              width: request.width ? request.width : '375px',
              height: request.height ? request.height : '812px',
            },
            (response) => {
              if (!response) {
                console.error(
                  'Error resizing iframe:',
                  chrome.runtime.lastError
                )
              }
            }
          )
        }
      })
    }
  } catch (err) {
    console.error(err, 'backgeound error')
  }
  if (request.message === "resizeIframe") {
    chrome.tabs.query({}, (tabs) => {
      const urlToFindGoogle = "https://mail.google.com/mail";
      const urlToFindLinkedIn = "https://www.linkedin.com/";

      // Find the tab with either the Google Mail URL or the LinkedIn URL
      const targetTab = tabs.find(
        (tab) =>
          tab.active &&
          (tab.url.startsWith(urlToFindGoogle) ||
            tab.url.startsWith(urlToFindLinkedIn))
      );

      if (targetTab) {
        chrome.tabs.sendMessage(
          targetTab.id,
          {
            action: "resizeIframe",
            width: request.width ? request.width : "375px",
            height: request.height ? request.height : "812px",
          },
          (response) => {
            if (!response) {
              console.error("Error resizing iframe:", chrome.runtime.lastError);
            }
          }
        );
      }
    });
  }
  if(request.message === "initializeExtensionDimension") {
    chrome.tabs.query({}, (tabs) => {
      const urlToFindGoogle = "https://mail.google.com/mail";
      const urlToFindLinkedIn = "https://www.linkedin.com/";

      // Find the tab with either the Google Mail URL or the LinkedIn URL
      const targetTab = tabs.find(
        (tab) =>
          tab.active &&
          (tab.url.startsWith(urlToFindGoogle) ||
            tab.url.startsWith(urlToFindLinkedIn))
      );

      if (targetTab) {
        chrome.tabs.sendMessage(
          targetTab.id,
          {
            action: "initializeExtensionDimension",
          },
          (response) => {
            if (!response) {
              console.error("Error while initializing extension dimension:", chrome.runtime.lastError);
            }
          }
        );
      }
    });
  }
  return true;
});