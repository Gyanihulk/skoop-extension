import React, { useContext, useEffect, useState } from 'react';
import GlobalStatesContext from '../../contexts/GlobalStates';
import { insertIntoLinkedInMessageWindow } from '../../utils';
const ChatWindowSelection = () => {

    const [initialItems,setInitialItems]=useState([]); 
    const {selectedChatWindows,setSelectedChatWindows}=useContext(GlobalStatesContext);
    const [localRefresh,setLocalRefresh]=useState(0);
    const [mutationCount, setMutationCount] = useState(0);

    // useEffect(() => {
    //     const targetNode = document.body; // Or use the specific node you want to observe changes in

    //     const observer = new MutationObserver(() => {
    //         setMutationCount(prevCount => prevCount + 1);
    //     });

    //     observer.observe(targetNode, { childList: true, subtree: true });

    //     return () => {
    //     observer.disconnect();
    //     };
    // }, []);

    const setUpInitialArray=()=>{
        const recipients = Array.from(document.querySelectorAll('.msg-overlay-conversation-bubble-header--fade-in > div:nth-child(2)>h2>a>span'));
        const messageWindows = Array.from(document.getElementsByClassName("msg-form__contenteditable"));

        const combinedArray = recipients.map((recipient, index) => {
            return {
                name: recipient.innerText,
                index: index
            };
        });
       console.log("the combined array in setUpInitial array",combinedArray);
       return combinedArray;
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
                    }).then(async (response) => {
                        if (!chrome.runtime.lastError) {
                            var combinedArray = response[0].result;
                            console.log("Received combinedArray:", combinedArray);
                        
                            setInitialItems(combinedArray);
                            const filteredArray = combinedArray.filter(item =>
                                selectedChatWindows.some(secondItem => secondItem.name === item.name)
                            );
                            console.log("the filtered array")
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
        <button onClick={insertIntoLinkedInMessageWindow("<p>test</p>")}>add to window</button>
        </div>
    );
};

export default ChatWindowSelection;
