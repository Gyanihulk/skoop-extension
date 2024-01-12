import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';
import { handleCopyToClipboard } from '../../utils';
import { IoMdClose } from "react-icons/io";
import { toast} from 'react-hot-toast';

function AI(props) {
  const [selectedOption, setSelectedOption] = useState('Select Response');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [messageOptions, setMessageOptions] = useState([]);
  const [newResponse, setNewResponse] = useState({ heading: '', description: '' });

  const [showModal, setShowModal] = useState(false);

  const handleDropdownChange = (event) => {
    const value = event.target.value;

    if (value === 'AddEditResponses') {
      setShowModal(true);
      setSelectedOption('Select Response'); 
    } else {
      setShowModal(false);
      setSelectedOption(value);
      const selectedMessage = messageOptions.find((option) => option.heading === value);
      setSelectedDescription(selectedMessage?.description || '');
    }
  };

  const handleDescriptionEdit = (event) => {
    const value = event.target.value;
    setSelectedDescription(value);
  };

  const handleNewResponseChange = (field, value) => {
    setNewResponse((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveResponse = async () => {
    try {
      if (!newResponse.heading.trim() || !newResponse.description.trim()) {
        toast.error('Heading or Description cannot be blank.');
        return;
      }
      const response = await fetch(API_ENDPOINTS.skoopCrmAddPreloadedResponses, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
        body: JSON.stringify({
          heading: newResponse.heading,
          description: newResponse.description,
        }),
      });
  
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const responseData = await response.json();
          console.log('Response data:', responseData);
        }
  
        setMessageOptions((prevOptions) => [...prevOptions, newResponse]);
        setShowModal(false);
        toast.success('Response saved successfully!');
      } else {
        console.error('Failed to save response:', response.status, response.statusText);
        toast.error('Failed to save response. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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
  }, [showModal]); 
  
  useEffect(() => {
    setNewResponse({ heading: '', description: '' }); 
  }, [showModal]);
  

  return (
    <div className="form-group mx-auto dropDown">
      <select className="form-select" value={selectedOption} onChange={handleDropdownChange} size="sm">
        <option value="AddEditResponses" className='bold-text'>
          Add New Message Template
        </option>
        <option value="Select Response" disabled hidden>Select Message Template</option>
        {messageOptions.map((option) => (
          <option key={option.heading} value={option.heading}>
            {option.heading}
          </option>
        ))}
      </select>

      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-overlay modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Message Template</h5>
              <button type="button" className="custom-close-button" onClick={() => setShowModal(false)} aria-label="Close">
                <IoMdClose/>
              </button>
            </div>
            <div className="modal-body">
              <label className="mb-2 mt-2 text-center ">Title*</label>
              <input
                type="text"
                required
                className="form-control"
                value={newResponse.heading}
                onChange={(e) => handleNewResponseChange('heading', e.target.value)}
              />

              <label className="mb-2 mt-2 text-center">Description*</label>
              <textarea
                className="form-control"
                required
                aria-multiline="auto"
                value={newResponse.description}
                onChange={(e) => handleNewResponseChange('description', e.target.value)}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleSaveResponse}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

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
