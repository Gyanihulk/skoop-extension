import { useContext, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { MdAccountCircle, MdNotificationsActive, MdClose } from "react-icons/md";
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
    // chrome.runtime.sendMessage({ message: 'closeExtension' });
    const executeClose=()=>{
      const container=document.getElementById('skoop-extension-container');
      container.style.display = 'none';
    }

    try{
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const targetTab=tabs[0];
          console.log("the target tab",targetTab);
          if (targetTab) {
            console.log("the tab exists")
            try{
              chrome.scripting.executeScript({
                target : {tabId : targetTab.id},
                func: executeClose
              })
            }catch(err){
              console.log("some error occured in executing script",err)
            }
          }
          else{
            console.log("the target tab is not accessible");
          }
      });
    }catch(err){
        console.log("some error occured while setting up initial array")
    }
  }

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

            {/* Calendar Link */}
            <button
              className="btn btn-link"
              onClick={() => window.open(`${API_ENDPOINTS.skoopCalendarUrl}/index.php/user/login`, '_blank')}
              data-mdb-toggle="tooltip"
              data-mdb-placement="bottom"
              title="Go to your Meeting Calendar Schedular"
            >
              <FaRegCalendarCheck className="icon-style-normal" />
            </button>


            {/* Notifications */}
            <button className="btn btn-link"
              data-mdb-toggle="tooltip"
              data-mdb-placement="bottom"
              title="Notifications"
            >
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
            <button className="btn btn-link"
              data-mdb-toggle="tooltip"
              data-mdb-placement="bottom"
              title="Close"
              onClick={closeExtension}
            >
              <MdClose className="icon-style-normal" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
