import React, { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import CustomButton from '../components/Auth/button/CustomButton'
import toast from 'react-hot-toast'
import CustomInputBox from '../components/Auth/CustomInputBox'
import API_ENDPOINTS from '../components/apiConfig'
import ThankYou from '../components/ThankYou'
import { enqueryOptions, supportType } from "../constants";

const ContactUs = ({ navigateTo }) => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [showThankyouPage, setShowThankyouPage] = useState(false)
  const [enquiry_type, setEnquiryType] = useState('select')

  useEffect(() => {
    setShowThankyouPage(false)
  }, [])

  const handleSubmit = async () => {
    if (title.trim() == '') {
      toast.error('Title is required!')
      return
    } else if (message.trim() == '') {
      toast.error('Message is required!')
      return
    } else if (enquiry_type == 'select') {
      toast.error('Enquiry type is required!')
      return
    }

    try {
      const payload = JSON.stringify({
        title: title,
        message,
        enquiry_type: enquiry_type,
        support_type: supportType.contact,
      })

      const res = await fetch(API_ENDPOINTS.createSupport, {
        method: 'POST',
        body: payload,
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      if (res.ok) {
        toast.success('Message sent successfully');
        setTitle('');
        setMessage('');
        setEnquiryType('select');
        setShowThankyouPage(true);
      } else {
        const resData = await res.json()
        toast.error(resData.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      {!showThankyouPage ? (
        <div>
          <div className="pt-3 mb-4">
            <BackButton navigateTo={navigateTo} />
          </div>

          <div className="container d-flex flex-column">
            <h3 className="pageHeading mb-1">Contact Us</h3>
            <CustomInputBox placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)} value={title} />
            <div className="form-group">
              <select className={`form-control custom-input-box select-box ${enquiry_type != 'select' ? 'active' : ''}`} id="enquiry_type" name="enquiry_type" value={enquiry_type} onChange={(e) => setEnquiryType(e.target.value)}>
                <option value="select" disabled>
                  Select the Enquery Type
                </option>
                {enqueryOptions?.map((option) => (
                  <option className="select-box-option" key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea value={message} className="mt-2 contact-info-custom-textarea custom-textarea-global" rows="4" placeholder="Write a message..." onChange={(e) => setMessage(e.target.value)} />
            <div className="mt-3">
              <CustomButton child="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      ) : (
        <ThankYou heading="Form Submitted" pageToRedirect={navigateTo} redirectPageText={navigateTo}>
          <p>Thank you for reaching out to the Skoop team. We have received your message and will get back to you as soon as possible. Your inquiry is important to us, and we are committed to providing you with the assistance you need.</p>
        </ThankYou>
      )}
    </div>
  )
}

export default ContactUs
