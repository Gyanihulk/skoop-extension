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
    </>
  );
};

export default LinkedInCom;
