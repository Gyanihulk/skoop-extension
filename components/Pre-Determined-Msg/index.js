import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';

function AI(props) {
  const [selectedOption, setSelectedOption] = useState('Select Response');
  const [message, setMessage] = useState('');
  const [messageOptions, setMessageOptions] = useState([]);

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    const selectedMessage = messageOptions.find((option) => option.heading === value);

    if (selectedMessage) {
      setMessage(selectedMessage.description);
      props.appendToBody(selectedMessage.description);
    } else {
      setMessage('');
    }
  };

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
          <option value="Select Response">Select Response</option>
          {messageOptions.map((option) => (
            <option key={option.heading} value={option.heading}>
              {option.heading}
            </option>
          ))}
        </select>
      </div>
  );
}

export default AI;
