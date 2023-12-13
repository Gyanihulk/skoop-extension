import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiLogoGmail } from "react-icons/bi";
import { AiFillPhone } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import API_ENDPOINTS from './apiConfig.js';
import Scrape from './Scrape';
import { FaAddressBook } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

const ContactInfoCard = () => {
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [linkedin, setlinkedin] = useState('');
  const [phone2, setPhone2] = useState('');
  const [website1, setWebsite1] = useState('');
  const [notes, setNotes] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileImage,setProfileImage]=useState('');
  const [profileDesc,setProfileDesc]=useState('');
  const [profileAddress,setProfileAddress]=useState('');
  const [refresh,setRefresh]=useState(0);
  const [profileId,setProfileId]=useState(null);

  const handleSave = async () => {
    try {
      const response=await fetch(API_ENDPOINTS.CrmAddContactInfo, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          personal_email: email1,
          name: profileName,
          linkedIn_url: linkedin,
          website_url: website1,
          image: profileImage,
          profile_desc: profileDesc,
          address: profileAddress,
          id: profileId,
          notes: notes
        })
      });
      if(!response.ok) throw Error("")
      alert("Contact saved successfully");
    } catch (err) {
      alert("An error occurred while saving contact info. Please try again.");
    }
  };

  const getProfileDetails=async()=>{
    
    try{
      var contactDetails=await fetch(API_ENDPOINTS.skoopCrmGetAllData+"?"
      +new URLSearchParams({ linkedIn_url: window.location.href })
        ,{
        method: "GET",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      contactDetails=await contactDetails.json();
      console.log("the fetched contact details",contactDetails)
      if(contactDetails.length>0){
        const person=contactDetails[0];
        setProfileName(person.name);
        setEmail1(person.personal_email);
        setWebsite1(person.website_url);
        setProfileDesc(person.profile_desc);
        setProfileAddress(person.address);
        setProfileId(person.id);
      } 
    }catch(err){
      console.log("could not fetch contact info details",err)
    }
  }

  useEffect(()=>{
   setRefresh(!refresh);
  },[])

  useEffect(() => {
    // Pre-Fill details if available
    (async () => {
      await getProfileDetails();
    })();

    var ContactInfoLink = document.querySelector(
      'main > section:first-child > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > span:nth-child(2) > a'
    );
    if(ContactInfoLink==null){
      ContactInfoLink=document.querySelector('main > section:nth-child(2) > div:nth-child(2) > div:nth-child(2)>div:nth-child(3)>span:nth-child(2)>a')
    }
    
    if (ContactInfoLink) {
      console.log('Event listener added');
      ContactInfoLink.addEventListener('click', async function (event) {
        const profileData = await Scrape();
        
        setEmail1(profileData[2]);
        setProfileName(profileData[0]);
        setWebsite1(profileData[3]);
      });
    }
    setlinkedin(window.location.href)
    try{
      const name=document.querySelector('a>h1').innerText;
      setProfileName(name);
      const imgUrl=document.querySelector(`img[alt="${name}"]`).src;
      setProfileImage(imgUrl);
      const desc=document.querySelector('main > section:nth-child(1) > div:nth-child(2) > div:nth-child(2)>div>div:nth-child(2)').innerText;
      setProfileDesc(desc);
      var address='';
      try{
        address=document.querySelector('main>section>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>span').innerText
      }catch(error1){
        try{
          address=document.querySelector('main>section>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>span').innerText
        }catch(error2){}
      }
      setProfileAddress(address);
    }catch(err){}
  }, [refresh]);

  const handleInputChange = (e) => {
    setNotes(e.target.value);
    e.target.style.height = 'auto'; 
    e.target.style.height = e.target.scrollHeight + 'px'; 
  };

  return (
    <div className="container py-5 h-100" style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', height: '300px', width: '92%' }}>
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col">
            <h3 className="mb-3 Section-heading ">Contact Info: {profileName}</h3>
            <p className="mb-4 blue-text">Extract Contact Information from Profiles  
            <Button style={{ fontSize: '14px', marginLeft:'30px' }} variant="primary" onClick={()=>setRefresh(!refresh)}>
                Refresh
              </Button>
              </p>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <div className="input-group">
                    <span className="input-group-text"><BiLogoGmail /></span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="E-mail 1"
                      value={email1}
                      onChange={(e) => setEmail1(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <div className="input-group">
                    <span className="input-group-text"><FaRegUserCircle /></span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <div className="input-group">
                    <span className="input-group-text"><FaLinkedin /></span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Linkedin"
                      value={linkedin}
                      onChange={(e) => setlinkedin(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <div className="input-group">
                    <span className="input-group-text"><AiFillPhone /></span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Phone number"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-outline mb-4">
              <div className="input-group">
                <span className="input-group-text"><CgWebsite /></span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Website URL 1"
                  value={website1}
                  onChange={(e) => setWebsite1(e.target.value)}
                />
              </div>
            </div>

            <div className="form-outline mb-4">
              <div className="input-group">
                <span className="input-group-text"><FaAddressBook /></span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Address"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="form-outline mb-4">
              <h4 className="mb-3 Section-heading">Description</h4>
              <input
                type="text"
                aria-multiline
                aria-rowcount={5}
                className="form-control"
                style={{
                  resize: 'none',
                  height: '5rem', 
                }}
                placeholder="Profile description"
                value={profileDesc}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-outline mb-4">
              <h4 className="mb-3 Section-heading">Notes</h4>
              <input
                type="text"
                aria-multiline
                aria-rowcount={5}
                className="form-control"
                style={{
                  resize: 'none',
                  height: '5rem', 
                }}
                placeholder="Enter your notes here..."
                value={notes}
                onChange={handleInputChange}
              />
            </div>
            <div className="d-flex justify-content-end pt-3 gap-2">
              <Button style={{ fontSize: '14px' }} variant="primary" onClick={handleSave}>
                {profileId!=null ? 'Update': 'Save'}
              </Button>
        </div>
      </div>
    </div>
  </div>
);
};

export default ContactInfoCard;

