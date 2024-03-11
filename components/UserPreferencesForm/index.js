import React, { Component, useEffect, useContext, useState, useRef } from "react";
import { FaAngleDown, FaRegClock } from "react-icons/fa";
import API_ENDPOINTS from "../apiConfig";
import { toast } from "react-hot-toast";
import { timezones } from "../../lib/timezones";
import { isStartTimeBeforeEndTime } from "../../lib/helpers";
import { MdExpandMore } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import AuthContext from "../../contexts/AuthContext";
import ValidationError from "../../components/Auth/ValidationError";

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
  const [isPreference, setIsPreference] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [isTimezoneEmpty, setIsTimezoneEmpty] = useState(false);
  const [isTimezoneScreen, setIsTimezoneScreen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [filteredTimezones, setFilteredTimezones] = useState(timezones);
  const { getUserPreferences } = useContext(AuthContext);
  const inputRef = useRef();

  const fetchUserPreferences = async () => {
    try{
      const preferences = await getUserPreferences();
      if(preferences && preferences.length > 0){
        setIsPreference(true);
        console.log("preferences inside fetch", preferences);
        setValues({
          preferredStartTime: preferences[0].preferred_start_time,
          preferredEndTime: preferences[0].preferred_end_time,
          breakStartTime: preferences[0].break_start_time,
          breakEndTime: preferences[0].break_end_time,
          additionalDetails: preferences[0].additional_details,
        })
        setSelectedTimezone(preferences[0].time_zone);
      }

    }catch(err){
      console.log(err?.message);
    }
  }

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    values.timeZone = detectedTimezone;
    setSelectedTimezone(detectedTimezone);
    fetchUserPreferences();
  }, []);

  const handleFocus = () => {
    // Programmatically click on the input to trigger the time picker
    inputRef.current.click();
  };

  const handleToggleTimezoneScreen = () => {
    setIsTimezoneScreen(!isTimezoneScreen);
    // collapse = true;
  };

  const handleSelectTimezone = (timezone) => {
    setSelectedTimezone(timezone);
    setIsTimezoneEmpty(false);
    setFilteredTimezones(timezones);
    handleToggleTimezoneScreen();
    // collapse = false;
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = timezones.filter((timezone) =>
      timezone.toLowerCase().includes(query)
    );
    setFilteredTimezones(filtered);
  };

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
        const payload = JSON.stringify({
          preferred_start_time: values.preferredStartTime,
          preferred_end_time: values.preferredEndTime,
          break_start_time: values.breakStartTime,
          break_end_time: values.breakEndTime,
          time_zone: selectedTimezone,
          additional_details: values.additionalDetails,
        });
        if(!isPreference){
          const res = await fetch(API_ENDPOINTS.userPreferences, {
            method: "POST",
            body: payload,
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
            fetchUserPreferences();
          } else {
            console.log(data);
            throw new Error(data.message || "Error saving preferences");
          }
        }
        else{
          const res = await fetch(API_ENDPOINTS.userPreferences, {
            method: "PUT",
            body: payload,
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
            fetchUserPreferences();
          } else {
            console.log(data);
            throw new Error(data.message || "Error saving preferences");
          }
        }
      } catch (err) {
        console.log(err);
        toast.error("Preferences not saved. Please try again.");
      }
    } else {
      toast.error(
        "Preffered Start time OR Break time is greater than End Time"
      );
    }
  };
  return (
    <>
        <div className="card border-radius-12 overflow-hidden outline">
          <div
            className="light-pink card-header-custom toggle-collapse"
            onClick={() => setToggleInfo(!toggleInfo)}
            data-toggle="collapse"
            data-target={!collapse ? "#user-preference-collapse" : ""}
            aria-expanded={collapse ? collapse : "true"}
            aria-controls="user-preference-collapse"
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 card-title">
                {heading ? heading : "User Preferences"}
              </h6>
              {!collapse && (
                <div>
                  <FaAngleDown
                    style={toggleInfo ? { transform: "rotate(180deg)" } : ""}
                  />
                </div>
              )}
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
                    <div className="position-relative">
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
                      <div className="clock-icon">
                        <FaRegClock size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="position-relative">
                      <input
                        type="time"
                        className={`form-control ${
                          !values.breakStartTime ? "filled" : ""
                        }`}
                        id="breakStartTime"
                        name="breakStartTime"
                        placeholder="Break Start Time *"
                        value={values.breakStartTime}
                        onChange={handleChange}
                        required
                      />
                      <div className="clock-icon">
                        <FaRegClock size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="position-relative">
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
                      <div className="clock-icon">
                        <FaRegClock size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="position-relative">
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
                      <div className="clock-icon">
                        <FaRegClock size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div
                      className="position-relative"
                      onClick={handleToggleTimezoneScreen}
                    >
                      <input
                        className="form-control cursor-pointer"
                        id="time-zone-dropdown"
                        type="text"
                        name="timezone"
                        placeholder="Select time zone"
                        value={selectedTimezone}
                        readOnly
                      />
                      <button
                        className="btn position-absolute end-0 top-50 translate-middle-y border-0"
                        type="button"
                      >
                        <MdExpandMore size={30} />
                      </button>
                    </div>
                    {isTimezoneEmpty && (
                      <ValidationError title="Please select timezone" />
                    )}
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      id="additionalDetails"
                      name="additionalDetails"
                      placeholder="Additional Info"
                      value={values.additionalDetails}
                      onChange={handleChange}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-3">{children}</div>
                  <div className="mt-4 d-flex justify-content-end">
                    <button type="submit" className="card-btn btn-text">
                      {!isPreference? "Save" : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      {isTimezoneScreen &&(
        <div className=" py-3 px-2 time-zone-main">
          <div className="timezone-head d-flex justify-content-between">
            <h2>Select time zone</h2>
            <RxCross2
              className="cursor-pointer"
              size={28}
              color="#2C2D2E"
              onClick={handleToggleTimezoneScreen}
            />
          </div>
          <div className="position-relative custom-password-input-box">
            <input
              type="text"
              className="form-control mt-3"
              id="timezone-search-input-box"
              placeholder="Search"
              onChange={handleSearch}
            />
            <button
              className="btn position-absolute ps-3 top-50 translate-middle-y border-0"
              type="button"
            >
              <IoSearchOutline />
            </button>
          </div>

          <div className="mt-4" id="timezone-list-container">
            {filteredTimezones.map((timezone, index) => (
              <div>
                <div
                  onClick={() => handleSelectTimezone(timezone)}
                  className={`px-2 timezone-item cursor-pointer`}
                  id={`${
                    selectedTimezone === timezone ? "selected-timezone" : ""
                  }`}
                  key={index}
                >
                  <div>{timezone}</div>
                  {selectedTimezone === timezone && <IoCheckmark size={16} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserPreferencesForm;
