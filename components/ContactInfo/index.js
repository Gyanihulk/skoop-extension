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
import toast from 'react-hot-toast';

const ContactInfoCard = () => {
  const [email, setEmail] = useState('');
  const [linkedin, setlinkedin] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileImage,setProfileImage]=useState('');
  const [profileDesc,setProfileDesc]=useState('');
  const [profileAddress,setProfileAddress]=useState('');
  const [refresh,setRefresh]=useState(0);
  const [profileId,setProfileId]=useState(null);

  const handleSave = async () => {
    try {
      const toastId=toast.loading("saving...");
      const response=await fetch(API_ENDPOINTS.CrmAddContactInfo, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          personal_email: email,
          name: profileName,
          linkedIn_url: linkedin,
          website_url: website,
          image: profileImage,
          profile_desc: profileDesc,
          address: profileAddress,
          id: profileId,
          notes: notes
        })
      });

      if(!response.ok) throw Error("")
      toast.success("saved successfully",{id: toastId});
    } catch (err) {
      console.log("the error in saving contact info",err);
      toast.dismiss();
      toast.error("some error occured")
    }
  };

  const cleanTheSlate=()=>{
    setEmail('');
    setlinkedin('');
    setPhone('');
    setWebsite('');
    setNotes('');
    setProfileName('');
    setProfileImage('');
    setProfileDesc('');
    setProfileAddress('');
    setProfileId(null);
  }

  const getProfileDetails=async()=>{
    
    cleanTheSlate();
    var linkedIn_url='';
    var scrapedInfo1;
    var scrapedInfo2;
    try{
      scrapedInfo1 = await Scrape("ProfilePage");
      scrapedInfo1=scrapedInfo1.map(item=>{
        return item.replace(/[^\x00-\x7F]/g, '');
      })
    }catch(err){
      console.log("error fetching scraped info from profile page")
    }
    try{
      scrapedInfo2 = await Scrape("ContactInfoOverlay");
      scrapedInfo2=scrapedInfo2.map(item=>{
        return item.replace(/[^\x00-\x7F]/g, '');
      })
    }catch(err){
      console.log("could not scrape from overlay",err);
    }

    linkedIn_url = scrapedInfo1[3] || scrapedInfo2[4];

    if((linkedIn_url==null || linkedIn_url=='')==false){
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
  
        if(contactDetails.length>0){
          const person=contactDetails[0];
          setProfileName(person.name);
          setEmail(person.personal_email);
          setWebsite(person.website_url);
          setProfileDesc(person.profile_desc);
          setProfileAddress(person.address);
          setProfileId(person.id);
        }
      }catch(err){
        console.log("could not fetch contact info details",err)
      }
    }
    

    // lastest scraped info
    setProfileName(scrapedInfo1[0]);
    setProfileImage(scrapedInfo1[1]);
    setProfileDesc(scrapedInfo1[2]);
    setlinkedin(scrapedInfo1[3]);
    setProfileAddress(scrapedInfo1[4]);
    setEmail(scrapedInfo2[0]);
    setWebsite(scrapedInfo2[1]);
    setPhone(scrapedInfo2[3]);
    setlinkedin(scrapedInfo2[4]);
  }

  useEffect(()=>{
   setRefresh(!refresh);
  },[])

  useEffect(() => {
    // Pre-Fill details if available
    (async () => {
      await getProfileDetails();
    })();

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
          <p className="mb-4 blue-text d-flex align-items-center">
            Extract Contact Information from Profiles
           
          </p>

          {/* Row 1 */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <BiLogoGmail />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E-mail "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
          <div className="row mb-3">
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
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <AiFillPhone />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <CgWebsite />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Website URL "
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
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
          <div className="form-outline">
            <h5 className="mb-2 Section-heading">Description</h5>
            <textarea
              type="text"
              className="form-control"
              rows="3"
              placeholder="Profile description"
              value={profileDesc}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-outline">
            <h5 className="mb-2 Section-heading">Notes</h5>
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
          <div className="d-flex justify-content-end pt-3">
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

