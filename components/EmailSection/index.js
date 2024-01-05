import React, { useContext, useState } from 'react';
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
import GlobalStatesContext from '../../contexts/GlobalStates.js';

const EmailComposer = () => {
  const [state, setState] = useState({
    displayComp: 'DefaultCard'
  });

  const { focusedElementId } = useContext(GlobalStatesContext)
  const handleInsertion = (text) => {
    insertHtmlAtPositionInMail(text, focusedElementId);
  };

  const componentDisplaySwitch = (input) => {
    setState({
      ...state,
      displayComp: input
    });
  };

  const openCalendar = () => {
    handleInsertion(`<a href="${API_ENDPOINTS.skoopCalendarUrl}/?username=${JSON.parse(localStorage.getItem('skoopUsername'))}">schedule a meet</a>`);
  };

  const handleIconClick = (eventKey) => {
    if (eventKey === 'Calendar') {
      openCalendar();
      return;
    }
    componentDisplaySwitch(eventKey);
  };

  const renderNavItem = (eventKey, icon, tooltipText) => (
    <li className="nav-item" key={eventKey}>
      <a
        className={`nav-link ${state.displayComp === eventKey ? 'active' : ''}`}
        onClick={() => handleIconClick(eventKey)}
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title={tooltipText}
      >
        {React.cloneElement(icon, { size: 20 })}
        <span className="d-none d-sm-inline">{tooltipText}</span>
      </a>
    </li>
  );

  return (
    <div>
      <div className="d-grid gap-2 col-10 mx-auto mt-4">
        <button
          className="btn btn-primary btn-block"
          onClick={openCalendar}
        >
          Schedule a Meet
        </button>
      </div>

      <ul className="nav nav-pills justify-content-center mt-2">
        {renderNavItem('Chatgpt', <AiFillRobot />, 'Send Chatgpt responses to Mail')}
        {renderNavItem('Giphy', <HiMiniGif />, 'Send your favorite GIFs to Mail')}
        {renderNavItem('AI', <RiMessage2Fill />, 'Send predetermined custom message responses.')}
        {renderNavItem('Library', <MdVideoLibrary />, 'Send any recorded video or audio file')}
      </ul>

      <div className="container w-90 mt-4">
        {state.displayComp === 'Chatgpt' && <ChatGpt appendToBody={handleInsertion} />}
        {state.displayComp === 'Giphy' && <GiphyWindow appendToBody={handleInsertion} />}
        {state.displayComp === 'Library' && <Library appendToBody={handleInsertion} />}
        {state.displayComp === 'AI' && <AI appendToBody={handleInsertion} />}

        {state.displayComp === 'DefaultCard' && (
          <div className="card">
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
