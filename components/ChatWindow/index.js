import React, { useState, useRef ,useEffect, useContext} from 'react';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import { FiMoreVertical } from "react-icons/fi";
import { AiOutlineFileGif } from 'react-icons/ai';
import { MdCalendarMonth } from 'react-icons/md';
import { RiRobot2Line } from 'react-icons/ri';
import GiphyWindow from '../Gif/index.js';
import ChatGpt from '../Chatgpt/index.js';
import Library from '../Library/index.js';
import AI from '../Pre-Determined-Msg/index.js';
import {RiSendPlaneFill} from 'react-icons/ri'
import { MdVideoChat } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import API_ENDPOINTS from '../apiConfig.js';
import { MdOutlineGifBox } from "react-icons/md";
import { RiVideoFill } from "react-icons/ri";
import { IoCalendar } from "react-icons/io5";
import { insertIntoLinkedInMessageWindow } from '../../utils/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';

const ChatComponent = (props) => {
  const [message, setMessage] = useState('');
  const [option, setOption] = useState('null');
  const [targetPerson,setTargetPerson] = useState('');
 const {selectedChatWindows}=useContext(GlobalStatesContext)
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

  useEffect(()=>{
    const txtarea=document.getElementById('skoop_chat_input')
    txtarea.addEventListener('input',(e)=>{
      handleInputChange(e)
      try{
        const otherPerson=document.querySelector('aside:nth-child(1) > div:nth-child(2) > div:nth-child(1) > header > div:nth-child(3) > div:nth-child(2) > h2 > a > span').innerText
        setTargetPerson(otherPerson);
        const imgTag=document.querySelector('header > div:nth-child(3) > div:nth-child(1) > div > img')
        if(imgTag){
          document.getElementById('skoop_chat_img').src=imgTag.src
        }
        try{
          const otherPerson=document.querySelector('aside:nth-child(1) > div:nth-child(2) > div:nth-child(1) > header > div:nth-child(3) > div:nth-child(2) > h2 > a > span').innerText
    
          const persons=Array.from(document.getElementsByClassName('msg-s-message-group__profile-link'));
      
          const personsArray=persons.map(item=>{
            const aStr=item.innerText.trim();
            const bStr=otherPerson.trim();
            console.log(aStr," ",aStr.length," ",bStr," ",bStr.length)
            if(aStr==bStr){
              return 'receiver'
            } 
            else{
              return 'me'
            }
          })
      
          const messages=document.getElementsByClassName('msg-s-event-listitem__body')
          const text=Array.from(messages).map(element => element.innerText);
          const conversation = personsArray.map((element, index) => {
            if (element == 'me')
              return {text: `${text[index]}`,sender: `${element}`, profilePicture: "https://w7.pngwing.com/pngs/782/115/png-transparent-avatar-boy-man-avatar-vol-1-icon-thumbnail.png"};
            else
              return {text: `${text[index]}`,sender: `${element}`, profilePicture: "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"  };
          });
          setMessages(conversation)
          console.log("the scraped conversation",conversation)
        }catch(err){
          console.log("could not load the chat history into the skoop chat window")
        }
      }catch(err){
        console.log("No target user found for sending message through skoop")
      }
    })
  },[])

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

  const getAutomatedReply=async()=>{
    setMessage("Loading.....")
    const txtarea=document.getElementById('skoop_chat_input');
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    txtarea.dispatchEvent(event);
    try{
      const otherPerson=document.querySelector('aside:nth-child(1) > div:nth-child(2) > div:nth-child(1) > header > div:nth-child(3) > div:nth-child(2) > h2 > a > span').innerText
    
      const persons=Array.from(document.getElementsByClassName('msg-s-message-group__profile-link'));
      
      const personsArray=persons.map(item=>{
        if(item.innerText==otherPerson) return item.innerText 
        else return "Person2"
      })
      
      const messages=document.getElementsByClassName('msg-s-event-listitem__body')
      const text=Array.from(messages).map(element => element.innerText);
      const conversation = personsArray.map((element, index) => {
        return `${element}: ${text[index]}`;
      });
      
      const query = "write a suitable next message based on this coversation on behalf of person2  , the conversation:-  "+conversation.join(',')
      console.log("the query",query)
      const choices = await fetch(API_ENDPOINTS.cgpt + new URLSearchParams({ input: query }), {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      });
      const response = await choices.json();
      var responseString=response.choices[0].message.content
      responseString=responseString.replace(/Person2:/g, '')
      responseString=responseString.replace(/Person1:/g, '')
      const lineCount = (responseString.match(/\n/g) || []).length + 1;
      const lineHeight = 14; 
      const newHeight = lineHeight * lineCount;
      
      txtarea.style.height=`${newHeight}px`;
      setMessage(responseString)
    }catch(err){
      txtarea.placeholder="some error occured"
      setMessage('')
    }
  }

  const chatContainerStyle = {
    minheight: 'calc(160vh - 500px)',
    width: '92%',
    //background: '#edf4fa',
    //backgroundImage: 'url(https://static.wixstatic.com/media/577866_8f28dee3ace64cf1a376778812a8754a~mv2.jpg/v1/fill/w_587,h_1001,al_c,q_85,enc_auto/577866_8f28dee3ace64cf1a376778812a8754a~mv2.jpg)',
    backgroundSize: 'cover',
    margin: 0,
    borderRadius: '12px', 
  };

  const cardBodyStyle = {
    flex: 1,
    overflow: 'auto',
    padding: 0
  };


  const iconButtonStyle = {
    color: '#0a66c2',
  };

  const chatMessageStyle = {
    fontSize: '14px', 
  };

  const [fabButtonsVisible, setFabButtonsVisible] = useState(false);

const toggleFabButtons = () => {
  setFabButtonsVisible(!fabButtonsVisible);
};

const textareaRef = useRef(null);

const handleInputChange = (e) => {
  setMessage(e.target.value);

  // Adjust textarea height
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }

  // Reset height when value is empty
  if (e.target.value === '') {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }
};


  const appendText = (text) => {
    setMessage((prevMessage) => prevMessage + text);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const categorizeText=(text)=>{
    if(text==undefined || text.includes("giphy")) return 1
    if(text.includes("play")) return 2
    if(text.includes("/schedule")) return 3
    return -1
  }

  function makeLinksClickable(text) {

    var urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank" style="color: white;">' + url + '</a>';
    });
  }

  return (
    <div style={{textAlign: 'center', marginBottom: '10px'}}>
      <AI 
      appendToBody={appendToBody}/>
        <div className="card mx-auto" 
        style={chatContainerStyle} >
          {/*<div className="card-header bg-transparent">
            <div className="navbar navbar-expand p-0">
              <ul className="navbar-nav me-auto align-items-center">
                <li className="nav-item">
                  <a href="#!" className="nav-link">
                    <div
                      className="position-relative"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '3px solid #e84118',
                        padding: '2px',
                      }}
                    >
                      <img
                        src="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
                        className="img-fluid rounded-circle"
                        alt=""
                        id="skoop_chat_img"
                      />
                      <span
                        className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                      >
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                <a className="nav-link Section-heading">
                  {targetPerson}
                </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="card-body p-4" 
          style={{...cardBodyStyle, maxHeight: '300px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.sender == 'me' ? 'text-end' : 'text-start'}`}
              >
              {msg.sender=='me' &&
              <div className= "d-flex justify-content-end">
                <div className="card card-text d-inline-block p-2 px-2 m-1 chat-msg" style={{borderRadius: '5px',maxWidth: '92%',background: '#0a66c2' , color: 'white'}}>
                  <div>
                  <div dangerouslySetInnerHTML={{ __html: makeLinksClickable(msg.text) }} />
                  </div>
                     {(() => {
                    switch (categorizeText(msg.text)) {
                      case 1:
                        return (
                          <div style={{ borderTop: '1px solid #ccc', margin: '5px 0' }}>
                          <div className="card card-text d-inline-block chat-msg linkpreviewcard">
                            <div class="linkpreviewtext">
                              <MdOutlineGifBox style={{ marginRight: '8px' }} />
                              GIF
                            </div>
                          </div>
                          </div>
                        );
                      case 2:
                        return (
                          <div style={{ borderTop: '1px solid #ccc', margin: '5px 0', marginBottom:"4px" }}>
                          <div className="card card-text d-inline-block chat-msg linkpreviewcard">
                            <div class="linkpreviewtext">
                              <RiVideoFill style={{ marginRight: '8px' }} />
                              Video
                            </div>
                            </div>
                          </div>
                        );
                      case 3:
                        return (
                          <div style={{ borderTop: '1px solid #ccc', margin: '5px 0', marginBottom:"4px" }}>
                          <div className="card card-text d-inline-block chat-msg linkpreviewcard">
                            <div class="linkpreviewtext">
                              <IoCalendar style={{ marginRight: '8px' }} />
                              Calendar
                            </div>
                            </div>
                          </div>
                        );
                      default:
                        return null; 
                    }
                  })()}
                  </div>
                  <img
                    src={msg.profilePicture}
                    alt="Sender Profile"
                    style={{ width: '40px', height: '40px', borderRadius: '50%'}}
                  />
                </div>
              }
              {msg.sender=='receiver' &&
                <div className="d-flex">
                  <img
                    src={msg.profilePicture}
                    alt="Sender Profile"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '5px' }}
                  />
                <div className="card card-text d-inline-block p-2 px-2 m-1 chat-msg" style={{borderRadius: '5px',maxWidth: '92%',background: '#EA4335',color: 'white'}}>
                  <div>
                  <div dangerouslySetInnerHTML={{ __html: makeLinksClickable(msg.text) }} />
                  </div>  
                  <div style={{ marginTop: '5px' }}>
                  {(() => {
                    switch (categorizeText(msg.text)) {
                      case 1:
                        return (
                          <div className="card card-text d-inline-block chat-msg linkpreviewcard">
                            <div class="linkpreviewtext">
                              <MdOutlineGifBox style={{ marginRight: '8px' }} />
                              GIF
                            </div>
                          </div>
                        );
                      case 2:
                        return (
                          <div className="card card-text d-inline-block chat-msg linkpreviewcard">
                            <div class="linkpreviewtext">
                              <RiVideoFill style={{ marginRight: '8px' }} />
                              Video
                            </div>
                          </div>
                        );
                      case 3:
                        return (
                          <div className="card card-text d-inline-block chat-msg linkpreviewcard">
                            <div class="linkpreviewtext">
                              <IoCalendar style={{ marginRight: '8px' }} />
                              Calendar
                            </div>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })()}
                  </div>
                </div>
                </div>
              }  
              </div>
            ))}
            </div> */}

          <div className="card-footer bg-white position-relative w-100 bottom-0 m-0 p-1">
          <div className="input-group">
          <textarea
              ref={textareaRef}
              className="form-control"
              id="skoop_chat_input"
              variant="outline-primary"
              placeholder="Write a message..."
              value={message}
              onChange={handleInputChange}
              style={{
                resize: 'none',
                fontSize: '14px',
                border: 'none',
                borderRadius: '14px',
                marginLeft: '8px',
              }}
              rows={1}
            />
            <div className="input-group-text bg-transparent border-0">
            <button
              className="btn btn-light"
              onClick={()=>handleSend(message)}
              style={{ ...iconButtonStyle, fontSize: '16px' }}
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              title="Send the message directly to DM"
            >
              <RiSendPlaneFill style={iconButtonStyle} />
            </button>
            <button
              className="btn btn-light"  
              onClick={() => appendToBody(`${API_ENDPOINTS.skoopCalendarUrl}/?username=${JSON.parse(localStorage.getItem('skoopUsername'))}`)}
              data-mdb-toggle="tooltip" 
              data-mdb-placement="bottom" 
              title="Send your Meeting Calendar Link to Chat"
              >
             <MdCalendarMonth style={iconButtonStyle} /> 
             </button>

          {fabButtonsVisible && (
            <div className="fab-buttons">
              <button
                className="btn btn-light"
                onClick={() => {
                  setMessage(message + props.latestVideo);
                  toggleFabButtons();
                }}
                data-mdb-toggle="tooltip"
                data-mdb-placement="top"
                title="Append the link of the last uploaded video"
              >
                <MdVideoChat style={iconButtonStyle} />
              </button>
              <button
                className="btn btn-light"
                onClick={() => {
                  getAutomatedReply();
                  toggleFabButtons();
                }}
                data-mdb-toggle="tooltip"
                data-mdb-placement="top"
                title="Automate message based on conversation"
              >
                <BsRobot style={iconButtonStyle} />
              </button>
            </div>
          )}
          </div>
        </div>
        
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
        {/*<li class="nav-item" role="presentation">
          <button
            class={`nav-link ${option === 'AI' ? 'active' : ''}`}
            onClick={() => handleIconClick('AI')}
          >
            Prompts
          </button>
      </li>*/}
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
    </div>
  );
};

export default ChatComponent;
