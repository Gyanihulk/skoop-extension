import { AppBar, IconButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { MdAccountCircle, MdNotificationsActive, MdOutlineVideoSettings } from "react-icons/md";
import GlobalStatesContext from "../../contexts/GlobalStates";
import { FaRegCalendarCheck } from "react-icons/fa";
import ScreenContext from "../../contexts/ScreenContext";


export default function Header() {
  const {activePage,navigateToPage}=useContext(ScreenContext)
  if(activePage==="SignIn"||activePage==="SignUp"){
    return <></>
  }
  const [anchorEl, setAnchorEl] = useState(false)
  const {selectedVideoStyle,handleVideoStyleSelect}=useContext(GlobalStatesContext)
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const handleClick = (event) => {
    setAnchorEl((prevAnchorEl) => (prevAnchorEl ? null : event.currentTarget));
  };  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleLogOut=()=>{
    localStorage.setItem('accessToken',JSON.stringify('none'));
    navigateToPage("SignIn")
  }
  const closeExtension=()=>{
    chrome.runtime.sendMessage({ message: 'closeExtension' });
  }
  chrome.runtime.sendMessage({ message: 'closeExtension' });
  return (
    <>
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between', background: '#ECF2FF' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          edge="start"
          aria-label="Close Skoop"
        >
        <BsArrowRightCircle className="icon-header" onClick={closeExtension}/>
        </IconButton>

        <Typography variant="h6" className="brand-title">
          Skoop
        </Typography>
      </div>
      <div>
        <IconButton edge="start" onClick={handleClick}>
          <MdOutlineVideoSettings className="icon-header"/>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            selected={selectedVideoStyle === 'Vertical Mode'}
            onClick={() => handleVideoStyleSelect('Vertical Mode')}
          >
            <ListItemText 
              primary="Vertical (9:16)" 
              // style={{ fontSize: isLinkedin ? '20px' : '20px' }}
            />
          </MenuItem>

          <MenuItem
            selected={selectedVideoStyle === 'Horizontal'}
            onClick={() => handleVideoStyleSelect('Horizontal')}
          >
            <ListItemText 
              primary="Horizontal (16:9)" 
              // style={{ fontSize: isLinkedin ? '20px' : '20px' }}
            />
          </MenuItem>

          <MenuItem
            selected={selectedVideoStyle === 'Square'}
            onClick={() => handleVideoStyleSelect('Square')}
          >
            <ListItemText 
              primary="Square (1:1)" 
            />
          </MenuItem>
        </Menu>


        <IconButton
          onClick={() => { window.open(`${API_ENDPOINTS.skoopCalendarUrl}/index.php/user/login`, '_blank') }}
        >
          <FaRegCalendarCheck style={{color:'black'}} className="icon-style-normal" />
        </IconButton>

        <IconButton>
            <MdNotificationsActive style={{color:'black'}} className="icon-style-normal" />
        </IconButton>

        <IconButton
          onClick={toggleProfileDropdown}
        >
          <MdAccountCircle style={{color:'black'}} className="icon-style" />
        </IconButton>
        <Menu
          anchorEl={profileDropdownVisible}
          open={Boolean(profileDropdownVisible)}
          onClose={() => setProfileDropdownVisible(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem 
        
          onClick={() => navigateToPage("AccountSettings")}>
            Account Settings
          </MenuItem>
          <MenuItem 

          onClick={handleLogOut}>Logout</MenuItem>
        </Menu>
      </div>
      </Toolbar>
    </AppBar> 
    </>
  );
}
