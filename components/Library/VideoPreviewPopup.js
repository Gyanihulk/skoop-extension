import React from 'react';
import { IoMdClose } from "react-icons/io";


const VideoPreviewPopup = ({ video, onClose }) => {
  return (
    <div className="modal" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog modal-overlay modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="custom-close-button" onClick={onClose} aria-label="Close">
                <IoMdClose/>
            </button>
          </div>
          <div className="modal-body">
            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                //title={video.video_title}
                className="embed-responsive-item"
                src={video.link}
                allow="autoplay; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewPopup;
