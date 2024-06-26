import React, { useState, useContext } from 'react'
import ScreenContext from '../../contexts/ScreenContext'
import AuthContext from '../../contexts/AuthContext'
import CustomButton from './button/CustomButton'
import ValidationError from './ValidationError'
import CustomPasswordInputBox from './CustomPasswordInputBox'
import CustomInputBox from './CustomInputBox'
import RemoveSessions from './RemoveSessions'
import toast from 'react-hot-toast'

const SignInForm = () => {
  const { navigateToPage } = useContext(ScreenContext)
  const { handleSkoopLogin, deleteMyAllJwtSessions, social, showClearSessionDialog } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'username') {
      setUsername(value)
      setIsUsernameEmpty(value.trim() === '')
    } else if (name === 'password') {
      setPassword(value)
      setIsPasswordEmpty(value.trim() === '')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (username !== '' && password !== '') {
      handleSkoopLogin(username, password)
    } else {
      setIsUsernameEmpty(username.trim() === '')
      setIsPasswordEmpty(password.trim() === '')
    }
  }
  function handleDeleteSessions() {
    if (username.trim() === '' || password.trim() === '') {
      toast.error('email or password can not be empty!')
    } else {
      deleteMyAllJwtSessions(username, password)
    }
  }
  return (
    <div className="row justify-content-center">
      {showClearSessionDialog && social == null && <RemoveSessions onDelete={handleDeleteSessions} />}
      <div className="col-md-6">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <CustomInputBox type="text" placeholder="Email address" name="username" onChange={handleChange} value={username} isEmpty={isUsernameEmpty} />
            {isUsernameEmpty && <ValidationError title="Please add your email address" />}
          </div>
          <div className="form-group">
            <CustomPasswordInputBox placeholder="Password" name="password" onChange={handleChange} value={password} isEmpty={isPasswordEmpty} />
            {isPasswordEmpty && <ValidationError title="Please add your password" />}
          </div>
          <div className="mt-2 forgot-password-label">
            <span className="cursor-pointer" onClick={() => navigateToPage('ForgotPassword')}>
              Forgot Password?
            </span>
          </div>
          <div className="mt-4">
            <CustomButton type="Submit" child="Sign in" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignInForm
