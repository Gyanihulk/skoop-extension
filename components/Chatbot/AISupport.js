import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { IoIosCloseCircleOutline } from "react-icons/io";


const Chatbot = () => {
  const [userName, setUserName] = useState('');
  const [chatbotOpen, setChatbotOpen] = useState(true);

  const handleClose = () => {
    setChatbotOpen(false);
  };

  const handleOpen = () => {
    setChatbotOpen(true);
  };

  const chatbotStyle = {
    position: 'fixed',
    top: '70px',
    right: '25px', 
    zIndex: '1000', 
    float: 'right', 
    clear: 'both', 
  };

  const customTheme = {
    fontFamily: 'Arial',
    headerBgColor: '#1976d2', 
    headerFontColor: '#FFFFFF',
    botBubbleColor: '#2979ff', 
    botFontColor: '#333',
    userBubbleColor: '#2979ff', 
    userFontColor: '#333',
  };

  const LinkComponent = ({ triggerNextStep }) => (
    <div>
      You can Record Audio & video for 60 sec & send it on DM.{' '}
      <a href="https://appfoster.com" target="_blank" rel="noopener noreferrer" onClick={triggerNextStep} style={{color:"#FFFFFF", textDecoration: "underline" }}>
        Click here
      </a>{' '}
      to watch the demo how it works.
    </div>
  );

  const ChatComponent = ({ triggerNextStep }) => (
    <div>
      When you'are on any linkedin Profile page, you can access the DM and send videos/audio, Chatgpt responses, GIFs and meeting link.{' '}
      <a href="https://appfoster.com" target="_blank" rel="noopener noreferrer" onClick={triggerNextStep} style={{color:"#FFFFFF", textDecoration: "underline" }} >
        Click here
      </a>{' '}
      to watch the demo how it works.
    </div>
  );

  const ContactComponent = ({ triggerNextStep }) => (
    <div>
      When you'are on any linkedin Profile page, You can scrape the contact details of profile and save it to your CRM{' '}
      <a href="https://appfoster.com" target="_blank" rel="noopener noreferrer" onClick={triggerNextStep} style={{color:"#FFFFFF", textDecoration: "underline" }}>
        Click here
      </a>{' '}
      to watch the demo how it works.
    </div>
  );

  const steps = [
    {
      id: 'Greet',
      message: 'Welcome to Skoop! Please enter your name!',
      trigger: 'GetUserName',
    },
    {
      id: 'GetUserName',
      user: true,
      trigger: 'GreetUser',
      validator: (value) => {
        if (!value || value.trim() === '') {
          return 'Please enter a valid name.';
        }
        setUserName(value);
        return true;
      },
    },
    {
      id: 'GreetUser',
      message: `Hi ${userName}, how may I help you?`,
      trigger: 'MainMenu',
    },
    {
      id: 'MainMenu',
      options: [
        {
          value: 'NavIcons',
          label: 'NavIcons',
          trigger: 'NavIcons',
        },
        {
          value: 'Components',
          label: 'Components',
          trigger: 'Components',
        },
        {
          value: 'BackToStart',
          label: 'Back to Start',
          trigger: 'GreetUser',
        },
      ],
    },
    {
      id: 'NavIcons',
      options: [
        { value: 'logout', label: 'Log out', trigger: 'Icon1Details' },
        { value: 'blacklist', label: 'Blacklist Profile', trigger: 'Icon2Details' },
        { value: 'videostyle', label: 'Video Style', trigger: 'Icon3Details' },
        { value: 'calendar', label: 'Meeting Calendar', trigger: 'Icon4Details' },
        { value: 'Accountsettings', label: 'Account Settings', trigger: 'Icon5Details' },
        { value: 'Exportdata', label: 'Export CSV', trigger: 'Icon6Details' },
        { value: 'Notifications', label: 'Notifications', trigger: 'Icon7Details' },
        { value: 'BackToStart', label: 'Back to Start', trigger: 'MainMenu' },
      ],
    },
    {
      id: 'Icon1Details',
      message: 'The "Log Out" icon allows you to sign out of your Extension account, it would terminate your current session, requiring you to log in again to access Skoop.',
      trigger: 'NavIcons',
    },

    {
      id: 'Icon2Details',
      message: 'The "Blacklist Profile" icon allow you to block or restrict interaction with a specific LinkedIn user profile. Once you blacklist a profile, you may not receive notifications or updates from that user. ',
      trigger: 'NavIcons',
    },

    {
      id: 'Icon3Details',
      message: 'The Video Style feature empowers users to personalize the aspect ratio of their recorded videos. Simply click on the "Video Style" icon to access and adjust the aspect ratio settings before recording your video content.',
      trigger: 'NavIcons',
    },

    {
      id: 'Icon4Details',
      message: 'The Meeting Calendar icon streamlines your scheduling and planning tasks. With this, you can effortlessly organize and manage your professional meetings. Schedule meetings, set reminders, and coordinate with your connections efficiently. ',
      trigger: 'NavIcons',
    },

    {
      id: 'Icon5Details',
      message: 'Click on the Account Settings icon to change your password, update your profile details.',
      trigger: 'NavIcons',
    },

    {
      id: 'Icon6Details',
      message: 'The Export CSV feature empowers users to extract and download data of the User profile in  CSV format. Click on the Export CSV icon to generate a downloadable file containing relevant data, such as contacts, messages, or other selected information. ',
      trigger: 'NavIcons',
    },

    {
      id: 'Icon7Details',
      message: 'Click on the Notifications icon to access a summary of recent activities, keeping you in the loop and allowing you to respond promptly to new opportunities and interactions. Receive real-time updates about new connection requests, messages, profile views, and other important info and offers from skoop, ',
      trigger: 'NavIcons',
    },

    {
      id: 'Components',
      options: [
        { value: 'RecordingVideoAudio', label: 'Recording Video/Audio', trigger: 'RecordingVideoAudioDetails' },
        { value: 'ChatWindow', label: 'Chat Window', trigger: 'ChatWindowDetails' },
        { value: 'ContactInfo', label: 'Contact Info', trigger: 'ContactInfoCardDetails' },
        { value: 'BackToStart', label: 'Back to Start', trigger: 'MainMenu' },
      ],
    },
    {
      id: 'RecordingVideoAudioDetails',
      component: <LinkComponent />,
      asMessage: true,
      trigger: 'Components',
    },

    {
      id: 'ChatWindowDetails',
      component: <ChatComponent />,
      asMessage: true,
      trigger: 'Components',
    },

    {
      id: 'ContactInfoCardDetails',
      component: <ContactComponent />,
      asMessage: true,
      trigger: 'Components',
    },
  ];

  return (
    chatbotOpen && (
    <div style={chatbotStyle} className="segment">
      <style>
        {`
          
          .rsc-container {
            font-family: Arial;
          }

          .rsc-header {
            background-color: ${customTheme.headerBgColor}; 
            color: ${customTheme.headerFontColor}; 
          }

          .rsc-header-title {
            color: white; 
          }

          .rsc-header-close {
            position: absolute;
            top: 0;
            right: 0;
            padding: 10px;
            cursor: pointer;
            font-size: 20px; 
            color: #FFFFFF;
          }

          .rsc-message {
            background-color: ${customTheme.botBubbleColor}; 
            color: ${customTheme.botFontColor}; 
          }

          .rsc-user {
            background-color: ${customTheme.userBubbleColor};
            color: ${customTheme.userFontColor}; 
          }
        `}
      </style>
      <ChatBot
        steps={steps}
        headerTitle={
          <>
            Skoop Support Bot 
            <span className="rsc-header-close" onClick={handleClose}>
            <IoIosCloseCircleOutline style={{color:"white"}}/>
            </span>
          </>
        }
        speechSynthesis={{ enable: true, lang: 'en' }}
        style={{ ...customTheme }}
      />
    </div>
    )
  );
};

export default Chatbot;
