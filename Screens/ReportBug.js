import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import CustomInputBox from '../components/Auth/CustomInputBox'
import CustomButton from '../components/Auth/button/CustomButton'
import toast from 'react-hot-toast'

const ReportBug = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (title.trim() == '') {
      toast.error('Title can not be empty!')
      return
    } else if (descriptions.trim() == '') {
      toast.error('Descriptions can not be empty!')
      return
    }
  }

  return (
    <div>
      <div className="pt-3 mb-4">
        <BackButton navigateTo="Home" />
      </div>

      <div className="container d-flex flex-column">
        <h3 className="pageHeading mb-1">Report a Bug</h3>
        <CustomInputBox
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <textarea
          value={description}
          className="mt-2 contact-info-custom-textarea custom-textarea-global"
          rows="4"
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          className="form-control mt-2 input-file"
          id="imageUpload"
          name="imageUpload"
          accept="image/*"
          multiple
        />
        <div className="mt-3">
          <CustomButton child="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default ReportBug
