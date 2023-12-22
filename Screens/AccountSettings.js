import React, { useCallback, useState ,useEffect } from 'react';
import { TbUserEdit } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import { IoCheckmarkDoneSharp, IoArrowBack, IoClose } from "react-icons/io5";
import API_ENDPOINTS from '../components/apiConfig'

const AccountProfile = ({ userData }) => (
  <div className="card" style={{ border: '2px solid grey' }}>
  <div className="card-body">
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <img
          src="https://nextbootstrap.netlify.app/assets/images/profiles/1.jpg"
          className="rounded-circle"
          style={{ height: '80px', width: '80px', marginRight: '5px' }}
        />
        <div>
          <h4 className="card-title">{userData.fullName}</h4>
          <h6 className="card-text text-secondary">{userData.username}</h6>
        </div>
      </div>
      <div>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
        />
        <label htmlFor="contained-button-file">
          <button className="btn btn-link" startIcon={<TbUserEdit/>}>
            Change Picture
          </button>
        </label>
      </div>
    </div>
  </div>
</div>

);

const AccountProfileDetails = ({  userData,onUpdateProfile }) => {
  
  const [values, setValues] = useState({})
  const [isEditable, setIsEditable] = useState(false);

  useEffect(()=>{
    setValues(userData);
  },[userData])

  const handleChange = (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
  }

  const handleSubmit=async(event)=>{
    event.preventDefault();
    
    try{
      var res=await fetch(API_ENDPOINTS.updateUserDetails,{
        method: "PATCH",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName
        })
      })
      if(!res.ok) throw Error("")
      setIsEditable(false)
    }catch(err){
      alert("some error occurred")
    }
  }

  return (
    
  <div className="card" style={{ border: '1px solid grey' }}>
    <div className="card-header bg-secondary" style={{ borderBottom: '0' }}>
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0 text-white">Profile Details</h6>
        <button
          className="btn btn-link text-white"
          aria-label="edit"
          onClick={() => { setIsEditable(!isEditable) }}
        >
          <FaRegEdit />
        </button>
      </div>
    </div>
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
    <div className="card-body">
      <div className="container">
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
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
            <label htmlFor="email" className="form-label">Email Address</label>
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
        disabled={!isEditable}
      >
        <IoCheckmarkDoneSharp/> Save Changes
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
    oldPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event)=>{
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event)=>{
    event.preventDefault();
    if(values.password!==values.confirm){
      alert("confirm password and entered password do not match");
      return ;
    }
    try{
      const res=await fetch(API_ENDPOINTS.changePassword,{
        method: "PATCH",
        body: JSON.stringify({
          "oldPassword": values.oldPassword,
          "newPassword": values.password
        }),
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      if(res.ok){
        alert("update complete")
        setValues({
          password: '',
          confirm: '',
          oldPassword: ''
        })
      }
      else throw "error in the database"
    }catch(err){
      alert("some error occured during update");
    }
  }

  return (
    
    <div className="card">
      <div className="card-header bg-secondary" style={{ borderBottom: '0' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 text-white">Change Password</h6>
          
        </div>
      </div>
      <form onSubmit={handleSubmit}>
      <div className="card-body">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label htmlFor="oldPassword" className="form-label">Current Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="oldPassword"
                name="oldPassword"
                onChange={handleChange}
                value={values.oldPassword}
                placeholder="Current Password"
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                onChange={handleChange}
                value={values.password}
                placeholder="New Password"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label htmlFor="confirm" className="form-label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="confirm"
                name="confirm"
                onChange={handleChange}
                value={values.confirm}
                placeholder="Confirm Password"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end">
        <button
          type="submit"
          className="btn btn-primary"
        >
          <IoCheckmarkDoneSharp /> Update Password
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

  const getProfileDetails=async ()=>{
    try{
      var response=await fetch(API_ENDPOINTS.profileDetails,{
        method: "GET",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      response=await response.json()
      const fullName=response.fullName.split(' ')
      response.firstName=fullName[0]
      response.lastName=fullName[1]
      setProfileData(response)
      return response
    }catch(err){
      console.log("could not get profile details",err)
    }
  }

  useEffect(()=>{
    (async () => {
      await getProfileDetails();
   })();
  },[])


  return (
    <>
      <div className="container-fluid mt-2 p-2">
        <div>
          <AccountProfile userData={profileData} />
        </div>
        <div className="mt-1">
          <AccountProfileDetails
            userData={profileData}
            onUpdateProfile={handleProfileUpdate}
          />
        </div>
        <div className="mt-2">
          <SettingsPassword />
        </div>
        <div className="mt-2"></div>
        <div className="d-flex justify-content-center align-items-center flex-grow-1"></div>
        <div className="mt-2"></div>
      </div>
  </>
  );
}

export default AccountSettings;