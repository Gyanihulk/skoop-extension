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
    <div className="container mt-2" style={{ maxHeight: '400px', overflowY: 'auto' ,zIndex:1000}}>
      <div className="accordion" id="accordionExample">
        
        <div className="card mb-2 mt-2">
          <div id="headingfive" data-toggle="collapse" data-target="#collapsefive" aria-expanded="false" aria-controls="collapseThree">
            <h8 className="mb-1 mt-1 d-flex justify-content-center align-items-center hover-pointer">
            How to send Video
            </h8>
          </div>
          <div id="collapsefive" className="collapse" aria-labelledby="headingfive" data-parent="#accordionExample">
            <div className="card-body">
            <iframe class="vidyard_iframe" title="Vidyard's Video FAQ" src="https://play.vidyard.com/2ZvdQMJWiHaN6GHDMwG6wG.html?" 
            width="100%" height="280"  frameborder="2" allowtransparency="true"></iframe>
             <button
                className="btn btn-link btn-sm position-absolute bottom-0 end-0 m-4"
                onClick={() => openPopup("https://play.vidyard.com/2ZvdQMJWiHaN6GHDMwG6wG.html?")}
              >
                <BsFullscreen size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="card mb-2 mt-2">
          <div id="headingseven" data-toggle="collapse" data-target="#collapseseven" aria-expanded="false" aria-controls="collapseThree">
            <h8 className="mb-1 mt-1 d-flex justify-content-center align-items-center hover-pointer">
            How to send Audio
            </h8>
          </div>
          <div id="collapseseven" className="collapse" aria-labelledby="headingseven" data-parent="#accordionExample">
            <div className="card-body">
            <iframe class="vidyard_iframe" title="Vidyard's Video FAQ" src="https://play.vidyard.com/JXjqZR2ACN5aoZNJxWkZJJ.html?" 
            width="100%" height="280"  frameborder="2" allowtransparency="true"></iframe>
             <button
                className="btn btn-link btn-sm position-absolute bottom-0 end-0 m-4"
                onClick={() => openPopup("https://play.vidyard.com/JXjqZR2ACN5aoZNJxWkZJJ.html?")}
              >
                <BsFullscreen size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="card mb-2 mt-2">
          <div id="headingfour" data-toggle="collapse" data-target="#collapsefour" aria-expanded="false" aria-controls="collapseThree">
            <h8 className="mb-1 mt-1 d-flex justify-content-center align-items-center hover-pointer">
            How to add Chatgpt prompts
            </h8>
          </div>
          <div id="collapsefour" className="collapse" aria-labelledby="headingfour" data-parent="#accordionExample">
            <div className="card-body">
            <iframe class="vidyard_iframe" title="Vidyard's Video FAQ" src="https://play.vidyard.com/nfAw1a2scendwz7VfuydyE.html?" 
            width="100%" height="280"  frameborder="2" allowtransparency="true"></iframe>
             <button
                className="btn btn-link btn-sm position-absolute bottom-0 end-0 m-4"
                onClick={() => openPopup("https://play.vidyard.com/nfAw1a2scendwz7VfuydyE.html?")}
              >
                <BsFullscreen size={16} />
              </button>
            </div>
          </div>
          </div>

        <div className="card mb-2 mt-2">
          <div id="headingsix" data-toggle="collapse" data-target="#collapsesix" aria-expanded="false" aria-controls="collapseThree">
            <h8 className="mb-1 mt-1 d-flex justify-content-center align-items-center hover-pointer">
            How to send GIF
            </h8>
          </div>
          <div id="collapsesix" className="collapse" aria-labelledby="headingsix" data-parent="#accordionExample">
            <div className="card-body">
            <iframe class="vidyard_iframe" title="Vidyard's Video FAQ" src="https://play.vidyard.com/bZYGwE5EsWUMzMjf9zNJpa.html?" 
            width="100%" height="280"  frameborder="2" allowtransparency="true"></iframe>
             <button
                className="btn btn-link btn-sm position-absolute bottom-0 end-0 m-4"
                onClick={() => openPopup("https://play.vidyard.com/bZYGwE5EsWUMzMjf9zNJpa.html?")}
              >
                <BsFullscreen size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="card mb-2 mt-2">
          <div id="headingThree" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            <h8 className="mb-1 mt-1 d-flex justify-content-center align-items-center hover-pointer">
            Skoop Detailed Demo
            </h8>
          </div>
          <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
            <div className="card-body">
            <iframe class="vidyard_iframe" title="Vidyard's Video FAQ" src="https://play.vidyard.com/cWx3qYJFnpZ4KNxxE85Axd.html?" 
            width="100%" height="280"  frameborder="2" allowtransparency="true"></iframe>
             <button
                className="btn btn-link btn-sm position-absolute bottom-0 end-0 m-4"
                onClick={() => openPopup("https://play.vidyard.com/cWx3qYJFnpZ4KNxxE85Axd.html?")}
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
