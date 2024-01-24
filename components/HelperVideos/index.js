import React from 'react';
import { BsFullscreen } from "react-icons/bs";

const CarouselComponent = () => {

  const openPopup = (videoUrl) => {
    const width = screen.availWidth;
    const height = screen.availHeight;
    const features = `width=${width},height=${height},fullscreen=yes`;
    window.open(videoUrl, 'Video Popup', features);
  };

  return (
    <div className="container mt-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <div className="accordion" id="accordionExample">

        <div className="card mb-2">
          <div id="headingThree" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            <h8 className="mb-1 mt-1 d-flex justify-content-center align-items-center hover-pointer">
            Helper Video 1
            </h8>
          </div>
          <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
            <div className="card-body">
            <iframe class="vidyard_iframe" title="Vidyard's Video FAQ" src="https://play.vidyard.com/1GhS9iy9saFmmZSxatNUcc.html?" 
            width="100%" height="280"  frameborder="2" allowtransparency="true"></iframe>
             <button
                className="btn btn-link btn-sm position-absolute bottom-0 end-0 m-4"
                onClick={() => openPopup("https://play.vidyard.com/1GhS9iy9saFmmZSxatNUcc.html?")}
              >
                <BsFullscreen size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2" />
    </div>
  );
};

export default CarouselComponent;
