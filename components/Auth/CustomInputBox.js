import React, { useState } from 'react'

const CustomInputBox = ({ type, placeholder, name, onChange, value, isEmpty }) => {
  const [isFocused, setIsFocused] = useState(false)
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div className={`custom-input-container ${isFocused ? 'focused' : ''} ${value ? 'filled' : ''}`}>
      <input type={type} id="custom-input-box" className="custom-input-box" name={name} onChange={onChange} value={value} onFocus={handleFocus} onBlur={handleBlur} />
      <label>{placeholder}</label>
    </div>
  )
}

export default CustomInputBox
