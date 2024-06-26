import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BiLogoGmail } from 'react-icons/bi'
import { AiFillPhone } from 'react-icons/ai'
import { FaLinkedin } from 'react-icons/fa'
import { CgWebsite } from 'react-icons/cg'
import API_ENDPOINTS from '../apiConfig'
import Scrape from '../Scraper'
import { FaAddressBook } from 'react-icons/fa'
import { FaRegUserCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import GlobalStatesContext from '../../contexts/GlobalStates'
import CustomInputBox from '../Auth/CustomInputBox'

const ContactInfoCard = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [email, setEmail] = useState('')
  const [linkedin, setlinkedin] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [notes, setNotes] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [profileDesc, setProfileDesc] = useState('')
  const [profileAddress, setProfileAddress] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [profileId, setProfileId] = useState(null)
  const [linkedInId, setlinkedinId] = useState('')
  const [newContactProfile, setNewContactProfile] = useState(null)
  const [contactProfileImage, setContactProfileImage] = useState('https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-1023x1024-bve9uom6.png')
  const [contactProfileName, setContactProfileName] = useState('')

  const addpathToProfileImage = (path) => {
    if (path) {
      setContactProfileImage(API_ENDPOINTS.backendUrl + '/' + path)
    }
  }

  const initializeState = (contactInfo) => {
    setProfileName(contactInfo.name)
    setEmail(contactInfo.personal_email)
    setWebsite(contactInfo.website_url)
    setProfileDesc(contactInfo.profile_desc)
    setProfileAddress(contactInfo.address)
    setProfileId(contactInfo.id)
    setlinkedinId(contactInfo.linkedin_id)
    setNewContactProfile(contactInfo.id)
    setPhone(contactInfo.phone_number)
    setContactProfileName(contactInfo.name)
    addpathToProfileImage(contactInfo.image)
  }

  const handleSave = async () => {
    try {
      const toastId = toast.loading('saving...')
      let bodyData
      let blob
      if (profileImage && !newContactProfile) {
        try {
          let imageResponse = await fetch(profileImage)
          blob = await imageResponse.blob()
        } catch (error) {
          console.log('error while fetching image', error)
        }

        bodyData = new FormData()
        bodyData.append('personal_email', email)
        bodyData.append('name', profileName)
        bodyData.append('linkedIn_url', linkedin)
        bodyData.append('website_url', website)
        bodyData.append('profile_desc', profileDesc)
        bodyData.append('address', profileAddress)
        bodyData.append('notes', notes)
        bodyData.append('linkedin_id', linkedInId)
        bodyData.append('phone_number', phone)
        bodyData.append('profile_contact_image', blob, `${linkedInId}.jpg`)
      } else {
        bodyData = JSON.stringify({
          personal_email: email,
          name: profileName,
          linkedIn_url: linkedin,
          website_url: website,
          profile_desc: profileDesc,
          address: profileAddress,
          notes: notes,
          linkedin_id: linkedInId,
          phone_number: phone,
        })
      }

      let response
      if (!newContactProfile) {
        response = await fetch(API_ENDPOINTS.CrmAddContactInfo, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          },
          body: bodyData,
        })
      } else {
        response = await fetch(API_ENDPOINTS.CrmAddContactInfo + `/${newContactProfile}`, {
          method: 'PUT',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
          body: bodyData,
        })
      }

      if (!response.ok) throw Error('')
      const responseData = await response.json()
      initializeState(responseData.data)

      if (!newContactProfile) {
        toast.success('Profile details saved.', { id: toastId })
      } else {
        toast.success('Profile details updated.', { id: toastId })
      }
    } catch (err) {
      console.log('error is ', err)
      toast.dismiss()
      toast.error('some error occured')
    }
  }

  const cleanTheSlate = () => {
    setEmail('')
    setlinkedin('')
    setPhone('')
    setWebsite('')
    setNotes('')
    setProfileName('')
    setProfileImage('')
    setProfileDesc('')
    setProfileAddress('')
    setProfileId(null)
  }

  const getProfileDetails = async () => {
    cleanTheSlate()
    var linkedIn_url = ''
    var profileInfo
    var contactOverlayInfo
    try {
      profileInfo = await Scrape('ProfilePage')
      profileInfo = profileInfo.map((item) => {
        return item.replace(/[^\x00-\x7F]/g, '')
      })
    } catch (err) {
      console.error('error fetching scraped info from profile page')
    }
    try {
      contactOverlayInfo = await Scrape('ContactInfoOverlay')
      contactOverlayInfo = contactOverlayInfo.map((item) => {
        return item.replace(/[^\x00-\x7F]/g, '')
      })
    } catch (err) {
      console.error('could not scrape from overlay', err)
    }

    linkedIn_url = profileInfo[3] || contactOverlayInfo[4]
    const regex = /https:\/\/www\.linkedin\.com\/in\/([^/?]+)/
    const match = linkedIn_url.match(regex)
    const linkedInProfileId = match ? match[1] : null
    var address = contactOverlayInfo[5] || profileInfo[4]
    setlinkedinId(linkedInProfileId)

    if ((linkedIn_url == null || linkedIn_url == '') == false) {
      let queryParams
      if (linkedInProfileId) {
        queryParams = { linkedin_id: linkedInProfileId }
      } else {
        queryParams = { linkedIn_url: linkedIn_url }
      }

      try {
        var contactDetails = await fetch(API_ENDPOINTS.skoopCrmGetAllData + '?' + new URLSearchParams(queryParams), {
          method: 'GET',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
        contactDetails = await contactDetails.json()

        if (contactDetails.length > 0) {
          const person = contactDetails[0]
          setProfileName(person.name)
          setEmail(person.personal_email)
          setWebsite(person.website_url)
          setProfileDesc(person.profile_desc)
          setProfileAddress(person.address)
          setProfileId(person.id)
          setlinkedinId(person.linkedin_id)
          setNewContactProfile(person.id)
          setPhone(person.phone_number)
          addpathToProfileImage(person.image)
          setContactProfileName(person.name)
        }
      } catch (err) {
        console.error('could not fetch contact info details', err)
      }
    }

    // lastest scraped info

    if (profileInfo) {
      if (profileInfo[0] && profileInfo[0].length > 0) {
        setProfileName(profileInfo[0])
        setContactProfileName(profileInfo[0])
      }
      if (profileInfo[1] && profileInfo[1].length > 0) {
        setProfileImage(profileInfo[1])
      }
      if (profileInfo[2] && profileInfo[2].length > 0) {
        setProfileDesc(profileInfo[2])
      }
      if (profileInfo[3] && profileInfo[3].length > 0) {
        setlinkedin(profileInfo[3])
      }
    }

    if (contactOverlayInfo) {
      if (contactOverlayInfo[0] && contactOverlayInfo[0].length > 0) {
        setEmail(contactOverlayInfo[0])
      }
      if (contactOverlayInfo[1] && contactOverlayInfo[1].length > 0) {
        setWebsite(contactOverlayInfo[1])
      }
      if (contactOverlayInfo[3] && contactOverlayInfo[3].length > 0) {
        setPhone(contactOverlayInfo[3])
      }
      if (contactOverlayInfo[4] && contactOverlayInfo[4].length > 0) {
        setlinkedin(contactOverlayInfo[4])
      }
    }

    if (!profileAddress) {
      setProfileAddress(address)
    }

    if (!linkedInId) {
      setlinkedinId(linkedInProfileId)
    }
  }
  const { scraperPage, isProfilePage } = useContext(GlobalStatesContext)
  useEffect(() => {
    setRefresh(!refresh)
  }, [scraperPage, isProfilePage])

  useEffect(() => {
    ;(async () => {
      await getProfileDetails()
    })()
  }, [refresh])

  const handleInputChange = (e) => {
    setNotes(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div className="container pt-2 pb-3 contact-container px-4">
      <div className="justify-content-center">
        <div className="contact-info-head">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-column">
              <h3>{contactProfileName}</h3>
              <p>Extract Contact Information from Profiles</p>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <img src={contactProfileImage} className="rounded-circle rounded-profile-image" alt="Profile" />
            </div>
          </div>

          <div>
            <CustomInputBox type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <CustomInputBox type="text" placeholder="Full name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            <CustomInputBox type="text" placeholder="Profile Link" value={linkedin} onChange={(e) => setlinkedin(e.target.value)} />
            <CustomInputBox type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <CustomInputBox type="text" placeholder="Address" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} />
            <CustomInputBox type="text" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <div className={`contact-info-custom-textarea-box ${isFocused ? 'focused' : ''} ${profileDesc ? 'filled' : ''}`}>
              <textarea className="contact-info-custom-textarea" rows="4" value={profileDesc} onChange={(e) => setProfileDesc(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
              <label>Additional Info</label>
            </div>

            <CustomInputBox type="text" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <button type="button" className="contact-info-save-btn" onClick={handleSave}>
              {profileId !== null ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfoCard
