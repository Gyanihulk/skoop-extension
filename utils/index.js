import { useContext } from "react";
import toast from "react-hot-toast";
export const replaceInvalidCharacters=(inputString)=>{
    // Define a regular expression to match invalid, reserved, and whitespace characters
    const invalidCharsRegex = /[^\w-]/g; // Matches non-alphanumeric and non-hyphen characters
  
    // Replace invalid characters and whitespace with underscores
    const replacedString = inputString.replace(invalidCharsRegex, '_');
  
    return replacedString;
}

export const insertIntoLinkedInMessageWindow=async (html,selectedChatWindows)=>{
  
      const executeInsertionIntoWindow=(arr,htmlToInsert)=>{
      const messageWindows = Array.from(document.getElementsByClassName("msg-form__contenteditable"));
      arr.forEach(item=>{
        const contentEditableDiv=messageWindows[item.index];
        contentEditableDiv.removeAttribute('aria-label');
        contentEditableDiv.innerHTML=htmlToInsert;
        const dummyInput = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        contentEditableDiv.dispatchEvent(dummyInput);
      })
      
    }

    try{
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const targetTab=tabs[0];
        console.log("the target tab",targetTab);
        if (targetTab && targetTab.status === 'complete') {
          console.log("the tab exists")
          try{
            chrome.scripting.executeScript({
              target : {tabId : targetTab.id},
              func: executeInsertionIntoWindow,
              args: [selectedChatWindows,html]
            })
          }catch(err){
            console.log("some error occured in executing script",err)
          }
        }
        else{
          console.log("the target tab is not accessible");
        }
      });
      return true
    }catch(err){
      console.log("error during insertion to chat",err);
    }
    return
}

export const insertHtmlAtPositionInMail= (textInput, elementId) => {
  console.log(elementId);
  return new Promise((resolve, reject) => {

    const executeInsertion=(text,Id)=>{
        var element = document.getElementById(Id)
        
        if(element==null){
          return false
        }
        text=text.replace(/\n/g, '\n')
        const lines = text.split('\n')
        element.focus()
        const html=lines.map(line => `${line}`).join('<br>')
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                if(element.tagName.toUpperCase() === 'INPUT'){
                  element.value = html;
                  return true;
                }
    
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);
                
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.setStartBefore(firstNode);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ( (sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
   return true
    }

    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const targetTab = tabs[0];
      if (targetTab && targetTab.status === 'complete') {
        try {
          chrome.scripting.executeScript({
            target: { tabId: targetTab.id },
            func: executeInsertion,
            args: [textInput, elementId]
          }, (injectionResults) => {
            if (!injectionResults[0]?.result) {
              toast.error("Cursor not on the mail window", {
                className: "custom-toast",
              });
              reject(new Error("Cursor not on the mail window"));
            } else {
              toast.success("Message added to cursor location.", {
                className: "custom-toast",
              });
              resolve(injectionResults[0]?.result);
            }
          });
        } catch (err) {
          console.log("some error occurred in executing script");
          reject(err);
        }
      } else {
        console.log("the target tab is not accessible");
        reject(new Error("The target tab is not accessible"));
      }
    });
  });
};
export function getCurrentDateTimeString() {
    const now = new Date();
  
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
  
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const dateString = `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;
    return dateString;
}

export const handleCopyToClipboard=(dataToCopy)=>{
  

  const executeCopy=(data)=>{
    navigator.clipboard.writeText(data);
  }

  try{
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const targetTab=tabs[0];
        if (targetTab) {
          try{
            chrome.scripting.executeScript({
              target : {tabId : targetTab.id},
              func: executeCopy,
              args: [dataToCopy]
            });
          }catch(err){
            console.log("some error occured in executing script",err)
          }
        }
        else{
          console.log("the target tab is not accessible");
        }
    });
    return true;
  }catch(err){
    console.log("some error occured while setting up initial array")
    return false;
  }
}