import { useContext, useState, useEffect } from 'react'
import { BsArrowLeftCircle } from 'react-icons/bs'
import { MdAccountCircle, MdClose, MdSaveAlt } from 'react-icons/md'
import GlobalStatesContext from '../../contexts/GlobalStates'
import { FaRegCalendarCheck } from 'react-icons/fa'
import ScreenContext from '../../contexts/ScreenContext'
import API_ENDPOINTS from '../apiConfig'
import AuthContext from '../../contexts/AuthContext.js'
import MessageContext from '../../contexts/MessageContext.js'

import { IoMdDownload, IoMdPerson } from 'react-icons/io'
import { MdOutlineHelp } from 'react-icons/md'
import { FaRegCalendar } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { HiMiniMinus } from 'react-icons/hi2'
import { TbArrowsDiagonalMinimize2 } from 'react-icons/tb'
import { TbArrowsDiagonal } from 'react-icons/tb'
import { RiDashboard2Line } from 'react-icons/ri'
import { useRecording } from '../../contexts/RecordingContext.js'

export default function Header() {
  const { isAuthenticated, handleLogOut, isPro, gracePeriodCompletion, gracePeriod } = useContext(AuthContext)
  const { navigateToPage, activePage } = useContext(ScreenContext)
  const { setScraperPage, scraperPage, isProfilePage, expand, expandMinimizeExtension } = useContext(GlobalStatesContext)

  const [profileOpen, setProfileOpen] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)
  const {
    isRecordStart,

    isScreenRecording,
  } = useRecording()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.custom')) {
        setProfileOpen(false)
      } else if (showHelpMenu && !event.target.closest('.custom')) {
        setShowHelpMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'auto'
    }
  }, [profileOpen, showHelpMenu])

  useEffect(() => {
    let skoopExtensionBody = document.getElementById('skoop-extension-body')
    if (expand) {
      skoopExtensionBody.style.overflowY = 'hidden'
    } else {
      skoopExtensionBody.style.overflowY = 'auto'
    }
  }, [expand])

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen)
    setShowHelpMenu(false)
  }

  const toggleHelpMenu = () => {
    if (profileOpen) {
      setProfileOpen(!profileOpen)
    }
    setShowHelpMenu(!showHelpMenu)
  }

  const { setMessage } = useContext(MessageContext)
  const executeClose = () => {
    const container = document.getElementById('skoop-extension-container')
    container.style.display = 'none'
  }

  const closeExtension = () => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const targetTab = tabs[0]
        if (targetTab) {
          try {
            chrome.scripting.executeScript({
              target: { tabId: targetTab.id },
              func: executeClose,
            })
          } catch (err) {
            console.error('some error occured in executing script', err)
          }
        }
      })
    } catch (err) {
      console.error('some error occured while setting up initial array')
    }
  }

  const openCalendarWindow = () => {
    document.body.style.overflow = 'auto'
    window.open(API_ENDPOINTS.skoopCalendarUrl, '_blank')
  }
  const openNewWindow = (url) => {
    document.body.style.overflow = 'auto'
    window.open(url, '_blank')
  }
  return (
    <>
      <nav className="navbar pe-2 py-2 d-flex align-items-center" id="Header">
        <div className="header-text">
          {isScreenRecording && isRecordStart ? (
            <span>
              Recording Screen<span className="recording-dots">...</span>
            </span>
          ) : (
            <>Skoop App</>
          )}
        </div>

        <div className="d-flex ml-auto align-items-center">
          {isAuthenticated && (
            <>
              <button className="btn btn-link header-icon d-flex align-items-center justify-content-center" data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="Expand/Shrink" onClick={expandMinimizeExtension}>
                {expand ? <TbArrowsDiagonal color={isScreenRecording && isRecordStart ? '#2d68c4' : '#fff'} size={16} /> : <TbArrowsDiagonalMinimize2 color={isScreenRecording && isRecordStart ? '#2d68c4' : '#fff'} size={16} />}
              </button>
              {isProfilePage && (
                <button
                  className="btn btn-link header-icon d-flex align-items-center justify-content-center"
                  data-mdb-toggle="tooltip"
                  data-mdb-placement="bottom"
                  title="Save Profile Info "
                  onClick={() => {
                    navigateToPage('ContactPage')
                    setScraperPage(!scraperPage)
                  }}
                >
                  <IoMdDownload size={14} />
                </button>
              )}
              <div className={`nav-item dropdown custom`}>
                <button
                  className="btn btn-link header-icon d-flex align-items-center justify-content-center"
                  data-mdb-toggle="tooltip"
                  data-mdb-placement="bottom"
                  title="Helper Videos"
                  onClick={() => {
                    toggleHelpMenu()
                  }}
                >
                  <MdOutlineHelp size={16} />
                </button>
                <div className={`ddstyle dropdown-menu ${showHelpMenu ? 'show' : ''}`} style={{ marginLeft: '-120px' }}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      toggleHelpMenu()
                      navigateToPage('HelperVideos')
                    }}
                  >
                    Helper Videos
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      toggleHelpMenu()
                      navigateToPage('ContactUs')
                    }}
                  >
                    Contact us
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      toggleHelpMenu()
                      navigateToPage('ReportBug')
                    }}
                  >
                    Report a bug
                  </button>
                  <button className="dropdown-item" onClick={() => openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/affiliate')}>
                    Become an affiliate.
                  </button>
                </div>
              </div>
              {!['Subscription', 'PaymentScreen'].includes(activePage) && (
                <button className="btn btn-link header-icon d-flex align-items-center justify-content-center" onClick={openCalendarWindow} data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="Go to your Meeting Calendar Schedular">
                  <RiDashboard2Line size={16} />
                </button>
              )}

              {/* Profile Dropdown */}
              <div className={`nav-item dropdown custom`}>
                <button className="btn btn-link header-icon dropstart d-flex align-items-center justify-content-center" onClick={toggleProfileDropdown} data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="User Profile">
                  <IoMdPerson size={16} />
                </button>
                <div className={`ddstyle dropdown-menu ${profileOpen ? 'show' : ''}`} style={{ marginLeft: '-120px' }}>
                  {isAuthenticated && isPro && (
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigateToPage('AccountSettings')
                        toggleProfileDropdown()
                      }}
                    >
                      Account Settings
                    </button>
                  )}

                  {/* <button
                    className="dropdown-item"
                    onClick={() => {
                      navigateToPage('DevicesList')
                      toggleProfileDropdown()
                    }}
                  >
                    My Devices
                  </button> */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setMessage()
                      handleLogOut()
                      toggleProfileDropdown()
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}

          <button className="btn btn-link header-icon d-flex align-items-center justify-content-center" data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="Close" onClick={closeExtension}>
            <IoClose size={18} />
          </button>
        </div>
      </nav>
      {isAuthenticated && gracePeriod > 0 && (
        <div class="notification-container">
          <div class="notification-div">Please verify your email in next {gracePeriod} days to continue using the app</div>
        </div>
      )}
    </>
  )
}
