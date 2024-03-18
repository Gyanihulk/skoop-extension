import React from 'react';

import ContactInfoCard from '../components/ContactInfo/index.js';

const ContactPage = () => {
    return (
        <>
            <div className="mb-4 pt-3">
                <BackButton navigateTo="Home" />
            </div>
            <ContactInfoCard />
        </>
    );
};

export default ContactPage;
