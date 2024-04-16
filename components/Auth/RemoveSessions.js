import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'

const RemoveSessions = ({onDelete}) => {
  
  return (
    <div class="alert alert-danger .font-8 text-center p-2">
      You have reached the limit of concurrent sessions.
      <button
        type="button"
        class="btn btn-success btn-sm"
        onClick={() => onDelete()}
      >
        Log Out Everywhere
      </button>
    </div>
  )
}

export default RemoveSessions
