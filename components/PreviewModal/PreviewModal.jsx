import React from 'react'

const PreviewModal = ({prev,setPrev,preview}) => {
  return (
    <div className="modal-overlay" onClick={() => setPrev('')}>
    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="btn-close" onClick={preview}>
          </button>
        </div>
        <div className="modal-body">
          <video
            className="embed-responsive-item"
            src={prev}
            autoPlay
            loop
            controls
            onClick={(e) => e.stopPropagation()} // Prevent clicks on the video from closing the modal
          ></video>
        </div>
      </div>
    </div>
  </div>
  )
}

export default PreviewModal