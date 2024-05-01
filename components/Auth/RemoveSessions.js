import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'

const RemoveSessions = ({onDelete}) => {
  
  return (
    <div class="alert alert-danger .font-8 text-center p-2 ">
      Session limit reached. Max 2 sessions allowed. {" "}
      <a
        class="cursor-pointer alert-link footer-font text-decoration-underline"
        onClick={() => onDelete()}
      >
       Logout all sessions 
      </a>
      {" "} and log in again.
    </div>
  )
}

export default RemoveSessions
