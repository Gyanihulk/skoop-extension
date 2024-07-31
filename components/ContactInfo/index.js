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
import { removeUnsupportedCharacters } from '../../lib/helpers'

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
  const imagePath = 'https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-1023x1024-bve9uom6.png'
  const [contactProfileImage, setContactProfileImage] = useState(imagePath)
  const [contactProfileName, setContactProfileName] = useState('')
  const [profileContactDetails, setProfileContactDetails] = useState(null)
  const [contactOverlayDetails, setContactOverlayDetails] = useState(null)
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('')

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
    setNotes(contactInfo.notes)
  }

  const handleSave = async () => {
    try {
      const toastId = toast.loading('Saving...')

      if (phoneErrorMessage && phoneErrorMessage.length > 0) {
        toast.error(phoneErrorMessage, { id: toastId })
        return
      }

      let errorMessage = ''
      if (!profileName || profileName.trim().length === 0) {
        errorMessage = 'Name'
      }

      if (!linkedin || linkedin.trim().length === 0) {
        if (errorMessage.length > 0) {
          errorMessage = errorMessage + 'and LinkedIn URL'
        } else {
          errorMessage = 'LinkedIn URL'
        }
      }

      if (errorMessage.length > 0) {
        toast.error(`Please fill the required fields ${errorMessage}`, { id: toastId })
        toast.dismiss(toastId)
        return
      }

      let bodyData
      let blob
      let isFormData = false
      if (profileImage && !newContactProfile) {
        try {
          let imageResponse = await fetch(profileImage)
          blob = await imageResponse.blob()
        } catch (error) {
          console.error('error while fetching image', error)
        }

        bodyData = new FormData()
        bodyData.append('personal_email', email)
        bodyData.append('name', removeUnsupportedCharacters(profileName))
        bodyData.append('linkedIn_url', removeUnsupportedCharacters(linkedin))
        bodyData.append('website_url', removeUnsupportedCharacters(website))
        bodyData.append('profile_desc', removeUnsupportedCharacters(profileDesc))
        bodyData.append('address', removeUnsupportedCharacters(profileAddress))
        bodyData.append('notes', removeUnsupportedCharacters(notes))
        bodyData.append('linkedin_id', removeUnsupportedCharacters(linkedInId))
        bodyData.append('phone_number', removeUnsupportedCharacters(phone))
        bodyData.append('profile_contact_image', blob, `${linkedInId}.jpg`)
        isFormData = true
      } else {
        bodyData = JSON.stringify({
          personal_email: removeUnsupportedCharacters(email),
          name: removeUnsupportedCharacters(profileName),
          linkedIn_url: removeUnsupportedCharacters(linkedin),
          website_url: removeUnsupportedCharacters(website),
          profile_desc: removeUnsupportedCharacters(profileDesc),
          address: removeUnsupportedCharacters(profileAddress),
          notes: removeUnsupportedCharacters(notes),
          linkedin_id: removeUnsupportedCharacters(linkedInId),
          phone_number: removeUnsupportedCharacters(phone),
        })
        isFormData = false
      }

      let response
      if (!newContactProfile) {
        response = await fetch(API_ENDPOINTS.CrmAddContactInfo, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            ...(!isFormData ? { 'Content-Type': 'application/json; charset=UTF-8' } : {}),
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
      console.error('error is ', err)
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
    var contactDetails
    try {
      profileInfo = await Scrape('ProfilePage')
      contactOverlayInfo = await Scrape('ContactInfoOverlay')
    } catch (err) {
      setContactProfileName('')
      setContactProfileImage(imagePath)
      console.error('error fetching scraped info from profile page')
    }

    setContactOverlayDetails(contactOverlayInfo)
    setProfileContactDetails(profileInfo)

    linkedIn_url = profileInfo?.[3]?.length > 0 ? profileInfo[3] : contactOverlayInfo?.[4]?.length > 0 ? contactOverlayInfo[4] : null
    const regex = /https:\/\/www\.linkedin\.com\/in\/([^/?]+)/
    const match = linkedIn_url.match(regex)
    const linkedInProfileId = match ? match[1] : null
    var address = contactOverlayInfo?.[5]?.length > 0 ? contactOverlayInfo[5] : profileInfo?.[4]?.length > 0 ? profileInfo[4] : ''
    setlinkedinId(linkedInProfileId)

    if ((linkedIn_url == null || linkedIn_url == '') == false) {
      let queryParams
      if (linkedInProfileId) {
        queryParams = { linkedin_id: linkedInProfileId }
      } else {
        queryParams = { linkedIn_url: linkedIn_url }
      }

      try {
        contactDetails = await fetch(API_ENDPOINTS.skoopCrmGetAllData + '?' + new URLSearchParams(queryParams), {
          method: 'GET',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
        contactDetails = await contactDetails.json()

        if (contactDetails.length > 0) {
          const person = contactDetails[0]
          if (Object.keys(person).length > 0) {
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
            setlinkedin(person.linkedIn_url)
            setNotes(person.notes)
          }
        }
      } catch (err) {
        setContactProfileName('')
        setContactProfileImage(imagePath)
        console.error('could not fetch contact info details', err)
      }
    }

    const isContactInfoAvailable = contactDetails && contactDetails.length > 0 && Object.keys(contactDetails[0]).length > 0
    const contactInfoObject = isContactInfoAvailable ? contactDetails[0] : null

    if (!isContactInfoAvailable) {
      setNewContactProfile(null)
      if (profileInfo?.[1]?.length > 0 && profileInfo[1].includes('media.licdn.com')) {
        setContactProfileImage(profileInfo[1])
      } else {
        setContactProfileImage(imagePath)
      }
      if (profileInfo?.[0]?.length > 0) {
        setContactProfileName(profileInfo[0])
      } else {
        setContactProfileName('')
      }
    }

    if (isContactInfoAvailable) {
      if (contactInfoObject && contactInfoObject.linkedin_id !== linkedInProfileId) {
        setNewContactProfile(null)
        if (profileInfo && profileInfo[1] && profileInfo[1]?.length > 0) {
          setContactProfileImage(profileInfo[1])
        } else {
          setContactProfileImage(imagePath)
        }

        if (profileInfo && profileInfo[0] && profileInfo[0]?.length > 0) {
          setContactProfileName(profileInfo[0])
        } else {
          setContactProfileName('')
        }
      }
    }

    if (profileInfo) {
      const [name, image, desc, linkedIn] = profileInfo

      if (name && name.length > 0 && (!contactInfoObject || contactInfoObject.name?.length === 0)) {
        setProfileName(name)
        setContactProfileName(name)
      }
      if (image && image?.length > 0 && image.includes('media.licdn.com')) {
        setProfileImage(image)
      }
      if (desc && desc?.length > 0 && (!contactInfoObject || contactInfoObject.profile_desc?.length === 0)) {
        setProfileDesc(desc)
      }
      if (linkedIn && linkedIn?.length > 0 && (!contactInfoObject || contactInfoObject.linkedIn_url?.length === 0)) {
        setlinkedin(linkedIn)
      }
    }

    if (contactOverlayInfo) {
      const [email, website, twitter, phone, linkedin, address] = contactOverlayInfo

      if (email && email?.length > 0 && (!contactInfoObject || contactInfoObject.personal_email?.length === 0)) {
        setEmail(email)
      }
      if (website && website?.length > 0 && (!contactInfoObject || contactInfoObject.website_url?.length === 0)) {
        setWebsite(website)
      }
      if (phone && phone?.length > 0 && (!contactInfoObject || contactInfoObject.phone_number?.length === 0)) {
        let phoneNumberRegex = /\s+(\([a-zA-Z]+\)|[a-zA-Z]+)$/
        let cleanedPhoneNumber = phone.replace(phoneNumberRegex, '').trim()
        setPhone(cleanedPhoneNumber)
      }
      if (linkedin && linkedin?.length > 0 && (!contactInfoObject || contactInfoObject.linkedIn_url?.length === 0)) {
        setlinkedin(linkedin)
      }
    }

    if (address && address?.length > 0 && (!contactInfoObject || contactInfoObject.address?.length === 0)) {
      setProfileAddress(address)
    }

    if (linkedInProfileId && linkedInProfileId?.length > 0 && (!contactInfoObject || contactInfoObject.linkedin_id?.length === 0)) {
      setlinkedinId(linkedInProfileId)
    }
  }
  const { scraperPage, isProfilePage } = useContext(GlobalStatesContext)
  useEffect(() => {
    setRefresh(!refresh)
    setProfileContactDetails(null)
    setContactOverlayDetails(null)
  }, [scraperPage, isProfilePage])

  useEffect(() => {
    ;(async () => {
      await getProfileDetails()
    })()
  }, [refresh])

  useEffect(() => {
    if (!(profileContactDetails && contactOverlayDetails)) {
      setContactProfileName('')
      setContactProfileImage(imagePath)
      cleanTheSlate()
    }
  }, [profileContactDetails, contactOverlayDetails])

  const handleInputChange = (e) => {
    setNotes(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handlePhoneChange = (e) => {
    const phone = e.target.value

    setPhone(phone)
    let validationMessage = ''
    const phoneNumberRegex = /^(\+)?(\()?(\d{1,16})(\))?(-)?(\s)?(\d{1,16})(\))?$/
    if (!phoneNumberRegex.test(phone)) {
      validationMessage = 'Phone number format is invalid.'
    } else if (phone.length < 8 || phone.length > 16) {
      validationMessage = 'Phone number must be between 8 to 16 characters long.'
    }

    setPhoneErrorMessage(validationMessage)
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div className="container pt-2 pb-3 contact-container px-4">
      <div className="justify-content-center">
        <div className="contact-info-head">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-column justify-content-start">
              <p className="contact-info-para">Extracted contact information of</p>
              {contactProfileName?.length > 0 && <h3 className="contact-info-title">{contactProfileName}</h3>}
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <img src={contactProfileImage} className="rounded-circle rounded-profile-image" alt="Profile" />
            </div>
          </div>

          <div>
            <CustomInputBox type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <CustomInputBox type="text" placeholder="Full name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            <CustomInputBox type="text" placeholder="Profile Link" value={linkedin} onChange={(e) => setlinkedin(e.target.value)} />
            <CustomInputBox type="text" placeholder="Phone Number" value={phone} onChange={(e) => handlePhoneChange(e)} errorMessage={phoneErrorMessage} />
            <CustomInputBox type="text" placeholder="Address" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} />
            <CustomInputBox type="text" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <div className={`my-2 ${isFocused ? 'focused' : ''} ${profileDesc ? 'filled' : ''}`}>
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
