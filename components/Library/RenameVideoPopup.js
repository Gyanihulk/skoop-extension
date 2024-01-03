import React from 'react';

const RenameVideoPopup = ({ newTitle, onClose, onSave, onTitleChange }) => {
  return (
    <div className="modal" style={{ display: 'block' }}>
  <div className="modal-display-block" />
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h6 className="modal-title">Rename Folder</h6>
      </div>
      <div className="modal-body d-flex justify-content-end">
        <input
          type="text"
          id="newTitle"
          placeholder='Enter New folder name'
          value={newTitle}
          onChange={onTitleChange}
          className="form-control"
        />
        <button type="button" className=" btn btn-outline-primary btn-sm ml-2" onClick={onSave}>
          Save
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm ml-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default RenameVideoPopup;
