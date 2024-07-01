import React, { useState } from 'react'

const CustomInputBox = ({ type, placeholder, name, onChange, value, errorMessage = '' }) => {
  const [isFocused, setIsFocused] = useState(false)
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div className="custom-input-parent-container">
      <div className={`custom-input-container ${isFocused ? 'focused' : ''} ${value ? 'filled' : ''} ${errorMessage?.length > 0 ? 'is-error' : ''}`}>
        <input type={type} id="custom-input-box" className="custom-input-box" name={name} onChange={onChange} value={value} onFocus={handleFocus} onBlur={handleBlur} />
        <label>{placeholder}</label>
      </div>
      {errorMessage && errorMessage.length > 0 && <span className="error-message">{errorMessage}</span>}
    </div>
  )
}

export default CustomInputBox
