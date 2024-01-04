import React from 'react';
import toast from 'react-hot-toast';
import { IoMdClose } from "react-icons/io";

const RenameVideoPopup = ({ newTitle, onClose, onSave, onTitleChange }) => {

  const handleSave = () => {
    if (newTitle.trim() === '') {
      toast.error('Please enter a folder name before saving.');
    } else {
      onSave();
    }
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
  <div className="modal-display-block" />
  <div className="modal-dialog modal-overlay modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h6 className="modal-title">Rename Folder</h6>
        <button type="button" className="custom-close-button" onClick={onClose} aria-label="Close">
        <IoMdClose/>
        </button>
      </div>
      <div className="modal-body d-flex justify-content-end">
        <input
          type="text"
          id="newTitle"
          placeholder='Enter New folder name'
          value={newTitle}
          onChange={onTitleChange}
          className="form-control"
          required
        />
        <button type="button" className=" btn btn-outline-primary btn-sm" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default RenameVideoPopup;
