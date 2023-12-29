import React, { useState,  useContext} from 'react';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import { AiOutlineFileGif } from 'react-icons/ai';
import { RiRobot2Line } from 'react-icons/ri';
import GiphyWindow from '../Gif/index.js';
import ChatGpt from '../Chatgpt/index.js';
import Library from '../Library/index.js';
import AI from '../Pre-Determined-Msg/index.js';
import API_ENDPOINTS from '../apiConfig.js';
import { insertIntoLinkedInMessageWindow } from '../../utils/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';

const ChatComponent = (props) => {
  const [message, setMessage] = useState('');
  const [option, setOption] = useState('null');
  const [targetPerson,setTargetPerson] = useState('');
 const {selectedChatWindows,isProfilePage}=useContext(GlobalStatesContext)
  const [messages, setMessages] = useState([
    { text: 'Hi there! Click on the message box to detect receiver', profilePicture: "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg", sender: 'receiver' },
  ]);

  const handleIconClick =(iconName) => {
    if (option === iconName) {
      setOption(null);
    } else {
    setOption(iconName);
    }
  };


  const handleSend = (data) => {
    
    var temp=data
    var tempText=temp.replace(/\n/g, '<br/>');
    setMessage(tempText);
  
    const newMessage = { text: temp.replace(/\n/g, '\n'), sender: 'me', profilePicture: "https://w7.pngwing.com/pngs/782/115/png-transparent-avatar-boy-man-avatar-vol-1-icon-thumbnail.png" };
    setMessages([...messages, newMessage]);
       
    insertIntoLinkedInMessageWindow(`<p>${tempText}</p>`,selectedChatWindows);

    const txtarea=document.getElementById('skoop_chat_input');
    txtarea.style.height='49px';
    setMessage('');

  };

  const appendToBody = (data) => {
    if (data.trim() !== '') {
      setMessage(data);
      handleSend(data);
    }
  };

  const handleOpenMessageWindow=()=>{
    const clickMessageButton=()=>{
      const btns=Array.from(document.querySelectorAll("div>div>div>button"))
      var selectedButton;
      btns.forEach(btn => {
        const ariaLabel=btn.ariaLabel
        if(ariaLabel!=null && ariaLabel.includes("Message")){
          selectedButton=btn;
        }
      })
      selectedButton.click();
    }
    
    try{
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const targetTab=tabs[0];
          if (targetTab) {
            try{
              chrome.scripting.executeScript({
                target : {tabId : targetTab.id},
                func: clickMessageButton
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
  }

  const chatContainerStyle = {
    minheight: 'calc(160vh - 500px)',
    width: '92%',
    backgroundSize: 'cover',
    margin: 0,
    border: 'none'
  };

 

  return (
    <div style={{textAlign: 'center', marginBottom: '10px'}}>
      <AI 
      appendToBody={appendToBody}/>
        <div className="card mx-auto" 
        style={chatContainerStyle} >
        <div className="card-footer bg-white position-relative w-100 bottom-0 m-0 p-1">
          
        
      {/* tabs start here */}
      <div style={{textAlign: 'center', marginTop: '8px', zIndex:'8000'}}>
      <ul class="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class={`nav-link ${option === 'ChatGpt' ? 'active' : ''}`}
            onClick={() => handleIconClick('ChatGpt')}
          >
            <RiRobot2Line 
            className='iconButtonStyle'
            data-mdb-toggle="tooltip"
            data-mdb-placement="bottom"
            title="Open a chat with an AI-powered assistant, ChatGPT. You can ask questions or seek assistance."/> Chatgpt
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class={`nav-link ${option === 'Giphy' ? 'active' : ''}`}
            onClick={() => handleIconClick('Giphy')}
          >
            <AiOutlineFileGif 
            className='iconButtonStyle'
            data-mdb-toggle="tooltip"
            data-mdb-placement="bottom"
            title="Search and insert GIFs into your messages to add a touch of fun and expressiveness to your conversations."/> Gif
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class={`nav-link ${option === 'Library' ? 'active' : ''}`}
            onClick={() => handleIconClick('Library')}
          >
            <MdOutlineVideoLibrary 
            className='iconButtonStyle' 
            data-mdb-toggle="tooltip"
            data-mdb-placement="bottom"
            title="Access your personal video library. You can find and manage your saved videos."/> Library
          </button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class={`tab-pane fade ${option === 'ChatGpt' ? 'show active' : ''}`} role="tabpanel">
          <ChatGpt appendToBody={appendToBody} />
        </div>
        <div class={`tab-pane fade ${option === 'Giphy' ? 'show active' : ''}`} role="tabpanel">
          <GiphyWindow appendToLinkedIn={appendToBody} />
        </div>
        <div class={`tab-pane fade ${option === 'Library' ? 'show active' : ''}`} role="tabpanel">
          <Library appendToMessage={appendToBody} />
        </div>
        <div class={`tab-pane fade ${option === 'prompts' ? 'show active' : ''}`} role="tabpanel">
          <AI appendToBody={appendToBody} />
        </div>
      </div>
      </div>
    </div>
    </div>
    <div class="d-grid gap-2">
      <button type="button" class="btn btn-outline-dark"
        onClick={() => appendToBody(`${API_ENDPOINTS.skoopCalendarUrl}/?username=${JSON.parse(localStorage.getItem('skoopUsername'))}`)} 
      >
        Insert meet link
      </button>
      {isProfilePage && 
          <div class="d-grid gap-2">
            <button class="btn btn-primary mt-3" type="button" onClick={handleOpenMessageWindow}>Message profile</button>
          </div>
      }
    </div>
    </div>
  );
};

export default ChatComponent;