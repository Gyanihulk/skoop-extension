import React, { use, useContext, useEffect } from 'react';
import BackButton from '../components/BackButton';
import AuthContext from '../contexts/AuthContext';

const DevicesList = () => {
    const { getUserDevices } = useContext(AuthContext);
    async function setup() {
        const devices = await getUserDevices();
        console.log(devices)
    }
    useEffect(() => {
        setup();
    });
    return (
        <>
            <div className="mb-4 pt-3">
                <BackButton navigateTo="Home" />
            </div>
            <div className="p-3">
                <div className="card-body text-center pb-4">
                    <div>
                        <h4>Multiple Logins detected!</h4>
                        <h6 className="profile-text-sm">
                            You can only login Skoop in maximum 2 devices.
                        </h6>
                    </div>
                </div>
            </div>
            <h6 className="ps-4 fs-6">Current Sessions</h6>
            <div className="border-top-light-pink">
                <div class="card device-card my-4 p-3 ">
                    <div class="list-group">
                        <div className="d-flex flew-row align-items-start">
                            {' '}
                            <div className="fs-6 fw-bold me-3">Browser:</div> 🌐 Chrome on iPhone
                        </div>
                        <div className="d-flex flew-row align-items-start">
                            {' '}
                            <div className="fs-6 fw-bold me-3">Device:</div> iPhone 14
                        </div>
                        <div className="d-flex flew-row align-items-start">
                            {' '}
                            <div className="fs-6 fw-bold me-3">Location:</div> USA
                        </div>
                        <div className="d-flex flew-row align-items-start">
                            <div className="fs-6 fw-bold me-3">IP address:</div>
                            123.45.678.321
                        </div>
                        <button class="mt-3 btn btn-primary fw-bold">Remove</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DevicesList;
