import React, { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import CustomInputBox from '../components/Auth/CustomInputBox'
import CustomButton from '../components/Auth/button/CustomButton'
import toast from 'react-hot-toast'
import API_ENDPOINTS from '../components/apiConfig'
import ThankYou from '../components/ThankYou'

const ReportBug = ({ navigateTo }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [bugDocument, setBugDocument] = useState(null)
  const [showThankyouPage, setShowThankyouPage] = useState(false)

  useEffect(() => {
    setShowThankyouPage(false)
  }, [])

  // Function to handle the file input change event
  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    setBugDocument(file)
  }

  const handleSubmit = async () => {
    if (title.trim() == '') {
      toast.error('Title can not be empty!')
      return
    } else if (description.trim() == '') {
      toast.error('Descriptions can not be empty!')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('bug_document', bugDocument)

    try {
      const res = await fetch(API_ENDPOINTS.createReportBugs, {
        method: 'POST',
        body: formData, // Use FormData here
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
          // Remove 'Content-Type' header when using FormData
        },
      })

      if (res.ok) {
        const jsonResponse = await res.json()
        toast.success('Report Bug Created Successfully')
        setBugDocument('')
        setTitle('')
        setDescription('')
        setShowThankyouPage(true)
      } else throw new Error('Error occoured while creating report bug')
    } catch (err) {
      toast.error('Error occoured while creating report bug')
    }
  }

  return (
    <>
      {!showThankyouPage ? (
        <div>
          <div className="pt-3 mb-4">
            <BackButton navigateTo={navigateTo} />
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
              onChange={handleFileChange}
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
            Thank you for submitting the bug report. We appreciate your effort
            in helping us improve our services. Our team will investigate the
            issue and take the necessary steps to resolve it. We will keep you
            updated on our progress.
          </p>
        </ThankYou>
      )}
    </>
  )
}

export default ReportBug