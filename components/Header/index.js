import { useContext, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { MdAccountCircle, MdNotificationsActive, MdOutlineVideoSettings } from "react-icons/md";
import GlobalStatesContext from "../../contexts/GlobalStates";
import { FaRegCalendarCheck } from "react-icons/fa";
import ScreenContext from "../../contexts/ScreenContext";
import API_ENDPOINTS from "../apiConfig";


export default function Header() {
  const {activePage}=useContext(ScreenContext)
  const { navigateToPage } = useContext(ScreenContext);

  if(activePage==="SignIn"||activePage==="SignUp"){
    return <></>
  }
  const [anchorEl, setAnchorEl] = useState(false)
  const {selectedVideoStyle,handleVideoStyleSelect}=useContext(GlobalStatesContext)
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  
  const [profileOpen, setProfileOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl((prevAnchorEl) => (prevAnchorEl ? null : event.currentTarget));
  };  
  const handleClose = () => {
    setAnchorEl(null);
  };

  

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen);
  };

  const handleLogOut=()=>{
    localStorage.setItem('accessToken',JSON.stringify('none'));
    navigateToPage("SignIn");
  }

  const closeExtension=()=>{
    chrome.runtime.sendMessage({ message: 'closeExtension' });
  }
  chrome.runtime.sendMessage({ message: 'closeExtension' });
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <BsArrowRightCircle
            className="icon-style"
            onClick={() => {
              navigateToPage("Home");
            }}
          />
          <span className="navbar-brand brand-text">Skoop</span>

          <div className="d-flex ml-auto align-items-center">
            {/* Video Settings Dropdown */}
            {/* <div className={`nav-item dropdown ${videoSettingsOpen ? 'show' : ''}`}>
              <button className="btn btn-link" onClick={toggleVideoSettings}>
                <MdOutlineVideoSettings className="icon-style-normal" />
              </button>
              <div className={`dropdown-menu ${videoSettingsOpen ? 'show' : ''}`}>
                <button
                  className={`dropdown-item ${selectedVideoStyle === 'Vertical Mode' ? 'active' : ''}`}
                  onClick={() => handleVideoStyleSelect('Vertical Mode')}
                >
                  Vertical (9:16)
                </button>
                <button
                  className={`dropdown-item ${selectedVideoStyle === 'Horizontal' ? 'active' : ''}`}
                  onClick={() => handleVideoStyleSelect('Horizontal')}
                >
                  Horizontal (16:9)
                </button>
                <button
                  className={`dropdown-item ${selectedVideoStyle === 'Square' ? 'active' : ''}`}
                  onClick={() => handleVideoStyleSelect('Square')}
                >
                  Square (1:1)
                </button>
              </div>
            </div> */}

            {/* Calendar Link */}
            <button className="btn btn-link" onClick={() => window.open(`${API_ENDPOINTS.skoopCalendarUrl}/index.php/user/login`, '_blank')}>
              <FaRegCalendarCheck className="icon-style-normal" />
            </button>

            {/* Notifications */}
            <button className="btn btn-link">
              <MdNotificationsActive className="icon-style-normal" />
            </button>

            {/* Profile Dropdown */}
            <div className={`nav-item dropdown custom ${profileOpen ? 'show' : ''}`}>
              <button className="btn btn-link dropstart" onClick={toggleProfileDropdown}>
                <MdAccountCircle className="icon-style" />
              </button>
              <div className={`dropdown-menu ${profileOpen ? 'show' : ''}`} style={{ marginLeft: '-120px' }}>
                <button className="dropdown-item" onClick={() => navigateToPage("AccountSettings")}>
                  Account Settings
                </button>
                <button className="dropdown-item" onClick={handleLogOut}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
