import React, { use, useContext, useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import AuthContext from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

const DevicesList = () => {
    const {  userDevices,deleteUserDevice, getUserDevice } = useContext(AuthContext);
    const [devices,setDevices]=useState([])
    useEffect(() => {
        async function setup(){
            const devices=await getUserDevice()
            console.log(devices,"devices screen")
            setDevices(devices)
        }
        setup()
    }, [userDevices]);
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
                {devices ? (
                    devices.map((device) => (
                        <div class="card device-card my-4 p-3 " key={device.id}>
                            <div class="list-group">
                                <div className="d-flex flew-row align-items-start">
                                    {' '}
                                    <div className="fs-6 fw-bold me-3">Browser:</div> 🌐 Chrome on {' '}
                                    {device.operating_system}
                                </div>
                                <div className="d-flex flew-row align-items-start">
                                    {' '}
                                    <div className="fs-6 fw-bold me-3">Device:</div>{' '}
                                    {device.operating_system}
                                </div>
                                <div className="d-flex flew-row align-items-start">
                                    {' '}
                                    <div className="fs-6 fw-bold me-3">Location:</div>{' '}
                                    {device.location}
                                </div>
                                <div className="d-flex flew-row align-items-start">
                                    <div className="fs-6 fw-bold me-3">IP address:</div>
                                    {device.ip_address}
                                </div>
                                <button
                                    class="mt-3 btn btn-primary fw-bold"
                                    onClick={() => deleteUserDevice(device.id, device.device_id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status"></div>
                        <h2 className="text-dark mt-3">Loading, please wait...</h2>
                    </div>
                )}
            </div>
        </>
    );
};

export default DevicesList;
