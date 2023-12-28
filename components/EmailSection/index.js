import React, { useState } from 'react';
import { AiFillRobot } from "react-icons/ai";
import { HiMiniGif } from "react-icons/hi2";
import { RiMessage2Fill } from "react-icons/ri";
import { PiCalendarCheckFill } from "react-icons/pi";
import { MdVideoLibrary } from "react-icons/md";
import ChatGpt from '../Chatgpt/index.js';
import GiphyWindow from '../Gif/index.js';
import Library from '../Library/index.js';
import AI from '../Pre-Determined-Msg/index.js';
import API_ENDPOINTS from '../apiConfig.js';
import { insertHtmlAtPositionInMail } from '../../utils/index.js';

const EmailComposer = () => {
  const [state, setState] = useState({
    displayComp: 'DefaultCard'
  });


  const handleInsertion = (text) => {
    insertHtmlAtPositionInMail(text);
  };

  const componentDisplaySwitch = (input) => {
    setState({
      ...state,
      displayComp: input
    });
  };

  const openCalender = () => {
    handleInsertion(`<a href="${API_ENDPOINTS.skoopCalendarUrl}/?username=${JSON.parse(localStorage.getItem('skoopUsername'))}">schedule a meet</a>`);
  };

  const handleIconClick = (eventKey) => {
    if (eventKey === 'Calendar') {
      openCalender();
      return;
    }
    componentDisplaySwitch(eventKey);
  };

  const renderNavItem = (eventKey, icon, tooltipText) => (
    <div className="nav flex-column" role="tablist">
      <a
        className={`nav-link custom-nav-link d-flex align-items-center justify-content-center ${state.displayComp === eventKey ? 'active' : ''} mb-3`}
        onClick={() => handleIconClick(eventKey)}
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title={tooltipText}
      >
        {React.cloneElement(icon, { size: 30 })}
      </a>
    </div>
  );

  return (
    <div className="custom-container">
      <div className="custom-sidebar">
        <div className="nav flex-column" role="tablist" aria-orientation="vertical">
          {renderNavItem('Chatgpt', <AiFillRobot />, 'Send Chatgpt responses to Mail')}
          {renderNavItem('Giphy', <HiMiniGif />, 'Send your favorite GIFs to Mail')}
          {renderNavItem('AI', <RiMessage2Fill />, 'Send predetermined custom message responses.')}
          {renderNavItem('Calendar', <PiCalendarCheckFill />, 'Send Meeting scheduling calendar link')}
          {renderNavItem('Library', <MdVideoLibrary />, 'Send any recorded video or audio file')}
        </div>
      </div>
      <div className="custom-gap"></div>
      <div className="custom-componentbar">
        {state.displayComp === 'Chatgpt' && <ChatGpt appendToBody={handleInsertion} />}
        {state.displayComp === 'Giphy' && <GiphyWindow appendToBody={handleInsertion} />}
        {state.displayComp === 'Library' && <Library appendToBody={handleInsertion} />}
        {state.displayComp === 'AI' && <AI appendToBody={handleInsertion} />}

        {state.displayComp === 'DefaultCard' && (
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title text-center">Welcome to Skoop</h5>
              <p className="card-text text-center">
                This is your default view. You can switch between different tabs on the left to explore various features.
                <br />
                Explore the features and make the most out of your Email Sending experience!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailComposer;
