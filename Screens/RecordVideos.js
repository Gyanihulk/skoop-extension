import React, { useContext } from 'react'
import BackButton from '../components/BackButton'
import Library from '../components/Library'
import MessageContext from '../contexts/MessageContext'
import GlobalStatesContext from '../contexts/GlobalStates'

const RecordVideos = () => {
  const { addMessage } = useContext(MessageContext)
  const { totalMediaCount } = useContext(GlobalStatesContext)

  const handleInsertion = (text) => {
    const newText = text + ' \n '
    addMessage(newText)
    window.scrollTo(0, document.body.scrollHeight)
  }

  return (
    <div>
      <div className="mt-2 mb-3 d-flex justify-content-between">
        <BackButton navigateTo="Home" />
        <div className="me-3 media-count">Media Count: {totalMediaCount}</div>
      </div>

      <div className="mx-3">
        <Library appendToBody={handleInsertion} />
      </div>
    </div>
  )
}

export default RecordVideos
