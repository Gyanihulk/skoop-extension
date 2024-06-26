import React, { useState, useContext, useEffect } from 'react'
import SignIn from './Screens/SignIn'
import Homepage from './Homepage'
import SignUp from './Screens/SignUp'
import NewChatPage from './Screens/ChatPage'
import NewContactPage from './Screens/NewContactPage'

import GlobalStatesContext from '../contexts/GlobalStates'

export default function StartDiv(props) {
  const [disp, setDisp] = useState('none')
  const [page, setPage] = useState('SignIn')
  const { setIsLinkedin } = useContext(GlobalStatesContext)

  const change = () => {
    if (disp == 'none') setDisp('app_frame')
    else setDisp('none')
  }

  useEffect(() => {
    setIsLinkedin(props.isLinkedin)
  }, [])

  return (
    <div className="nav">
      <button onClick={change} className="startapp"></button>
      <div id={`${disp}`}>
        {page == 'SignIn' && (
          <SignIn
            changePage={(input) => {
              setPage(input)
            }}
            close={change}
          />
        )}
        {page == 'SignUp' && (
          <SignUp
            changePage={(input) => {
              setPage(input)
            }}
            close={change}
          />
        )}
        {page == 'Home' && (
          <Homepage
            changePage={(input) => {
              setPage(input)
            }}
            close={change}
          />
        )}
        {page == 'NewChatPage' && (
          <NewChatPage
            changePage={(input) => {
              setPage(input)
            }}
          />
        )}
        {page == 'NewContactPage' && (
          <NewContactPage
            changePage={(input) => {
              setPage(input)
            }}
          />
        )}
      </div>
    </div>
  )
}
