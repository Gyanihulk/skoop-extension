import React, { useContext, useEffect, useState } from "react";
import ScreenContext from "../contexts/ScreenContext";
import AuthContext from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import UserPreferencesForm from "../components/UserPreferencesForm";

const CalendarSync = () => {
  const { calendarSync } = useContext(AuthContext);
  const { navigateToPage } = useContext(ScreenContext);

  const [google, setGoogle] = useState(false);
  const [microsoft, setMicrosoft] = useState(false);

  const handleFormSubmit = async () => {
    if (google) {
      calendarSync("google");
    } else if (microsoft) {
      calendarSync("microsoft");
    }
  };

  return (
    <>
      <div class="container">
        <h2 class="my-4">Skoop Appointment Setup</h2>
        <UserPreferencesForm
          heading="Please add your appointments scheduling preferences for skoop Calendar"
          collapse={true}
          handleFormSubmitted={handleFormSubmit}
        >
          <p className="card-title">
            You can add update these from the account settings anytime.
          </p>
          <p className="card-title">
            Connect your calendar to auto-check for busy times and add new
            events as they are scheduled.
          </p>

          <div class="d-flex flex-row align-items-center justify-content-start">
            <div class="d-flex align-items-center">
              <div class="form-check d-flex align-items-center">
                <input
                  class="form-check-input mt-0 pt-0"
                  type="checkbox"
                  value=""
                  checked={google}
                  onChange={() => {
                    setGoogle(!google);
                    setMicrosoft(false);
                  }}
                  id="google"
                ></input>
                <label class="d-flex align-items-center ms-2" for="google">
                  <FcGoogle />
                  <h5 class="card-title mb-0 pb-0 ms-1">Google Calendar</h5>
                </label>
              </div>
            </div>
            <div
              // onClick={() => calendarSync('microsoft')}
              class="d-flex align-items-center ms-3"
            >
              <div class="form-check d-flex align-items-center">
                <input
                  class="form-check-input mt-0 pt-0"
                  type="checkbox"
                  value=""
                  checked={microsoft}
                  onChange={() => {
                    setMicrosoft(!microsoft);
                    setGoogle(false);
                  }}
                  id="microsoft"
                ></input>
                <label class="d-flex align-items-center ms-2" for="microsoft">
                  <FaMicrosoft />
                </label>
                <h5 class="card-title mb-0 pb-0 ms-1">Outlook Calendar</h5>
              </div>
            </div>
          </div>
        </UserPreferencesForm>

        <div
          onClick={() => navigateToPage("Home")}
          class="btn btn-link mt-4 card-title"
        >
          Continue without Skoop Appointment booking System
          <p>You can add your calendar link for from account setting.</p>
        </div>
      </div>
    </>
  );
};

export default CalendarSync;
