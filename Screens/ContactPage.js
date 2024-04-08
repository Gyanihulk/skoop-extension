import React from "react";

import ContactInfoCard from "../components/ContactInfo/index.js";
import BackButton from "../components/BackButton/index.js";

const ContactPage = () => {
  return (
    <>
      <div className="mb-2 pt-3">
        <BackButton navigateTo="Home" />
      </div>
      <ContactInfoCard />
    </>
  );
};

export default ContactPage;
