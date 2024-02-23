import React, { useContext, useEffect, useState } from 'react';
import ScreenContext from '../contexts/ScreenContext';
import AuthContext from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import API_ENDPOINTS from '../components/apiConfig';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { timezones } from '../lib/timezones';
import toast from 'react-hot-toast';
import { isStartTimeBeforeEndTime } from '../lib/helpers';

const CalendarSync = () => {
    const { calendarSync ,setNewUser} = useContext(AuthContext);
    const { navigateToPage } = useContext(ScreenContext);
    const [values, setValues] = useState({
        preferredStartTime: '',
        preferredEndTime: '',
        timeZone: '',
        additionalDetails: '',
        breakStartTime: '',
        breakEndTime: '',
    });
    const [google, setGoogle] = useState(false);
    const [microsoft, setMicrosoft] = useState(false);

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
      
        if (isStartTimeBeforeEndTime(values.preferredStartTime, values.preferredEndTime) && isStartTimeBeforeEndTime(values.breakStartTime, values.breakEndTime) && isStartTimeBeforeEndTime(values.preferredStartTime, values.breakStartTime)) {
        try {
            const res = await fetch(API_ENDPOINTS.userPreferences, {
                method: 'POST',
                body: JSON.stringify({
                    preferred_start_time: values.preferredStartTime,
                    preferred_end_time: values.preferredEndTime,
                    break_start_time: values.breakStartTime,
                    break_end_time: values.breakEndTime,
                    time_zone: values.timeZone,
                    additional_details: values.additionalDetails,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Preferences saved successfully');
                
                if(google){
                    await calendarSync('google')
                }else if(microsoft){
                   await calendarSync('microsoft')
                }
                setNewUser(false)
            } else {
                throw new Error(data.message || 'Error saving preferences');
            }
        } catch (err) {
            toast.error(err.message || 'Preferences not saved. Please try again.');
        }}else{
            toast.error('Preffered Start time OR Break time is greater than End Time');
        }
    };


    return (
        <>
            <div class="container">
                <h2 class="my-4">Skoop Appointment Setup</h2>
                
                <div className="card">
                    <div className="card-header bg-secondary card-header-custom">
                        <h6 className="mb-0 text-white">Please add your appointments scheduling preferences for skoop Calendar</h6>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="preferredStartTime" className="form-label">
                                    Preferred Start Time*
                                </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="preferredStartTime"
                                    name="preferredStartTime"
                                    value={values.preferredStartTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="breakStartTime" className="form-label">
                                    Break Start Time*
                                </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="breakStartTime"
                                    name="breakStartTime"
                                    value={values.breakStartTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="breakEndTime" className="form-label">
                                    Break End Time*
                                </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="breakEndTime"
                                    name="breakEndTime"
                                    value={values.breakEndTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="preferredEndTime" className="form-label">
                                    Preferred End Time*
                                </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="preferredEndTime"
                                    name="preferredEndTime"
                                    value={values.preferredEndTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="timeZone" className="form-label">
                                    Time Zone*
                                </label>
                                <select
                                    className="form-select"
                                    id="timezone"
                                    name="timeZone"
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
                                <label htmlFor="additionalDetails" className="form-label">
                                    Additional Details
                                </label>
                                <textarea
                                    className="form-control"
                                    id="additionalDetails"
                                    name="additionalDetails"
                                    value={values.additionalDetails}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>
                        <p>You can add update these from the account settings anytime.</p>
                        <p>
                    Connect your calendar to auto-check for busy times and add new events as they
                    are scheduled.
                </p>
                        <div class="list-group">
                            <div
                           
                                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            >
                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        checked={google}
                                        onChange={() => {setGoogle(!google);setMicrosoft(false)}}
                                        id="google"
                                    ></input>
                                    <label class="form-check-label" for="google">
                                        <FcGoogle />
                                        <h5 class="mb-1">Google Calendar</h5>
                                    </label>
                                </div>
                            </div>
                            <div
                                // onClick={() => calendarSync('microsoft')}
                                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            >
                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        checked={microsoft}
                                        onChange={() => {setMicrosoft(!microsoft);setGoogle(false)}}
                                        id="microsoft"
                                    ></input>
                                    <label class="form-check-label" for="microsoft">
                                    <FaMicrosoft />
                                <h5 class="mb-1">Outlook Calendar</h5>
                                    </label>
                                </div>                               
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                <IoCheckmarkDoneSharp /> Save Preferences
                            </button>
                        </div>
                        <div onClick={() => {setNewUser(false);navigateToPage('Home')}} class="btn btn-link mt-4">
                            Continue without Skoop Appointment booking System 
                            <p>You can add your calendar link for from account setting.</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CalendarSync;
