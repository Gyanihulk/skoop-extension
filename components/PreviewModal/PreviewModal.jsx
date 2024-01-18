import React from 'react'
import { IoMdClose } from "react-icons/io";

const PreviewModal = ({prev,setPrev,preview}) => {
  return (
    <div className="modal-overlay" onClick={() => setPrev('')}>
    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="custom-close-button" onClick={preview} aria-label="Close">
          <IoMdClose/>
          </button>
        </div>
        <div className="modal-body">
          <video
            className="embed-responsive-item"
            src={prev}
            autoPlay
            loop
            controls
            onClick={(e) => e.stopPropagation()} 
          ></video>
        </div>
      </div>
    </div>
  </div>
  )
}

export default PreviewModal
