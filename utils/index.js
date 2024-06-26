import { useContext } from 'react'
import toast from 'react-hot-toast'
export const replaceInvalidCharacters = (inputString) => {
  // Define a regular expression to match invalid, reserved, and whitespace characters
  const invalidCharsRegex = /[^\w-]/g // Matches non-alphanumeric and non-hyphen characters

  // Replace invalid characters and whitespace with underscores
  const replacedString = inputString.replace(invalidCharsRegex, '_')

  return replacedString
}

export const insertIntoLinkedInMessageWindow = async (html, selectedChatWindows, postCommentSelected = false, postCommentElement = null) => {
  const executeInsertionIntoWindow = (arr, htmlToInsert, postCommentSelected = false, postCommentElement = null) => {
    setTimeout(() => {
      if (postCommentSelected && postCommentElement && postCommentElement?.className) {
        const postId = postCommentElement.postId
        const classNames = Object.values(postCommentElement.className)
        let commentElement
        let postElement
        if (postCommentElement?.identifierType && postId) {
          postElement = document.querySelector(`[${postCommentElement.identifierType}="${postId}"]`)
          if (postElement) {
            commentElement = postElement.querySelector(`.${classNames[0]}`)
          } else {
            console.error('Post element not found')
          }
        } else {
          commentElement = document.querySelector(`.${classNames[0]}`)
        }
        if (postCommentElement && postCommentElement.postId && postCommentElement.postId.startsWith('urn:li:comment')) {
          commentElement.innerHTML += htmlToInsert
        } else {
          commentElement.innerHTML = htmlToInsert
        }
        setTimeout(() => {
          let button = postElement.querySelector('.comments-comment-box__submit-button')
          if (button) {
            setTimeout(() => {
              button.click()
            }, 5000)
          } else {
            console.error('Button not found')
          }
        }, 500)
        if (postCommentElement && postCommentElement.postId && postCommentElement.postId.startsWith('urn:li:comment')) {
          commentElement.innerHTML += htmlToInsert
        } else {
          commentElement.innerHTML = htmlToInsert
        }
      }
      const fullMessageWindows = Array.from(document.getElementsByClassName('msg-convo-wrapper'))

      // Map over the fullMessageWindows to create a lookup for names and their corresponding contenteditable element and send button
      const nameToElementsMap = fullMessageWindows.reduce((acc, convoWrapper) => {
        const h2Element = convoWrapper.querySelector('h2')
        const nameFromH2 = h2Element ? h2Element.textContent.replace(/\s+/g, ' ').trim() : ''
        const spanInsideButton = convoWrapper.querySelector('.artdeco-pill__text')

        const nameFromSpan = spanInsideButton ? spanInsideButton.textContent.replace(/\s+/g, ' ').trim() : ''
        const contentEditableDiv = convoWrapper.querySelector('.msg-form__contenteditable')
        const sendButton = convoWrapper.querySelector('.msg-form__send-button')

        const sendButton1 = convoWrapper.querySelector('.msg-form__send-btn')
        const name = nameFromSpan || nameFromH2
        if (name && contentEditableDiv) {
          acc[name] = {
            contentEditableDiv,
            sendButton: sendButton ? sendButton : sendButton1,
          }
        }

        return acc
      }, {})

      arr.forEach((item) => {
        const elements = nameToElementsMap[item.name]
        if (elements) {
          const { contentEditableDiv, sendButton } = elements
          contentEditableDiv.removeAttribute('aria-label')
          const messageHtml = `<p>${htmlToInsert}</p>`
          contentEditableDiv.innerHTML = htmlToInsert
          const dummyInput = new Event('input', {
            bubbles: true,
            cancelable: true,
          })
          contentEditableDiv.dispatchEvent(dummyInput)
          if (sendButton) {
            // If send button is available, click it after a timeout
            setTimeout(() => {
              sendButton.click()
            }, 1000)
          } else {
            contentEditableDiv.focus()

            // Wait a moment for the text event to be processed
            setTimeout(() => {
              // Now create and dispatch the Enter key event
              const enterKeyEvent = new KeyboardEvent('keydown', {
                code: 'Enter',
                key: 'Enter',
                charCode: 13,
                keyCode: 13,
                view: window,
                bubbles: true,
              })
              contentEditableDiv.dispatchEvent(enterKeyEvent)
            }, 500)
          }
        }
      })
    }, 600)
  }

  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const targetTab = tabs[0]
      if (targetTab && targetTab.status === 'complete') {
        try {
          chrome.scripting.executeScript({
            target: { tabId: targetTab.id },
            func: executeInsertionIntoWindow,
            args: [selectedChatWindows, html, postCommentSelected, postCommentElement],
          })
        } catch (err) {
          console.error('some error occured in executing script', err)
        }
      }
    })
    return true
  } catch (err) {
    console.error('error during insertion to chat', err)
  }
  return
}

export const insertHtmlAtPositionInMail = (textInput, elementId) => {
  return new Promise((resolve, reject) => {
    const executeInsertion = (text, Id) => {
      var element = document.getElementById(Id)

      if (element == null) {
        return false
      }
      text = text.replace(/\n/g, '\n')
      const lines = text.split('\n')
      element.focus()
      const html = lines.map((line) => `${line}`).join('<br>')
      var sel, range
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0)
          range.deleteContents()

          if (element.tagName.toUpperCase() === 'INPUT') {
            element.value = html
            return true
          }

          var el = document.createElement('div')
          el.innerHTML = html
          var frag = document.createDocumentFragment(),
            node,
            lastNode
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node)
          }
          var firstNode = frag.firstChild
          range.insertNode(frag)

          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange()
            range.setStartAfter(lastNode)
            range.setStartBefore(firstNode)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
      } else if ((sel = document.selection) && sel.type != 'Control') {
        // IE < 9
        var originalRange = sel.createRange()
        originalRange.collapse(true)
        sel.createRange().pasteHTML(html)
        range = sel.createRange()
        range.setEndPoint('StartToStart', originalRange)
        range.select()
      }
      return true
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const targetTab = tabs[0]
      if (targetTab && targetTab.status === 'complete') {
        try {
          chrome.scripting.executeScript(
            {
              target: { tabId: targetTab.id },
              func: executeInsertion,
              args: [textInput, elementId],
            },
            (injectionResults) => {
              if (!injectionResults[0]?.result) {
                toast.error('Cursor not on the mail window')
                reject(new Error('Cursor not on the mail window'))
              } else {
                toast.success('Message added to cursor location.')
                resolve(injectionResults[0]?.result)
              }
            }
          )
        } catch (err) {
          console.error('some error occurred in executing script')
          reject(err)
        }
      } else {
        reject(new Error('The target tab is not accessible'))
      }
    })
  })
}
export function getCurrentDateTimeString() {
  const now = new Date()

  const day = now.getDate().toString().padStart(2, '0')
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const year = now.getFullYear()

  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')

  const dateString = `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`
  return dateString
}

export const handleCopyToClipboard = (dataToCopy) => {
  const executeCopy = (data) => {
    navigator.clipboard.writeText(data)
  }

  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const targetTab = tabs[0]
      if (targetTab) {
        try {
          chrome.scripting.executeScript({
            target: { tabId: targetTab.id },
            func: executeCopy,
            args: [dataToCopy],
          })
        } catch (err) {
          console.error('some error occured in executing script', err)
        }
      }
    })
    return true
  } catch (err) {
    console.error('some error occured while setting up initial array')
    return false
  }
}
