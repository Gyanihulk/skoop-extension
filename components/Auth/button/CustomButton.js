import React from 'react'

const CustomButton = ({ type, child, onClick }) => {
  return (
    <button type={type} id="custom-btn" className="text-white btn w-100" onClick={onClick}>
      {child}
    </button>
  )
}

export default CustomButton
