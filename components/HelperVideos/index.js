import React from 'react';

const CarouselComponent = () => {
  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
      <ol className="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <iframe
            title="YouTube Video 1"
            width="500"
            height="315"
            src="https://www.youtube.com/embed/trYK7uAOUAM?si=T1qQ8Dqot-JCxx92"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <div className="carousel-item">
          <img src="https://blog.planview.com/wp-content/uploads/2020/01/Top-6-Software-Development-Methodologies.jpg" className="d-block w-100" alt="Slide 2" />
        </div>

        <div className="carousel-item">
          <img src="https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/09/21203035/development-economics.png" className="d-block w-100" alt="Slide 3" />
        </div>
      </div>
    <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" style={{ color: 'black' }}></span>
        <span className="sr-only" style={{ color: 'black' }}>Previous</span>
    </a>

    <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" style={{ color: 'black' }}></span>
        <span className="sr-only" style={{ color: 'black' }}>Next</span>
        </a>

    </div>
  );
};

export default CarouselComponent;
