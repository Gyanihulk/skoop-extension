import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiLogoGmail } from "react-icons/bi";
import { AiFillPhone } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import API_ENDPOINTS from "../apiConfig";
import Scrape from "../Scraper";
import { FaAddressBook } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import GlobalStatesContext from "../../contexts/GlobalStates";
import CustomInputBox from "../Auth/CustomInputBox";

const ContactInfoCard = () => {
  const [email, setEmail] = useState("");
  const [linkedin, setlinkedin] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileDesc, setProfileDesc] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [profileId, setProfileId] = useState(null);

  const handleSave = async () => {
    try {
      const toastId = toast.loading("saving...");
      const response = await fetch(API_ENDPOINTS.CrmAddContactInfo, {
        method: "POST",
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
          "Content-type": "application/json; charset=UTF-8",
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
          notes: notes,
        }),
      });

      if (!response.ok) throw Error("");
      toast.success("saved successfully", { id: toastId });
    } catch (err) {
      toast.dismiss();
      toast.error("some error occured");
    }
  };

  const cleanTheSlate = () => {
    setEmail("");
    setlinkedin("");
    setPhone("");
    setWebsite("");
    setNotes("");
    setProfileName("");
    setProfileImage("");
    setProfileDesc("");
    setProfileAddress("");
    setProfileId(null);
  };

  const getProfileDetails = async () => {
    cleanTheSlate();
    var linkedIn_url = "";
    var scrapedInfo1;
    var scrapedInfo2;
    try {
      scrapedInfo1 = await Scrape("ProfilePage");
      scrapedInfo1 = scrapedInfo1.map((item) => {
        return item.replace(/[^\x00-\x7F]/g, "");
      });
    } catch (err) {
      console.log("error fetching scraped info from profile page");
    }
    try {
      scrapedInfo2 = await Scrape("ContactInfoOverlay");
      scrapedInfo2 = scrapedInfo2.map((item) => {
        return item.replace(/[^\x00-\x7F]/g, "");
      });
    } catch (err) {
      console.log("could not scrape from overlay", err);
    }

    linkedIn_url = scrapedInfo1[3] || scrapedInfo2[4];

    if ((linkedIn_url == null || linkedIn_url == "") == false) {
      try {
        var contactDetails = await fetch(
          API_ENDPOINTS.skoopCrmGetAllData +
            "?" +
            new URLSearchParams({ linkedIn_url: linkedIn_url }),
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${JSON.parse(
                localStorage.getItem("accessToken")
              )}`,
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        contactDetails = await contactDetails.json();

        if (contactDetails.length > 0) {
          const person = contactDetails[0];
          setProfileName(person.name);
          setEmail(person.personal_email);
          setWebsite(person.website_url);
          setProfileDesc(person.profile_desc);
          setProfileAddress(person.address);
          setProfileId(person.id);
        }
      } catch (err) {
        console.log("could not fetch contact info details", err);
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
  };
  const { scraperPage, isProfilePage } = useContext(GlobalStatesContext);
  useEffect(() => {
    setRefresh(!refresh);
  }, [scraperPage, isProfilePage]);

  useEffect(() => {
    (async () => {
      await getProfileDetails();
    })();
  }, [refresh]);

  const handleInputChange = (e) => {
    setNotes(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="container pt-2 pb-3 contact-container px-4">
      <div className="justify-content-center">
        <div className="contact-info-head">
          <h3>Contact Info: {profileName}</h3>
          <p>Extract Contact Information from Profiles</p>

          <div>
            <CustomInputBox
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CustomInputBox
              type="text"
              placeholder="Full name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <CustomInputBox
              type="text"
              placeholder="Profile Link"
              value={linkedin}
              onChange={(e) => setlinkedin(e.target.value)}
            />
            <CustomInputBox
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <CustomInputBox
              type="text"
              placeholder="Address"
              value={profileAddress}
              onChange={(e) => setProfileAddress(e.target.value)}
            />
            <CustomInputBox
              type="text"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <textarea
              className="mt-3 contact-info-custom-textarea"
              rows="4"
              placeholder="Additional Info"
              value={profileDesc}
              onChange={(e) => setProfileDesc(e.target.value)}
            />

            <CustomInputBox
              type="text"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              type="button"
              className="contact-info-save-btn"
              onClick={handleSave}
            >
              {profileId !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard;
