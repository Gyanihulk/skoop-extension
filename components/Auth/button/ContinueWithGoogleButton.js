import React, { useContext } from 'react'
import { FaGoogle } from 'react-icons/fa'
import AuthContext from '../../../contexts/AuthContext'

const ContinueWithGoogleButton = ({ setSocial, message }) => {
  const { handleSocialLogin } = useContext(AuthContext)
  return (
    <button
      className="btn w-100 mb-2 bg-orange text-white"
      id="sign-in-with-google"
      onClick={() => {
        handleSocialLogin(2)
        setSocial(2)
      }}
    >
      <FaGoogle size={20} />
      <span className="ms-2 fs-6"> {message}</span>
    </button>
  )
}

export default ContinueWithGoogleButton
