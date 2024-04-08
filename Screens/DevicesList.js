import React, { use, useContext, useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import AuthContext from "../contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

const DevicesList = () => {
  const { userDevices, deleteUserDevice, getUserDevice } =
    useContext(AuthContext);
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    async function setup() {
      const devices = await getUserDevice();
      console.log(devices, "devices screen");
      setDevices(devices);
    }
    setup();
  }, [userDevices]);
  return (
    <>
      <div className="mb-4 pt-3">
        <BackButton navigateTo="Home" />
      </div>
      <div id="login-device">
        <div className="p-3">
          <div className="card-body text-center pb-4">
            <div className="login-device-head">
              <h4>Multiple Logins detected!</h4>
              <h6 className="profile-text-sm">
                You can only login Skoop in maximum 2 devices.
              </h6>
            </div>
          </div>
        </div>
        <h6 className="ps-4 current-session-title">Current Sessions</h6>
        <div className="border-top-light-pink">
          {devices ? (
            devices.map((device) => (
              <div class="card device-card my-4 p-3 " key={device.id}>
                <div class="list-group">
                  <div className="d-flex flew-row align-items-start device-login-card-title">
                    {" "}
                    <div className="me-3 device-login-card-title-bold">
                      Browser:
                    </div>{" "}
                    🌐 Chrome on {device.operating_system}
                  </div>
                  <div className="d-flex flew-row align-items-start device-login-card-title">
                    {" "}
                    <div className="me-3 device-login-card-title-bold">
                      Device:
                    </div>{" "}
                    {device.operating_system}
                  </div>
                  <div className="d-flex flew-row align-items-start device-login-card-title">
                    {" "}
                    <div className="me-3 device-login-card-title-bold">
                      Location:
                    </div>{" "}
                    {device.location}
                  </div>
                  <div className="d-flex flew-row align-items-start device-login-card-title">
                    <div className="me-3 device-login-card-title-bold">
                      IP address:
                    </div>
                    {device.ip_address}
                  </div>
                  <button
                    class="mt-3 device-remove-btn"
                    onClick={() =>
                      deleteUserDevice(device.id, device.device_id)
                    }
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
      </div>
    </>
  );
};

export default DevicesList;
