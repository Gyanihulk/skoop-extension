import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';
import { handleCopyToClipboard } from '../../utils';
import { IoMdClose } from "react-icons/io";
import { toast} from 'react-hot-toast';
import { GrFormEdit } from "react-icons/gr";
import { RiDeleteBin3Fill } from "react-icons/ri";

function AI(props) {
  const [selectedOption, setSelectedOption] = useState('Select Response');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [messageOptions, setMessageOptions] = useState([]);
  const [newResponse, setNewResponse] = useState({ heading: '', description: '' });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingResponse, setEditingResponse] = useState(null);

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    if (value === 'AddEditResponses') {
      setSelectedOption('Select Response');
      setShowModal(true); 
      setIsEdit(false);
      setEditingResponse(null);
    } else {
      setSelectedOption(value);
      const selectedMessage = messageOptions.find((option) => option.heading === value);
      if (selectedMessage) {
        setSelectedDescription(selectedMessage.description || '');
        props.appendToBody(selectedMessage.description);
      } else {
        setSelectedDescription('');
      }
    }
  };

  const handleEditIconClick = (option) => {
    if (option && option.heading && option.description) {
      setEditingResponse(option);
      setNewResponse({ heading: option.heading, description: option.description });
      setIsEdit(true);
      setShowModal(true);
    } else {
      console.error('Invalid option data for edit:', option);
    }
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

      let response;

      if (isEdit && editingResponse) {
        response = await fetch(API_ENDPOINTS.replaceCrmPreloaded, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          },
          body: JSON.stringify({
            heading: newResponse.heading,
            description: newResponse.description,
            id: editingResponse.id,
          }),
        });
      } else {
        response = await fetch(API_ENDPOINTS.skoopCrmAddPreloadedResponses, {
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
      }

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const responseData = await response.json();
        }

        if (isEdit && editingResponse) {
          setMessageOptions((prevOptions) => prevOptions.map((option) => (option.id === editingResponse.id ? newResponse : option)));
        } else {
          setMessageOptions((prevOptions) => [...prevOptions, newResponse]);
        }

        setNewResponse({ heading: '', description: '' });
        setShowModal(false);
        setIsEdit(false);
        setEditingResponse(null);

        toast.success('Response saved successfully!');
      } else {
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
      .then((data) => {
        setMessageOptions(data);
      })
      .catch((error) => console.error('Error:', error));
  }, [showModal]);
  
  
  useEffect(() => {
    if (editingResponse !== null) {
      setNewResponse({ heading: editingResponse.heading, description: editingResponse.description });
      setShowModal(true);
    } else {
      setNewResponse({ heading: '', description: '' });
      setShowModal(false);
    }
  }, [editingResponse, isEdit]);
  

  const handleDeleteResponse = async () => {
    try {
      if (!editingResponse || !editingResponse.id) {
        toast.error('Failed to delete response. Please try again.');
        return;
      }
  
      const response = await fetch(`${API_ENDPOINTS.deleteCrmPreloaded}/${editingResponse.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      });
  
      if (response.ok) {
        // Remove the deleted response from the state
        setMessageOptions((prevOptions) => prevOptions.filter((option) => option.id !== editingResponse.id));
  
        // Reset the form and state
        setNewResponse({ heading: '', description: '' });
        setShowModal(false);
        setIsEdit(false);
        setEditingResponse(null);
  
        toast.success('Response deleted successfully!');
      } else {
        toast.error('Failed to delete response. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="form-group mx-auto dropDown">
      <div className="d-flex justify-content-between align-items-center">
      <div class="form-floating w-100">
      <select className="form-select w-100" id="floatingSelect" value={selectedOption} onChange={handleDropdownChange} size="sm">
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
      <label for="floatingSelect">Select saved Template message to send instantly </label>
        </div>
        {selectedOption !== 'AddEditResponses' && (
          <div className="d-flex justify-content-end">
            <div className="btn-group" role="group" aria-label="Button Group">
              <button
                type="button"
                title="Edit Template"
                className="btn btn-sm custom-close-button"
                onClick={() => handleEditIconClick(messageOptions.find((option) => option.heading === selectedOption))}
                >
                <GrFormEdit />
              </button>
              <button
                type="button"
                title="Delete Template"
                className="btn btn-sm custom-close-button"
                onClick={handleDeleteResponse}
              >
                <RiDeleteBin3Fill/>
              </button>
            </div>
          </div>
        )}
       </div>
      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-overlay modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title">{isEdit ? 'Edit' : 'Add'} Message Template</h5>
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

      {/* {selectedOption !== 'Select Response' && (
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
          <div className="d-flex justify-content-end mt-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => handleEditResponse(selectedOption)}
            >
              Edit
            </button>
          </div>
        </>
      )} */}
    </div>
  );
}

export default AI;
