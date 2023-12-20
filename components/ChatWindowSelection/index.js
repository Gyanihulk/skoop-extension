import React, { useContext, useEffect, useState } from 'react';
import GlobalStatesContext from '../../contexts/GlobalStates';

const ChatWindowSelection = () => {

    const [initialItems,setInitialItems]=useState([]); 
    const {selectedChatWindows,setSelectedChatWindows} = useContext(GlobalStatesContext);
    const [localRefresh,setLocalRefresh]=useState(0);

    function checkForExistenceOfMessageWindow(element) {
        return element.querySelector('.msg-form__contenteditable')!=null
    }

    const setUpInitialArray=()=>{
        const allChatWindows = Array.from(document.getElementsByClassName('msg-convo-wrapper'));
        const validChatWindows=allChatWindows.filter(element=>checkForExistenceOfMessageWindow(element));
        var combinedArray=validChatWindows.map((item,index)=>{
            var nameOfRecipient;
            if(item.querySelector('h2').innerText=='New message'){
                nameOfRecipient=item.querySelector('.app-aware-link').innerText
            }
            else nameOfRecipient=item.querySelector('h2').innerText
            return {
                name: nameOfRecipient,
                index: index
            }
        })
        return Array.from(new Set(combinedArray.map(obj => obj.name)))
    .map(name => combinedArray.find(obj => obj.name === name));
    }

    useEffect(()=>{
        try{
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const targetTab=tabs[0];
                console.log("the target tab",targetTab);
                if (targetTab && targetTab.status === 'complete') {
                  console.log("the tab exists")
                  try{
                    chrome.scripting.executeScript({
                      target : {tabId : targetTab.id},
                      func: setUpInitialArray
                    }).then((response) => {
                        if (!chrome.runtime.lastError) {
                            var combinedArray = response[0].result;

                            setInitialItems(combinedArray);
                            const filteredArray = combinedArray.filter(item =>
                                selectedChatWindows.some(secondItem => secondItem.name === item.name)
                            );
                            setSelectedChatWindows(filteredArray);
                        } else {
                          console.error("Error retrieving combinedArray:", chrome.runtime.lastError);
                        }
                      });
                  }catch(err){
                    console.log("some error occured in executing script",err)
                  }
                }
                else{
                  console.log("the target tab is not accessible");
                }
            });
        }catch(err){
            console.log("some error occured while setting up initial array")
        }
    },[])

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        console.log("Checked:", checked);
        console.log("Value:", value);
        if (checked) {
            const selectedItem = initialItems.find(item => item.name === value);
            const newChatWindows=selectedChatWindows;
            newChatWindows.push(selectedItem);
            setSelectedChatWindows(newChatWindows);
        } else {
            const newChatWindows=selectedChatWindows.filter(item => item.name !== value);
            setSelectedChatWindows(newChatWindows);
        }
        console.log("the new selectedChatWindows",selectedChatWindows)
        setLocalRefresh(!localRefresh);
    };

    return (
        <div>
        {initialItems.map((item, index) => (
            <div key={index}>
            <label>
                <input
                type="checkbox"
                value={item.name}
                checked={selectedChatWindows.some(checkedItem => checkedItem.name === item.name)}
                onChange={handleCheckboxChange}
                />
                {item.name}
            </label>
            </div>
        ))}
        </div>
    );
};

export default ChatWindowSelection;
