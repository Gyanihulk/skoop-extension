import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';
import toast from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
const SavedMessages = ({ appendToBody, close }) => {
    const [cgpt, setCgpt] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTime, setLoadingTime] = useState(0);
    const [waitingMessage, setWaitingMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [messageOptions, setMessageOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPrompt, setNewPrompt] = useState({ heading: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [responseGenerated, setResponseGenerated] = useState(false);

    const handleDropdownChange = (event) => {
        const value = event;
        console.log(event,"dropdown selection")
        if (value === 'AddPrompt') {
            setShowModal(true);
            setSelectedOption('Select Prompt');
            setIsEditing(false);
            setEditingPrompt(null);
        } else {
            // setShowModal(false);
            setSelectedOption(value);
            const selectedPrompt = messageOptions.find(
                (option) => option.id === parseInt(value, 10)
            );

            if (selectedPrompt) {
                appendToBody(` ${selectedPrompt.description}`)
            } else {
                console.error('Selected prompt not found');
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
            setWaitingMessage('Generating a suitable response, please wait');
        }
        if (loadingTime > 15) {
            setWaitingMessage('Bigger text takes more time, please wait');
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


    const fetchPrompts = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.CrmPreloadedResponses, {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            setMessageOptions(data);
        } catch (error) {
            toast.error('Error fetching prompts');
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    const addNewPrompt = async () => {
        try {
            if (newPrompt.heading && newPrompt.description) {
                await fetch(API_ENDPOINTS.skoopCrmAddPreloadedResponses, {
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
                toast.success('New Prompt added successfully!');
            } else {
                // Set validation errors if the fields are empty
                setTitleError(newPrompt.heading ? '' : 'Title is required');
                setDescriptionError(newPrompt.description ? '' : 'Description is required');
                toast.error('Please fill in all required fields.');
            }
        } catch (error) {
            toast.error('Error adding prompt');
        }
    };

    const deletePrompt = async (id) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.deleteCrmPreloaded}/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete prompt. Server response: ${errorMessage}`);
            }

            fetchPrompts();
            toast.success('Prompt deleted successfully!');
        } catch (error) {
            toast.error('Error deleting prompt');
        }
    };

    const updatePrompt = async () => {
        try {
            if (isEditing && editingPrompt && newPrompt.heading && newPrompt.description) {
                await fetch(`${API_ENDPOINTS.replaceCrmPreloaded}`, {
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
                toast.error(
                    'Please fill in all required fields and ensure you are editing a valid prompt.'
                );
            }
        } catch (error) {
            toast.error('Error updating prompt');
        }
    };

    const handleEditOption = (id) => {
        console.log(id);
        const selectedPrompt = messageOptions.find((option) => option.id === parseInt(id, 10));
console.log("handle edit")
        if (selectedPrompt) {
            setEditingPrompt(selectedPrompt);
            setNewPrompt({
                heading: selectedPrompt.heading,
                description: selectedPrompt.description,
            });
            setShowModal(true);
            setIsEditing(true);
        } else {
            console.error('Selected prompt not found');
        }
    };

    //integration to template

    return (
        <div>
            <div className="chatgpt-container">
                <div className="d-flex flex-row">
                    <div className="col">
                        <div className="heading">Select saved methods to send instantly.</div>
                    </div>
                    <div className="justify-content-end" onClick={() => close('DefaultCard')}>
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            height="20px"
                            width="20px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
                        </svg>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <div className="row">
                        <div className="mb-2">
                            {/* <select
                                className="form-select"
                                value={selectedOption}
                                onChange={handleDropdownChange}
                                size="lg"
                                placeholder="Select Saved Response"
                            >
                                <option value="Select Prompt">Select prompt</option>
                                <option value="AddEditPrompt">Add New Prompt</option>
                                {messageOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.heading}
                                    </option>
                                ))}
                            </select> */}
                            <DropdownButton
                                as={ButtonGroup}
                                size="sm"
                                title="Select Message"
                                id="gpt-dropdown"
                                value={selectedOption}
                                onSelect={handleDropdownChange}
                            >
                                <Dropdown.Item eventKey="AddPrompt">
                                    <svg
                                        width="12"
                                        height="13"
                                        viewBox="0 0 12 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="me-1"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M11.1429 7.35714H6.85714V11.6429C6.85714 12.1143 6.47143 12.5 6 12.5C5.52857 12.5 5.14286 12.1143 5.14286 11.6429V7.35714H0.857143C0.385714 7.35714 0 6.97143 0 6.5C0 6.02857 0.385714 5.64286 0.857143 5.64286H5.14286V1.35714C5.14286 0.885714 5.52857 0.5 6 0.5C6.47143 0.5 6.85714 0.885714 6.85714 1.35714V5.64286H11.1429C11.6143 5.64286 12 6.02857 12 6.5C12 6.97143 11.6143 7.35714 11.1429 7.35714Z"
                                            fill="#2A2B39"
                                        />
                                    </svg>
                                    Add New Message
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                {messageOptions.map((option) => (
                                    <Dropdown.Item
                                        key={option.id}
                                        eventKey={option.id}
                                        className="dropdown-item-hover"
                                    >
                                        {option.heading.slice(0, 15)}...
                                        <div>
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleEditOption(option.id);
                                                }}
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M4 13.6417V15.6683C4 15.855 4.14667 16.0017 4.33333 16.0017H6.36C6.44667 16.0017 6.53333 15.9683 6.59333 15.9017L13.8733 8.62832L11.3733 6.12832L4.1 13.4017C4.03333 13.4683 4 13.5483 4 13.6417ZM15.8067 6.69499C16.0667 6.43499 16.0667 6.01499 15.8067 5.75499L14.2467 4.19499C14.1221 4.07016 13.953 4 13.7767 4C13.6003 4 13.4312 4.07016 13.3067 4.19499L12.0867 5.41499L14.5867 7.91499L15.8067 6.69499V6.69499Z"
                                                    fill="white"
                                                />
                                            </svg>
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    deletePrompt(option.id);
                                                }}
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M5.99967 14.6667C5.99967 15.4 6.59967 16 7.33301 16H12.6663C13.3997 16 13.9997 15.4 13.9997 14.6667V8C13.9997 7.26667 13.3997 6.66667 12.6663 6.66667H7.33301C6.59967 6.66667 5.99967 7.26667 5.99967 8V14.6667ZM13.9997 4.66667H12.333L11.8597 4.19333C11.7397 4.07333 11.5663 4 11.393 4H8.60634C8.43301 4 8.25967 4.07333 8.13967 4.19333L7.66634 4.66667H5.99967C5.63301 4.66667 5.33301 4.96667 5.33301 5.33333C5.33301 5.7 5.63301 6 5.99967 6H13.9997C14.3663 6 14.6663 5.7 14.6663 5.33333C14.6663 4.96667 14.3663 4.66667 13.9997 4.66667Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                        
                    </div>
                </div>
                <div
                    className="modal"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: showModal ? 'block' : 'none' }}
                >
                    <div className="modal-overlay  modal-dialog-centered" role="document">
                        <div className="modal-content mx-2">
                            <div className="modal-header d-flex flex-row justify-content-between">
                                <h5 className="modal-title">
                                    {' '}
                                    {isEditing ? 'Edit Message template' : 'Add Message template'}
                                </h5>
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
                                
                                <input
                                    type="text"
                                    required
                                    className="form-control"
                                    value={newPrompt.heading}
                                    placeholder='Enter Title'
                                    onChange={(e) =>
                                        handleChange({
                                            target: { name: 'title', value: e.target.value },
                                        })
                                    }
                                />
                                {titleError && <div className="invalid-feedback">{titleError}</div>}

                                <textarea
                                    rows="3"
                                    className="form-control mt-2"
                                    value={newPrompt.description}
                                    placeholder='Enter description'
                                    onChange={(e) =>
                                        handleChange({
                                            target: { name: 'description', value: e.target.value },
                                        })
                                    }
                                />
                                {descriptionError && (
                                    <div className="invalid-feedback">{descriptionError}</div>
                                )}
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
            </div>
        </div>
    );
};

export default SavedMessages;
