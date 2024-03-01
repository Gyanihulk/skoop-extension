import React from 'react';
import toast from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io';

const RenameVideoPopup = ({ newTitle, onClose, onSave, onTitleChange }) => {
    const handleSave = () => {
        if (newTitle.trim() === '') {
            toast.error('Please enter a folder name before saving.');
        } else {
            onSave();
        }
    };

    return (
        <div className="modal"   tabIndex="-1"
        role="dialog" style={{ display: 'block' }}>
  
            <div className=" modal-overlay modal-dialog-centered">
                <div className="modal-content mx-2">
                    <div className="modal-header">
                        <h6 className="modal-title">Rename Video</h6>
                        <button
                            type="button"
                            className="custom-close-button"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <IoMdClose />
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            id="newTitle"
                            placeholder="Enter New Video name"
                            value={newTitle}
                            onChange={onTitleChange}
                            className="form-control"
                            required
                        />
                   
                    </div>
                    <div className="modal-footer">
                    <button
                            type="button"
                            className=" btn btn-outline-primary btn-sm"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                            </div>
                </div>
            </div>
        </div>
    );
};

export default RenameVideoPopup;
