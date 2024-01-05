import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';
import { handleCopyToClipboard } from '../../utils';

function AI(props) {
  const [selectedOption, setSelectedOption] = useState('Select Response');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [messageOptions, setMessageOptions] = useState([]);

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    const selectedMessage = messageOptions.find((option) => option.heading === value);
    setSelectedDescription(selectedMessage?.description || '');
  };

  const handleDescriptionEdit = (event) => {
    const value = event.target.value;
    setSelectedDescription(value);
  };

  const redirectToEditPage = () => {
    window.open('https://skoopcrm.sumits.in/authentication/sign-in/cover', '_blank');
  };

  useEffect(() => {
    fetch(API_ENDPOINTS.CrmPreloadedResponses, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((data) => setMessageOptions(data))
      .catch((error) => console.error('Error:', error));
  }, []);

return (
  <div className="form-group mx-auto dropDown" data-mdb-toggle="tooltip" data-mdb-placement="top" title="Dropdown for pre-determined custom responses to send directly on DM">
  <select className="form-select" value={selectedOption} onChange={handleDropdownChange} size="sm">
    <option value="AddEditResponses" style={{ fontWeight: 'bold' }}>Add or edit responses</option>
    <option value="Select Response">Select Template Message</option>
    {messageOptions.map((option) => (
      <option key={option.heading} value={option.heading}>
        {option.heading}
      </option>
    ))}
  </select>
  {selectedOption === 'AddEditResponses' && redirectToEditPage()}
    {selectedOption !== 'Select Response' && (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 mb-3">
            <label className="mb-2 mt-2 text-center">Response</label>
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
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end mt-2">
        <div className="btn-group" role="group" aria-label="Button Group">
          <button
            type="button"
            className="btn btn-sm btn-dark"
            onClick={() => setSelectedOption('Select Response')}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => {
              handleCopyToClipboard(selectedDescription);
            }}
          >
            Copy
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => {
              props.appendToBody(selectedDescription);
            }}
          >
            Insert
          </button>
        </div>
      </div>
    </>
  )}
</div>
);
}

export default AI;
