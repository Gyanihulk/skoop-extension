import React, { Component, useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import API_ENDPOINTS from "../apiConfig";
import { toast } from "react-hot-toast";
import { timezones } from "../../lib/timezones";
import { isStartTimeBeforeEndTime } from "../../lib/helpers";

const UserPreferencesForm = ({
  heading,
  collapse,
  handleFormSubmitted,
  children,
}) => {
  const [values, setValues] = useState({
    preferredStartTime: "",
    preferredEndTime: "",
    timeZone: "",
    additionalDetails: "",
    breakStartTime: "",
    breakEndTime: "",
  });
  const [toggleInfo, setToggleInfo] = useState(false);

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    values.timeZone = detectedTimezone;
  }, []);
  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      isStartTimeBeforeEndTime(
        values.preferredStartTime,
        values.preferredEndTime
      ) &&
      isStartTimeBeforeEndTime(values.breakStartTime, values.breakEndTime) &&
      isStartTimeBeforeEndTime(values.preferredStartTime, values.breakStartTime)
    ) {
      try {
        const res = await fetch(API_ENDPOINTS.userPreferences, {
          method: "POST",
          body: JSON.stringify({
            preferred_start_time: values.preferredStartTime,
            preferred_end_time: values.preferredEndTime,
            break_start_time: values.breakStartTime,
            break_end_time: values.breakEndTime,
            time_zone: values.timeZone,
            additional_details: values.additionalDetails,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accessToken")
            )}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Preferences saved successfully");
          handleFormSubmitted();
        } else {
          throw new Error(data.message || "Error saving preferences");
        }
      } catch (err) {
        toast.error(err.message || "Preferences not saved. Please try again.");
      }
    } else {
      toast.error(
        "Preffered Start time OR Break time is greater than End Time"
      );
    }
  };
  return (
    <div className="card border-radius-12 overflow-hidden outline">
      <div className="light-pink card-header-custom">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 card-title">
            {heading ? heading : "User Preferences"}
          </h6>
          <div
            onClick={!collapse ? () => setToggleInfo(!toggleInfo) : undefined}
            className="toggle-collapse"
            data-toggle="collapse"
            data-target="#user-preference-collapse"
            aria-expanded={collapse ? collapse : "false"}
            aria-controls="user-preference-collapse"
          >
            <FaAngleDown
              style={toggleInfo ? { transform: "rotate(180deg)" } : ""}
            />
          </div>
        </div>
      </div>
      <div
        className={`collapse ${collapse ? "show" : ""}`}
        id="user-preference-collapse"
      >
        <form onSubmit={handleSubmit}>
          <div className="card-body p-0">
            <div className="py-4-2 px--1 mt-3">
              <div className="mb-3">
                <input
                  type="time"
                  className={`form-control ${
                    !values.preferredStartTime ? "filled" : ""
                  }`}
                  id="preferredStartTime"
                  name="preferredStartTime"
                  value={values.preferredStartTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="time"
                  className={`form-control ${
                    !values.breakStartTime ? "filled" : ""
                  }`}
                  id="breakStartTime"
                  name="breakStartTime"
                  value={values.breakStartTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="time"
                  className={`form-control ${
                    !values.breakEndTime ? "filled" : ""
                  }`}
                  id="breakEndTime"
                  name="breakEndTime"
                  value={values.breakEndTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="time"
                  className={`form-control ${
                    !values.preferredEndTime ? "filled" : ""
                  }`}
                  id="preferredEndTime"
                  name="preferredEndTime"
                  placeholder="Preferred End Time *"
                  value={values.preferredEndTime}
                  onChange={handleChange}
                  required
                />
                <span class="clock-img">
                  <i class="fa fa-clock-o"></i>
                </span>
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  id="timezone"
                  name="timeZone"
                  placeholder="Time Zone*"
                  value={values.timeZone}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Timezone
                  </option>
                  {timezones.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  id="additionalDetails"
                  name="additionalDetails"
                  placeholder="Additional Info"
                  value={values.additionalInfo}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-3">{children}</div>
              <div className="mt-4 d-flex justify-content-end">
                <button type="submit" className="card-btn btn-text">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPreferencesForm;
