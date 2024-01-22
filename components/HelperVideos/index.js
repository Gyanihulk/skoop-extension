import React from 'react';

const CarouselComponent = () => {
  return (
    <div className="container mt-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <div className="accordion" id="accordionExample">

        <div className="card mb-2">
          <div id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
            <h5 className="mb-1 d-flex justify-content-center align-items-center">
              <button className="btn btn-outline btn-sm btn-block text-center collapsed" type="button">
                Getting Started with skoop!
              </button>
            </h5>
          </div>
          <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div className="card-body">
              <iframe title="YouTube Video 1" width="100%" height="280"
                src="https://www.youtube.com/embed/trYK7uAOUAM?si=T1qQ8Dqot-JCxx92"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen></iframe>
            </div>
          </div>
        </div>

        <div className="card mb-2">
          <div id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            <h5 className="mb-1 d-flex justify-content-center align-items-center">
              <button className="btn btn-outline btn-sm btn-block text-center collapsed" type="button">
                How to use chatgpt functionality?
              </button>
            </h5>
          </div>
          <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
            <div className="card-body">
              <iframe title="YouTube Video 2" width="100%" height="280"
                src="https://www.youtube.com/embed/trYK7uAOUAM?si=T1qQ8Dqot-JCxx92"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; full-screen"
                allowFullScreen></iframe>
            </div>
          </div>
        </div>

        <div className="card mb-2">
          <div id="headingThree" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            <h8 className="mb-0 d-flex justify-content-center align-items-center">
              <button className="btn btn-outline btn-sm btn-block text-center collapsed" type="button">
                How to use gif functionality?
              </button>
            </h8>
          </div>
          <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
            <div className="card-body">
            <iframe class="vidyard_iframe" title="Vidyard's Video FAQ" src="https://play.vidyard.com/1GhS9iy9saFmmZSxatNUcc.html?" 
            allow="fullscreen https://play.vidyard.com"
            width="100%" height="280"  frameborder="0" allowtransparency="true"></iframe>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2" />
    </div>
  );
};

export default CarouselComponent;


