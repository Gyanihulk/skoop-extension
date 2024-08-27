import React, { useContext } from 'react'
import MessageContext from '../../contexts/MessageContext'
import GlobalStatesContext from '../../contexts/GlobalStates'
import Library from '../Library'
import { FaArrowLeft } from 'react-icons/fa'
import { useUserSettings } from '../../contexts/UserSettingsContext'

const VideosListContainer = () => {
  const { addMessage } = useContext(MessageContext)
  const { totalMediaCount, setIsVideoContainer } = useContext(GlobalStatesContext)

  const handleInsertion = (text) => {
    const newText = text + ' \n '
    addMessage(newText)
    window.scrollTo(0, document.body.scrollHeight)
  }

  return (
    <div>
      <div className="mt-2 mb-3 d-flex justify-content-between">
        <div class="back-button d-flex align-items-center cursor-pointer" onClick={() => setIsVideoContainer(false)}>
          <div className="d-flex align-items-center">
            <FaArrowLeft className="mini-icon" size={16} />
          </div>
          <h4 className="profile-name mb-0 pb-0 ms-2">Back</h4>
        </div>
          
        <div className="me-3 media-count">Media Count: {totalMediaCount}</div>
      </div>

      <div className="mx-3">
        <Library appendToBody={handleInsertion} />
      </div>
    </div>
  )
}

export default VideosListContainer
