import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import CustomButton from '../components/Auth/button/CustomButton'
import toast from 'react-hot-toast'
import CustomInputBox from '../components/Auth/CustomInputBox'

const ContactUs = () => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (subject.trim() == '') {
      toast.error('Subject can not be empty!')
      return
    } else if (message.trim() == '') {
      toast.error('Message can not be empty!')
      return
    }
  }

  return (
    <div>
      <div className="pt-3 mb-4">
        <BackButton navigateTo="Home" />
      </div>

      <div className="container d-flex flex-column">
        <h3 className="pageHeading mb-1">Contact Us</h3>
        <CustomInputBox
          placeholder="Enter Subject"
          onChange={(e) => setSubject(e.target.value)}
          value={subject}
        />
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
  )
}

export default ContactUs
