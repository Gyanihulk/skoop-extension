import React, { useContext } from 'react';
import ScreenContext from '../../contexts/ScreenContext';

const LinkedInCom = () => {
  const { navigateToPage } = useContext(ScreenContext);
  return (
    <>
      <button
        type="button"
        className="btn btn-outline-success mx-auto d-block mb-10"
        data-mdb-toggle="tooltip"
        data-mdb-placement="top"
        title="Go to any LinkedIn profile page & click this button to fetch its details."
        onClick={() => navigateToPage("ContactPage")}
      >
        Access Contact Details
      </button>

     {/* <div className="container top-margins">
        <div className="row justify-content-center">
          <div className="col-md-10 mt-15 mb-20">
            <div className="card">
              <div className="card-body text-center mb-20">
                <h4 className="card-title">
                  <strong>Welcome to Skoop!</strong>
                </h4>
                <p className="card-text">
                  Navigate through above buttons to get started.
                </p>
                <a
                  href="https://play.vidyard.com/XywsZaajMzPAB3WUima3gU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  How Skoop Works
                </a>
              </div>
            </div>
          </div>
        </div>
</div> */}
    </>
  );
};

export default LinkedInCom;
