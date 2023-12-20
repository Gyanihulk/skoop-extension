import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiLogoGmail } from "react-icons/bi";
import { AiFillPhone } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import API_ENDPOINTS from '../apiConfig';
import Scrape from '../Scraper';
import { FaAddressBook } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

const ContactInfoCard = () => {
  const [email1, setEmail1] = useState('');
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
      console.log("the response from backend",response)
      if(!response.ok) throw Error("")
      alert("Contact saved successfully");
    } catch (err) {
      console.log("the error in saving contact info",err);
      alert("An error occurred while saving contact info. Please try again.");
    }
  };

  const getProfileDetails=async()=>{
    var linkedIn_url='';
    try{
      const scrapedInfo = await Scrape("ProfilePage");
      setProfileName(scrapedInfo[0]);
      setProfileImage(scrapedInfo[1]);
      setProfileDesc(scrapedInfo[2]);
      setlinkedin(scrapedInfo[3]);
      setProfileAddress(scrapedInfo[4]);
      linkedIn_url=scrapedInfo[3];
    }catch(err){
      console.log("error fetching scraped info from profile page")
    }
    try{
      const scrapedInfo = await Scrape("ContactInfoOverlay");
      console.log("the scraped info from overlay",scrapedInfo);
      setEmail1(scrapedInfo[0]);
      setWebsite1(scrapedInfo[1]);
      setPhone2(scrapedInfo[3]);
      setlinkedin(scrapedInfo[4]);
      linkedIn_url=scrapedInfo[4];
    }catch(err){
      console.log("could not scrape from overlay",err);
    }
    if(linkedIn_url==null || linkedIn_url=='' ){
      return 
    }
    try{
      var contactDetails=await fetch(API_ENDPOINTS.skoopCrmGetAllData+"?"
      +new URLSearchParams({ linkedIn_url: linkedIn_url })
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
  }, [refresh]);

  const handleInputChange = (e) => {
    setNotes(e.target.value);
    e.target.style.height = 'auto'; 
    e.target.style.height = e.target.scrollHeight + 'px'; 
  };

  return (
<div className="container py-5 contact-container">
      <div className="row justify-content-center">
        <div className="col">
          <h3 className="mb-3 Section-heading">Contact Info: {profileName}</h3>
          <p className="mb-4 blue-text">
            Extract Contact Information from Profiles
            <button
              type="button"
              className="btn btn-primary refresh-button"
              onClick={() => setRefresh(!refresh)}
            >
              Refresh
            </button>
          </p>

          {/* Row 1 */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <BiLogoGmail />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E-mail "
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaRegUserCircle />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaLinkedin />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Linkedin"
                  value={linkedin}
                  onChange={(e) => setlinkedin(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <AiFillPhone />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone number"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <CgWebsite />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Website URL "
                  value={website1}
                  onChange={(e) => setWebsite1(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaAddressBook />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Description and Notes */}
          <div className="form-outline mb-4">
            <h4 className="mb-3 Section-heading">Description</h4>
            <textarea
              type="text"
              className="form-control"
              rows="3"
              placeholder="Profile description"
              value={profileDesc}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-outline mb-4">
            <h4 className="mb-3 Section-heading">Notes</h4>
            <textarea
              type="text"
              className="form-control"
              rows="3"
              placeholder="Enter your notes here..."
              value={notes}
              onChange={handleInputChange}
            />
          </div>

          {/* Save Button */}
          <div className="d-flex justify-content-end pt-3 gap-2">
              <button
                type="button"
                className="btn btn-primary chatgpt-button"
                onClick={handleSave}
              >
                {profileId !== null ? 'Update' : 'Save'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard;

