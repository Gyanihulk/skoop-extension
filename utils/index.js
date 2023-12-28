
export const replaceInvalidCharacters=(inputString)=>{
    // Define a regular expression to match invalid, reserved, and whitespace characters
    const invalidCharsRegex = /[^\w-]/g; // Matches non-alphanumeric and non-hyphen characters
  
    // Replace invalid characters and whitespace with underscores
    const replacedString = inputString.replace(invalidCharsRegex, '_');
  
    return replacedString;
}

export const insertIntoLinkedInMessageWindow=(html,selectedChatWindows)=>{
  console.log("inside insertinto linkedin in")
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
    }catch(err){
      console.log("error during insertion to chat",err);
    }
    
}

export const insertHtmlAtPositionInMail=(textInput) => {
    
    const executeInsertion=(text)=>{
        var element = document.querySelector("table > tbody > tr:nth-of-type(1) > td > div > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > div > table > tbody > tr > td:nth-of-type(2) > div:nth-of-type(2) > div");
        if(element==null){
            element=document.querySelector("div > table > tbody > tr > td:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-child(1)");
        }
        
        if(element==null){
        console.log("gmail compose mail window not found returning")
        return 
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
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const targetTab=tabs[0];
        console.log("the tab is targeted id ",targetTab.id);
        console.log("the selected tab",targetTab)
        if (targetTab && targetTab.status === 'complete') {
          console.log("the tab exists")
          try{
            chrome.scripting.executeScript({
              target : {tabId : targetTab.id},
              func: executeInsertion,
              args: [textInput]
            });
          }catch(err){
            console.log("some error occured in executing script")
          }
        }
        else{
          console.log("the target tab is not accessible");
        }
    });
}

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
  console.log("inside copy to clipboard procedure")

  const executeCopy=(data)=>{
    console.log("the data to copy inside executeCopy",data)
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