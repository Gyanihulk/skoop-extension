import React, { useState, useEffect, useContext} from "react";
import {FaAngleDown, FaArrowLeft } from "react-icons/fa";
import API_ENDPOINTS from "../components/apiConfig";
import UserPreferencesForm from "../components/UserPreferencesForm";
import { toast } from "react-hot-toast";
import AuthContext from "../contexts/AuthContext";
const AccountProfile = ({ userData }) => {
  // State for the profile image URL
  const [profileImage, setProfileImage] = useState(
    "https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-1023x1024-bve9uom6.png"
  );
  useEffect(() => {
    if (userData.image_path) {
      setProfileImage(
        userData.image_path.startsWith("public")
          ? API_ENDPOINTS.backendUrl + "/" + userData.image_path
          : userData.image_path
      );
    }
  }, [userData]);
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
      formData.append("profileImage", file);

      try {
        const res = await fetch(API_ENDPOINTS.updateProfileImage, {
          method: "PATCH",
          body: formData, // Use FormData here
          headers: {
            authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accessToken")
            )}`,
            // Remove 'Content-Type' header when using FormData
          },
        });

        if (res.ok) {
          const jsonResponse = await res.json();
          setProfileImage(
            API_ENDPOINTS.backendUrl + "/" + jsonResponse.image_path
          ); // Access image_path from JSON response
          toast.success("Profile Image Updated");
        } else throw new Error("Error in the database");
      } catch (err) {
        toast.error("Profile Image Not Updated, try Again");
      }
    }
  };

  // Function to trigger the file input when the image is clicked
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="lighter-pink border-bottom-light-pink p-3">
      <div className="card-body">
        <div className="d-flex flex-column">
          <div class="back-button d-flex align-items-center p-0-5" onClick={() => window.history.back()}>
            <div className="d-flex align-items-center">
              <FaArrowLeft size={16} />
            </div>
            <h4 className="profile-name mb-0 pb-0 ms-1">Back</h4>
          </div>
          <div className="d-flex align-items-end gap-3">
            <img
              src={profileImage}
              className="rounded-circle rounded-circle-custom"
              onClick={triggerFileInput}
              alt="Profile"
            />
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div>
              <h4 className="profile-name">{userData.full_name}</h4>
              <h6 className="profile-text-sm">{userData.email}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPassword = () => {
  const [values, setValues] = useState({
    password: "",
    confirm: "",
    oldPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);

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
      toast.error("New password doesnt match.");
      return;
    }
    try {
      const res = await fetch(API_ENDPOINTS.changePassword, {
        method: "PATCH",
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.password,
        }),
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (res.ok) {
        toast.success("Password Changed");
        setValues({
          password: "",
          confirm: "",
          oldPassword: "",
        });
      } else throw "error in the database";
    } catch (err) {
      toast.error("Password Not Updated, try Again");
    }
  };

  return (
    <div className="card border-radius-12 overflow-hidden">
      <div className="light-pink card-header-custom">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 card-title">Change Password</h6>
          <div
            onClick={() => setToggleInfo(!toggleInfo)}
            className="toggle-collapse"
            data-toggle="collapse"
            data-target="#change-password-collapse"
            aria-expanded="false"
            aria-controls="change-password-collapse"
          >
            <FaAngleDown
              style={toggleInfo ? { transform: "rotate(180deg)" } : ""}
            />
          </div>
        </div>
      </div>
      <div className={`collapse`} id="change-password-collapse">
        <form onSubmit={handleSubmit}>
          <div className="card-body p-0">
            <div className="px--1 py-4-2 mt-3">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
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
                  <input
                    type={showPassword ? "text" : "password"}
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
                <div className="col-sm-6">
                  <input
                    type={showPassword ? "text" : "password"}
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
              <div className="mt-4 d-flex justify-content-end">
                <button type="submit" className="card-btn">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const CalendarUrlForm = () => {
  const [calendarUrl, setCalendarUrl] = useState("");
  const [toggleInfo, setToggleInfo] = useState(false);
  const { getCalendarUrl } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const url = await getCalendarUrl();
        setCalendarUrl(url);
      } catch (error) {
        toast.error("Failed to retrieve calendar URL.");
      }
    })();
  }, []);

  const handleChange = (event) => {
    setCalendarUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(API_ENDPOINTS.updateCalendarUrl, {
        // Replace with your API endpoint
        method: "POST",
        body: JSON.stringify({ calendarUrl }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
        },
      });
      const data = await res.text();
      if (res.ok) {
        toast.success("Calendar link updated successfully");
      } else {
        throw new Error(data.message || "Error saving calendar URL");
      }
    } catch (err) {
      toast.error(
        err.message || "Failed to update calendar link. Please try again."
      );
    }
  };

  return (
    <div className="card border-radius-12 overflow-hidden">
      <div className="light-pink card-header-custom d-flex justify-content-between align-items-center">
        <h6 className="mb-0 card-title">Appointment booking link</h6>
        <div
          onClick={() => setToggleInfo(!toggleInfo)}
          className="toggle-collapse"
          data-toggle="collapse"
          data-target="#appointment-collapse"
          aria-expanded="false"
          aria-controls="appointment-collapse"
        >
          <FaAngleDown
            style={toggleInfo ? { transform: "rotate(180deg)" } : ""}
          />
        </div>
      </div>
      <div className="collapse" id="appointment-collapse">
        <form onSubmit={handleSubmit}>
          <div className="card-body p-0">
            <div className="py-4-2 px--1">
              <div>
                <label
                  htmlFor="calendarUrl"
                  className="form-label profile-text"
                >
                  Your Appointment Booking Link
                </label>
                <input
                  type="text"
                  className="form-control mt-3"
                  id="calendarUrl"
                  name="calendarUrl"
                  value={calendarUrl}
                  onChange={handleChange}
                  placeholder="Enter your calendar link"
                  required
                />
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button type="submit" className="card-btn">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
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
        method: "GET",
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      response = await response.json();
      const fullName = response.full_name.split(" ");
      response.firstName = fullName[0];
      response.lastName = fullName[1];
      setProfileData(response);
      return response;
    } catch (err) {
      console.log("could not get profile details", err);
    }
  };

  useEffect(() => {
    (async () => {
      await getProfileDetails();
    })();
  }, []);

  return (
    <>
      <div id="account-settings">
        <div>
          <AccountProfile userData={profileData} />
        </div>
        <div className="my-4-2 mx--1">
          <div>
            <CalendarUrlForm />
          </div>
          <div className="mt-3">
            <SettingsPassword />
          </div>

          <div className="mt-3">
            <UserPreferencesForm />
          </div>
          <div className="d-flex justify-content-center align-items-center flex-grow-1"></div>
          <div className="mt-2"></div>
        </div>
      </div>
    </>
  );
}

export default AccountSettings;
