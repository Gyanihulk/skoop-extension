import React, { useState, useEffect, useContext } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import API_ENDPOINTS from '../components/apiConfig';
import { toast } from 'react-hot-toast';
import { timezones } from '../lib/timezones';
import AuthContext from '../contexts/AuthContext';
const AccountProfile = ({ userData }) => {
    // State for the profile image URL
    const [profileImage, setProfileImage] = useState(
        'https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-1023x1024-bve9uom6.png'
    );
    useEffect(() => {
        if (userData.image_path) {
            setProfileImage(userData.image_path.startsWith("public") ?API_ENDPOINTS.backendUrl + '/' + userData.image_path:userData.image_path);
        }
    }, [ userData]);
    // Function to handle the file input change event
    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('profileImage', file);

            try {
                const res = await fetch(API_ENDPOINTS.updateProfileImage, {
                    method: 'PATCH',
                    body: formData, // Use FormData here
                    headers: {
                        authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                        // Remove 'Content-Type' header when using FormData
                    },
                });
                
                if (res.ok) {
                  const jsonResponse = await res.json(); 
                  setProfileImage(API_ENDPOINTS.backendUrl + '/' + jsonResponse.image_path); // Access image_path from JSON response
                  toast.success('Profile Image Updated');
                } else throw new Error('Error in the database');
            } catch (err) {
                toast.error('Profile Image Not Updated, try Again');
            }
        }
    };

    // Function to trigger the file input when the image is clicked
    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className="card card-with-border">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <img
                            src={
                                 profileImage
                            }
                            className="rounded-circle rounded-circle-custom"
                            onClick={triggerFileInput}
                            alt="Profile"
                        />
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <div>
                            <h4 className="card-title">{userData.full_name}</h4>
                            <h6 className="card-text text-secondary">{userData.email}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccountProfileDetails = ({ userData, onUpdateProfile }) => {
    const [values, setValues] = useState({});
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        setValues(userData);
    }, [userData]);

    const handleChange = (event) => {
        setValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            var res = await fetch(API_ENDPOINTS.updateUserDetails, {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                }),
            });
            if (!res.ok) throw Error('');
            const updatedData = await res.json();
            console.log('API response:', updatedData);
            onUpdateProfile(values); // Update parent component's state
            toast.success('Details updated successfully');
            setIsEditable(false);
        } catch (err) {
            toast.error('Some error occurred');
        }
    };

    return (
        <div className="card card-with-border">
            <div className="card-header bg-secondary card-header-custom">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-white">Profile Details</h6>
                    <button
                        className="btn btn-link text-white"
                        aria-label="edit"
                        onClick={() => {
                            setIsEditable(!isEditable);
                        }}
                    >
                        <FaRegEdit />
                    </button>
                </div>
            </div>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="firstName" className="form-label">
                                    First Name*
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    required
                                />
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="lastName" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={values.username}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        //disabled={!isEditable}
                    >
                        <IoCheckmarkDoneSharp /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

const SettingsPassword = () => {
    const [values, setValues] = useState({
        password: '',
        confirm: '',
        oldPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        setValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (values.password !== values.confirm) {
            toast.error('New password doesnt match.');
            return;
        }
        try {
            const res = await fetch(API_ENDPOINTS.changePassword, {
                method: 'PATCH',
                body: JSON.stringify({
                    oldPassword: values.oldPassword,
                    newPassword: values.password,
                }),
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (res.ok) {
                toast.success('Password Changed');
                setValues({
                    password: '',
                    confirm: '',
                    oldPassword: '',
                });
            } else throw 'error in the database';
        } catch (err) {
            toast.error('Password Not Updated, try Again');
        }
    };

    return (
        <div className="card">
            <div className="card-header bg-secondary card-header-custom">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-white">Change Password</h6>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="oldPassword" className="form-label">
                                    Current Password*
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="oldPassword"
                                    name="oldPassword"
                                    onChange={handleChange}
                                    value={values.oldPassword}
                                    placeholder="Current Password"
                                    required
                                />
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="password" className="form-label">
                                    New Password*
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    value={values.password}
                                    placeholder="New Password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="confirm" className="form-label">
                                    Confirm Password*
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="confirm"
                                    name="confirm"
                                    onChange={handleChange}
                                    value={values.confirm}
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        <IoCheckmarkDoneSharp /> Update Password
                    </button>
                </div>
            </form>
        </div>
    );
};

const UserPreferencesForm = () => {
    const [values, setValues] = useState({
        preferredStartTime: '',
        preferredEndTime: '',
        timeZone: '',
        additionalDetails: ''
    });
    const [userTimezone, setUserTimezone] = useState('');

    useEffect(() => {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(detectedTimezone);
        
    }, []);
    const handleChange = (event) => {
        setValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(API_ENDPOINTS.userPreferences, {
                method: 'POST',
                body: JSON.stringify({
                    preferred_start_time: values.preferredStartTime,
                    preferred_end_time: values.preferredEndTime,
                    time_zone: values.timeZone,
                    additional_details: values.additionalDetails
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Preferences saved successfully');
                setValues({
                    email: '',
                    preferredStartTime: '',
                    preferredEndTime: '',
                    timeZone: '',
                    additionalDetails: ''
                });
            } else {
                throw new Error(data.message || 'Error saving preferences');
            }
        } catch (err) {
            toast.error(err.message || 'Preferences not saved. Please try again.');
        }
    };

    return (
        <div className="card">
            <div className="card-header bg-secondary card-header-custom">
                <h6 className="mb-0 text-white">User Preferences</h6>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="preferredStartTime" className="form-label">Preferred Start Time*</label>
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
                        <label htmlFor="preferredEndTime" className="form-label">Preferred End Time*</label>
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
                        <label htmlFor="timeZone" className="form-label">Time Zone*</label>
                        <select
                            className="form-select"
                            id="timezone"
                            name="timeZone"
                            value={values.timeZone}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Timezone</option>
                            {timezones.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="additionalDetails" className="form-label">Additional Details</label>
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
                <div className="card-footer d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        <IoCheckmarkDoneSharp /> Save Preferences
                    </button>
                </div>
            </form>
        </div>
    );
};

const CalendarUrlForm = () => {
    const [calendarUrl, setCalendarUrl] = useState('');
    const { getCalendarUrl } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            try {
                const url = await getCalendarUrl();
                setCalendarUrl(url);
            } catch (error) {
                toast.error('Failed to retrieve calendar URL.');
            }
        })();
    }, []);

    const handleChange = (event) => {
        setCalendarUrl(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(API_ENDPOINTS.updateCalendarUrl, { // Replace with your API endpoint
                method: 'POST',
                body: JSON.stringify({ calendarUrl }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                },
            });
            const data = await res.text();
            if (res.ok) {
                toast.success('Calendar link updated successfully');
            } else {
                throw new Error(data.message || 'Error saving calendar URL');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to update calendar link. Please try again.');
        }
    };

    return (
        <div className="card">
            <div className="card-header bg-secondary card-header-custom">
                <h6 className="mb-0 text-white">Appointment booking link</h6>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="calendarUrl" className="form-label">Your Appointment Booking Link</label>
                        <input
                            type="text"
                            className="form-control"
                            id="calendarUrl"
                            name="calendarUrl"
                            value={calendarUrl}
                            onChange={handleChange}
                            placeholder="Enter your calendar link"
                            required
                        />
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        <IoCheckmarkDoneSharp /> Save 
                    </button>
                </div>
            </form>
        </div>
    );
};



function AccountSettings(props) {
    const [profileData, setProfileData] = useState({});

    const handleProfileUpdate = (newProfileData) => {
        setProfileData((prevData) => ({
            ...prevData,
            ...newProfileData,
        }));
    };

    const getProfileDetails = async () => {
        try {
            var response = await fetch(API_ENDPOINTS.profileDetails, {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            response = await response.json();
            const fullName = response.full_name.split(' ');
            response.firstName = fullName[0];
            response.lastName = fullName[1];
            setProfileData(response);
            return response;
        } catch (err) {
            console.log('could not get profile details', err);
        }
    };

    useEffect(() => {
        (async () => {
            await getProfileDetails();
        })();
    }, []);

    return (
        <>
            <div className="container-fluid mt-2 p-2">
                <div>
                    <AccountProfile userData={profileData} />
                </div>
                {/* <div className="mt-1">
          <AccountProfileDetails
            userData={profileData}
            onUpdateProfile={handleProfileUpdate}
          />
        </div> */}
                <div className="mt-2">
                    <CalendarUrlForm />
                </div>
                <div className="mt-2">
                    <SettingsPassword />
                </div>

                <div className="mt-2">
                    <UserPreferencesForm/>
                </div>
                <div className="d-flex justify-content-center align-items-center flex-grow-1"></div>
                <div className="mt-2"></div>
            </div>
        </>
    );
}

export default AccountSettings;
