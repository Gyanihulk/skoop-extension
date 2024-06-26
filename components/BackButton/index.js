import React, { useContext } from 'react'
import ScreenContext from '../../contexts/ScreenContext'
import { FaArrowLeft } from 'react-icons/fa'
const BackButton = ({ navigateTo }) => {
  const { navigateToPage } = useContext(ScreenContext)

  return (
    <div class="back-button d-flex align-items-center cursor-pointer" onClick={() => navigateToPage(navigateTo)}>
      <div className="d-flex align-items-center">
        <FaArrowLeft className="mini-icon" size={17} />
      </div>
      <h4 className="profile-name mb-0 pb-0 ms-2">Back</h4>
    </div>
  )
}

export default BackButton
