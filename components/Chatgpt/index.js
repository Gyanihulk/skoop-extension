import React, { useState, useEffect } from 'react';
import { MdOutlineScheduleSend } from "react-icons/md";
import API_ENDPOINTS from '../apiConfig';
import { handleCopyToClipboard } from '../../utils';
import toast from 'react-hot-toast';
import { IoMdClose } from "react-icons/io";


const ChatGpt = ({ appendToBody }) => {
  const [cgpt, setCgpt] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [waitingMessage, setWaitingMessage] = useState('');


  const [selectedOption, setSelectedOption] = useState('Select Prompt');
  const [messageOptions, setMessageOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ heading: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');



  const handleDropdownChange = (event) => {
    const value = event.target.value;
  
    if (value === 'AddEditPrompt') {
      setShowModal(true);
      setSelectedOption('Select Prompt');
      setIsEditing(false); 
      setEditingPrompt(null); 
    } else {
      setShowModal(false);
      setSelectedOption(value);
      const selectedPrompt = messageOptions.find((option) => option.id === parseInt(value, 10));
  
      if (selectedPrompt) {
        setCgpt(` ${selectedPrompt.description}`);
      } else {
        console.error("Selected prompt not found");
      }
    }
  };
  
 
  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name === 'cgpt') {
      setCgpt(value);
    } else if (name === 'prompt') {
      setPrompt(value);
    } else if (name === 'title') {
      setNewPrompt({ ...newPrompt, heading: value });
      setTitleError(value ? '' : 'Title is required');
    } else if (name === 'description') {
      setNewPrompt({ ...newPrompt, description: value });
      setDescriptionError(value ? '' : 'Description is required');
    }
  };
  


  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingTime((prevLoadingTime) => prevLoadingTime + 1);
    }, 1000);


    if (loadingTime > 5) {
      setWaitingMessage("Generating a suitable response, please wait");
    }
    if (loadingTime > 15) {
      setWaitingMessage("Bigger text takes more time, please wait");
    }


    return () => {
      clearInterval(intervalId);
    };
  }, [loading, loadingTime]);


  useEffect(() => {
    const responseText = prompt;
    const lineCount = (responseText.match(/\n/g) || []).length + 1;
    const lineHeight = 16; // same as font size of textarea
    const newHeight = lineHeight * lineCount;


    const responseArea = document.getElementById('skoop_cgpt_response');
    if (responseArea !== null) {
      responseArea.style.height = `${newHeight}px`;
    }
    setNewPrompt(prompt);
  }, [prompt]);


  const sendPrompt = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);


      const choices = await fetch(API_ENDPOINTS.cgpt + new URLSearchParams({ input: cgpt }), {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      });


      const response = await choices.json();
      setLoading(false);
      setWaitingMessage('');
      setPrompt(response.choices[0].message.content);
    } catch (err) {
      console.log("could not get chatGpt response", err);
      toast.error("could not get chatGpt response");
    }
  };


  const fetchPrompts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.chatgptprompt, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setMessageOptions(data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast.error('Error fetching prompts');
    }
  };


  useEffect(() => {
    fetchPrompts();
  }, []);


  const addNewPrompt = async () => {
    try {
      if (newPrompt.heading && newPrompt.description) {
        await fetch(API_ENDPOINTS.chatgptprompt, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            heading: newPrompt.heading,
            description: newPrompt.description,
          }),
        });
        setShowModal(false);
        setNewPrompt({ heading: '', description: '' });
        fetchPrompts();
        toast.success('New Template added successfully!');
      } else {
        // Set validation errors if the fields are empty
        setTitleError(newPrompt.heading ? '' : 'Title is required');
        setDescriptionError(newPrompt.description ? '' : 'Description is required');
        toast.error('Please fill in all required fields.');
      }
    } catch (error) {
      console.error('Error adding prompt:', error);
      toast.error('Error adding prompt');
    }
  };
  


  const deletePrompt = async (id) => {
    try {
      console.log('Deleting prompt with id:', id);
 
      const response = await fetch(`${API_ENDPOINTS.chatgptprompt}/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
 
      console.log('Response:', response);
 
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete prompt. Server response: ${errorMessage}`);
      }
 
      setSelectedOption('Select Prompt');
      fetchPrompts();
      toast.success('Template deleted successfully!');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Error deleting prompt');
    }
  };


  const updatePrompt = async () => {
    try {
      if (isEditing && editingPrompt && newPrompt.heading && newPrompt.description) {
        await fetch(`${API_ENDPOINTS.chatgptprompt}/${editingPrompt.id}`, {
          method: 'PUT',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            heading: newPrompt.heading,
            description: newPrompt.description,
            id: editingPrompt.id,
          }),
        });
  
        setShowModal(false);
        setNewPrompt({ heading: '', description: '' });
        setIsEditing(false);
        fetchPrompts();
        toast.success('Prompt updated successfully!');
        setSelectedOption('Select Prompt');
      } else {
        // Set validation errors if the fields are empty or editingPrompt is not available
        setTitleError(newPrompt.heading ? '' : 'Title is required');
        setDescriptionError(newPrompt.description ? '' : 'Description is required');
        toast.error('Please fill in all required fields and ensure you are editing a valid prompt.');
      }
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast.error('Error updating prompt');
    }
  };
  
 
  const handleDeleteOption = () => {
    deletePrompt(selectedOption);
  };

  const handleEditOption = (event, id) => {
    event.preventDefault();
    console.log("ID:", id);
    console.log("Message Options:", messageOptions);

  const selectedPrompt = messageOptions.find((option) => option.id === parseInt(id, 10));

  if (selectedPrompt) {
    setEditingPrompt(selectedPrompt);
    setNewPrompt({
      heading: selectedPrompt.heading,
      description: selectedPrompt.description,
    });
    setShowModal(true);
    setIsEditing(true);
  } else {
    console.error("Selected prompt not found");
  }
};


  return (
    <div>
      <div className="form-group mx-auto dropDown mb-3">
        <select
          className="form-select"
          value={selectedOption}
          onChange={handleDropdownChange}
          size="md"
          placeholder="Select Saved Response"
        >
          <option value="Select Prompt" disabled hidden>
            Select Saved Prompt
          </option>
          <option value="AddEditPrompt" className="bold-text">
            Add Prompt
          </option>
          {messageOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.heading}
            </option>
          ))}
        </select>

        {selectedOption !== 'AddEditPrompt' && selectedOption !== 'Select Prompt' && (
          <div className="d-flex justify-content-end mt-2">
            <div className="btn-group" role="group" aria-label="Button Group">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={(e) => handleEditOption(e, selectedOption)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteOption(selectedOption)}
              >
                Delete
              </button>
            </div>
          </div>
       )}
      </div>
      <div
        className="modal"
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div
          className="modal-overlay modal-dialog modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title"> {isEditing ? 'Edit Prompt' : 'Add Prompt'}</h5>
              <button
                type="button"
                className="custom-close-button"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="modal-body">
              <label className="mb-2 mt-2 text-center">Prompt Title</label>
              <input
                type="text"
                required
                className="form-control"
                value={newPrompt.heading}
                onChange={(e) => handleChange({ target: { name: 'title', value: e.target.value } })}
                />
                {titleError && <div className="invalid-feedback">{titleError}</div>}

              <label className="mb-2 mt-2 text-center">Description</label>
              <textarea
                rows="3"
                className="form-control"
                value={newPrompt.description}
                onChange={(e) => handleChange({ target: { name: 'description', value: e.target.value } })}
                />
                {descriptionError && <div className="invalid-feedback">{descriptionError}</div>}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (newPrompt.heading) {
                    if (isEditing) {
                      updatePrompt();
                    } else {
                      addNewPrompt();
                    }
                  }
                }}
              >
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={sendPrompt}>
        <div className="input-group mb-3">
        <textarea
          className="form-control"
          placeholder="Ask ChatGPT..."
          name="cgpt"
          value={cgpt}
          onChange={handleChange}
          rows="1"
        />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="submit"
            >
              <MdOutlineScheduleSend />
            </button>
          </div>
        </div>

        {loading ? (
          <>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div className="sbl-circ-ripple"></div>
              <h6>{waitingMessage}</h6>
            </div>
          </>
        ) : null}

        {prompt !== '' && !loading && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <label className="mb-2 text-center">Response</label>
                  <textarea
                    className="form-control"
                    aria-multiline="auto"
                    name="prompt"
                    value={prompt}
                    onChange={handleChange}
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
          </>
        )}
      </form>

      {prompt !== '' && !loading && (
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-primary chatgpt-button"
            onClick={() => {
              handleCopyToClipboard(prompt);
            }}
          >
            Copy
          </button>
          <button
            type="button"
            className="btn btn-outline-primary chatgpt-button"
            onClick={() => {
              appendToBody(prompt);
            }}
          >
            Insert
          </button>
        </div>
      )}
      <br />
      <br />
    </div>
  );
};


export default ChatGpt;

