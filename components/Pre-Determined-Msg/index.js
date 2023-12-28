import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';
import { handleCopyToClipboard } from '../../utils';

function AI(props) {
  const [selectedOption, setSelectedOption] = useState('Select Response');
  const [selectedDescription,setSelectedDescription] = useState("");
  const [message, setMessage] = useState('');
  const [messageOptions, setMessageOptions] = useState([]);

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    
    const selectedMessage = messageOptions.find((option) => option.heading === value);
    setSelectedDescription(selectedMessage.description);
    // if (selectedMessage) {
    //   setMessage(selectedMessage.description);
    //   props.appendToBody(selectedMessage.description);
    // } else {
    //   setMessage('');
    // }
  };

  const handleDescriptionEdit=(event)=>{
    const value = event.target.value;
    setSelectedDescription(value);
  }

  useEffect(() => {
    fetch(API_ENDPOINTS.CrmPreloadedResponses, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(data => setMessageOptions(data))
      .catch(error => console.error('Error:', error))
  }, []);

  return (
      <div
        className="form-group mx-auto dropDown"
        data-mdb-toggle="tooltip"
        data-mdb-placement="top"
        title="Dropdown for pre-determined custom responses to send directly on DM"
      >
        <select
          className="form-select"
          value={selectedOption}
          onChange={handleDropdownChange}
          size="sm"
        >
          <option value="Select Response">Select saved response</option>
          {messageOptions.map((option) => (
            <option key={option.heading} value={option.heading}>
              {option.heading}
            </option>
          ))}
        </select>
        {selectedOption!='Select Response' &&
        <>
          <div className="container">
            <div className="row">
              <div className="col-md-6 offset-md-3 mb-3">
              <label className="mb-2 text-center">Response</label>
                <textarea
                  className="form-control"
                  aria-multiline="auto"
                  value={selectedDescription}
                  onChange={handleDescriptionEdit}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
                <div className="row">
                  <div className="col-sm-7"></div>
                  <div className="col-sm-5 d-flex justify-content-end"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-primary chatgpt-button"
            onClick={()=>setSelectedOption("Select Response")}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-outline-primary chatgpt-button"
            onClick={()=>{handleCopyToClipboard(selectedDescription)}}
          >
            Copy
          </button>
          <button
            type="button"
            className="btn btn-outline-primary chatgpt-button"
            style={{ fontSize: '14px' }}
            onClick={() => {
              props.appendToBody(selectedDescription);
            }}
          >
            Insert
          </button>
        </div>
        </>
        }
      </div>
  );
}

export default AI;
