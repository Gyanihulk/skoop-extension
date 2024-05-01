import React, { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import CustomButton from '../components/Auth/button/CustomButton'
import toast from 'react-hot-toast'
import CustomInputBox from '../components/Auth/CustomInputBox'
import API_ENDPOINTS from '../components/apiConfig'
import ThankYou from '../components/ThankYou'

const ContactUs = ({ navigateTo }) => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [inquiry_type, setInquiryType] = useState('select')
  const [showThankyouPage, setShowThankyouPage] = useState(false)

  const inqueryOptions = [
    { label: 'Partnership', value: 'partnership' },
    { label: 'Sales', value: 'sales' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Affiliate', value: 'affiliate' },
    { label: 'Others', value: 'others' },
  ]

  useEffect(() => {
    setShowThankyouPage(false)
  }, [])

  const handleSubmit = async () => {
    if (subject.trim() == '') {
      toast.error('Subject can not be empty!')
      return
    } else if (message.trim() == '') {
      toast.error('Message can not be empty!')
      return
    } else if (inquiry_type == 'select') {
      toast.error('Inquiry Type can not be empty!')
      return
    }

    try {
      const payload = JSON.stringify({
        title: subject,
        description: message,
        inquiry_type: inquiry_type,
      })

      const res = await fetch(API_ENDPOINTS.createContactUs, {
        method: 'POST',
        body: payload,
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      if (res.ok) {
        toast.success('Message sent successfully')
        setSubject('')
        setMessage('')
        setInquiryType('select')
        setShowThankyouPage(true)
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
            <CustomInputBox
              placeholder="Enter Subject"
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
            />
            <div className="form-group">
              <select
                className={`form-control custom-input-box select-box ${
                  inquiry_type != 'select' ? 'active' : ''
                }`}
                id="inquiry_type"
                name="inquiry_type"
                value={inquiry_type}
                onChange={(e) => setInquiryType(e.target.value)}
              >
                <option value="select" disabled>
                  Select the Inquery Type
                </option>
                {inqueryOptions?.map((option) => (
                  <option
                    className="select-box-option"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={message}
              className="mt-2 contact-info-custom-textarea custom-textarea-global"
              rows="4"
              placeholder="Write a message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="mt-3">
              <CustomButton child="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      ) : (
        <ThankYou
          heading="Form Submitted"
          pageToRedirect={navigateTo}
          redirectPageText={navigateTo}
        >
          <p>
            Thank you for reaching out to the Skoop team. We have received your
            message and will get back to you as soon as possible. Your inquiry
            is important to us, and we are committed to providing you with the
            assistance you need.
          </p>
        </ThankYou>
      )}
    </div>
  )
}

export default ContactUs
