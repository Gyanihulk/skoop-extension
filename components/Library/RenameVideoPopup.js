import React, {useContext, useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import { IoMdClose } from 'react-icons/io'
import AuthContext from '../../contexts/AuthContext'
import { useUserSettings } from '../../contexts/UserSettingsContext.js'
import TourContext from '../../contexts/TourContext.js'

const RenameVideoPopup = ({ newTitle, onClose, onSave, onTitleChange }) => {

  const { isAuthenticated, gracePeriod, showVersionNotification} = useContext(AuthContext)
  const { userSettings } = useUserSettings()
  const { isToorActive } = useContext(TourContext);
  const [marginClass, setMarginClass] = useState('')

  useEffect(() => {
    if (isToorActive) {
      setMarginClass("mt--120");
      if((isAuthenticated && gracePeriod > 0) || (userSettings && !userSettings.fullAccess) ) {
          setMarginClass('mt--85');
      }
      if( showVersionNotification ) {
          setMarginClass('mt--65');
      }
      if((isAuthenticated && gracePeriod > 0 && showVersionNotification) || (showVersionNotification && userSettings && !userSettings.fullAccess) ) {
        setMarginClass('mt--20');
      }
      if(isAuthenticated && gracePeriod > 0 && userSettings && !userSettings.fullAccess) {
        setMarginClass('mt--45');
      }

      if(isAuthenticated && gracePeriod > 0 && showVersionNotification && userSettings && !userSettings.fullAccess) {
        setMarginClass('mt-15');
      }
    } else {
      setMarginClass('');
    }
  }, [isToorActive, isAuthenticated, gracePeriod, showVersionNotification, userSettings])
  
  const handleSave = () => {
    if (newTitle.trim() === '') {
      toast.error('Please enter a folder name before saving.')
    } else {
      onSave()
    }
  }

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className=" modal-overlay modal-dialog-centered">
        <div className={`modal-content mx-2 ${marginClass}`}>
          <div className="modal-header px-3 pt-3 pb-2 border-0">
            <h6 className="modal-title">Rename video</h6>
            <button type="button" className="custom-close-button" onClick={onClose} aria-label="Close">
              <IoMdClose size={16} />
            </button>
          </div>
          <div className="modal-body">
            <input type="text" id="newTitle" placeholder="Enter new video name" value={newTitle} onChange={onTitleChange} className="form-control custom-input-global" required />
          </div>
          <div className="modal-footer border-0 py-1">
            <button type="button" className="modal-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RenameVideoPopup
