
export const replaceInvalidCharacters=(inputString)=>{
    // Define a regular expression to match invalid, reserved, and whitespace characters
    const invalidCharsRegex = /[^\w-]/g; // Matches non-alphanumeric and non-hyphen characters
  
    // Replace invalid characters and whitespace with underscores
    const replacedString = inputString.replace(invalidCharsRegex, '_');
  
    return replacedString;
}

export const insertIntoLinkedInMessageWindow=(html)=>{

    var contentEditableDiv=document.getElementsByClassName("msg-form__contenteditable")[0];
   
    const placeHolder = document.getElementsByClassName('msg-form__placeholder')[0];
    if(placeHolder){
      placeHolder.remove();
    }

    if(contentEditableDiv){
      contentEditableDiv.removeAttribute('aria-label');
      contentEditableDiv.innerHTML=html
    }
    const dummyInput = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    contentEditableDiv.dispatchEvent(dummyInput);
}

export const insertHtmlAtPositionInMail=(text) => {
    var element=document.querySelector("table > tbody > tr:nth-child(1) > td > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div");
    if(element==null)
      element = document.querySelector('table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > div > div:nth-child(2) > div:nth-child(3) > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div > div:nth-child(1)');
    
    console.log("for insertion ",text)
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