import React, { useContext, useEffect, useState } from 'react';
import { MdOutlineVideoSettings } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { BsArrowRightCircle } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import API_ENDPOINTS from './apiConfig.js';
import StartDiv from './StartDiv.js';
import GlobalStatesContext from '../contexts/GlobalStates.js';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemText, Card, CardContent, Link, Container  } from '@mui/material';
import RecordingButton from './VideoRecording/index.js';
import VoiceVisualization from './AudioRecording/index.js';
import EmailComposer from './EmailSection/index.js';

const Homepage = (props) => {

  const [anchorEl, setAnchorEl] = useState(false)
  const [aspectRatio,setAspectRatio]=useState(9/16)
  const [openSettings, setOpenSettings] = useState(false)
  const [openLibrary, setOpenLibrary] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false);
  const [latestVideoUrl,setLatestVideoUrl]=useState('')
  const [modeOfRecording,setModeOfRecording]=useState('Video')
  const [refresh, setRefresh] = useState(false);
  const [selectedVideoStyle, setSelectedVideoStyle] = useState(null);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);


  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };
  const {isLinkedin} = useContext(GlobalStatesContext);  

  useEffect(()=>{
    setRefresh(window.location.href.includes('linkedin.com/in/'));
  },[])

  //const navBarColor = props.isLinkedin ? "#0a66c2":"#EA4335"

  const navBarColor = isLinkedin ? "#0a66c2":"#EA4335"


  const handleClick = (event) => {
    setAnchorEl((prevAnchorEl) => (prevAnchorEl ? null : event.currentTarget));
  };  
  

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut=()=>{
    localStorage.setItem('accessToken',JSON.stringify('none'));
    props.changePage("SignIn");
  }

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };
  const handleVideoStyleSelect = (style) => {
    setSelectedVideoStyle(style);

    if(style === 'Square'){
      setAspectRatio(1);
    }
    else if(style === 'Vertical Mode'){
      setAspectRatio(9/16);
    }
    else{
      setAspectRatio(16/9);
    }
    console.log(`Selected Video Style: ${style}`);
    handleClose();
  };

  //const menuItems = document.querySelectorAll('.MuiMenuItem-root .MuiListItemText-primary');
    //menuItems.forEach(item => {
    //  item.style.fontSize = fontSize;
    //});

  useEffect(() => { 
    window.addEventListener('popstate',()=>{console.log("hi")});
  }, []); 

  
  function convertArrayOfObjectsToCSV(data) {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(obj => Object.values(obj).join(',') + '\n');
    const csvContent= header + rows.join('');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    //const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'skoop_contacts_data.csv';
    link.click();
  }

  const handleExportCsv=async()=>{
    try{
      var response=await fetch(API_ENDPOINTS.skoopCrmGetAllData,{
        method: "GET",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      response=await response.json()
      const keysToRemove=['username','id']
      response.map(obj => {
        keysToRemove.forEach(key => delete obj[key]);
        return obj;
      });
      convertArrayOfObjectsToCSV(response)
    }catch(err){
      alert("some error occured while exporting csv",err)
    }
  }

  const handleRefreshClick = () => {
    setRefresh(window.location.href.includes('linkedin.com/in/'));
  };
  
  const fontSize = isLinkedin ? '20px' : '20px'
  const dropdownTextFontSize = isLinkedin ? '18px' : '18px';
  const TextStyles = isLinkedin ? { fontSize: '20px', fontWeight: 'bold' } : { fontSize: '20px', fontWeight: 'bold' };

  return (
    <div className="background-color">  
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between', background: '#ECF2FF' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          edge="start"
          aria-label="Close Skoop"
          onClick={props.close}
        >
        <BsArrowRightCircle style={{color:'black'}} className="icon-style" />
        </IconButton>

        <Typography variant="h6" className="brand-title" style={TextStyles}>
          Skoop
        </Typography>
      </div>
      <div>
        <IconButton edge="start" onClick={handleClick}>
          <MdOutlineVideoSettings style={{color:'black'}} className="icon-style-normal" />
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
              style={{ fontSize: isLinkedin ? '20px' : '20px' }}
            />
          </MenuItem>

          <MenuItem
            selected={selectedVideoStyle === 'Horizontal'}
            onClick={() => handleVideoStyleSelect('Horizontal')}
          >
            <ListItemText 
              primary="Horizontal (16:9)" 
              style={{ fontSize: isLinkedin ? '20px' : '20px' }}
            />
          </MenuItem>

          <MenuItem
            selected={selectedVideoStyle === 'Square'}
            onClick={() => handleVideoStyleSelect('Square')}
          >
            <ListItemText 
              primary="Square (1:1)" 
              style={{ fontSize: isLinkedin ? '20px' : '20px' }}
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
          style={{ fontSize: dropdownTextFontSize }}
          onClick={() => props.changePage("AccountSettings")}>
            Account Settings
          </MenuItem>
          <MenuItem 
          style={{ fontSize: dropdownTextFontSize }}
          onClick={handleLogOut}>Logout</MenuItem>
        </Menu>
      </div>
      </Toolbar>
    </AppBar> 

    <div className="d-flex my-4 justify-content-center mt-8">
      <RecordingButton
        aspectR={aspectRatio}
        setUrlAtHome={(input) => {
          setLatestVideoUrl(input);
        }}
      />
      <div className="mx-4"></div>
      <VoiceVisualization
        setUrlAtHome={(input) => {
          setLatestVideoUrl(input);
        }}
      />
    </div>
    {!isLinkedin && <EmailComposer />}
      {isLinkedin  &&
          <>
          <button
            type="button" 
            className="mx-auto d-block mt-4 homepage-button" 
            onClick={() => props.changePage("NewChatPage")}
          >
            Customized DM Message Options
          </button>

          <button
            type="button" 
            className="mx-auto d-block mt-4 mb-8 homepage-button" 
            onClick={() => props.changePage("NewContactPage")}
          >
            Linked Profile Info Scraper
          </button>

          <Container className='top-margins'>
            <div className="row justify-content-center">
              <Card className="col-md-10 mt-15 mb-8">
                <CardContent className="text-center mb-6">
                  <Typography variant="h4" component="h2" gutterBottom>
                    <strong>Welcome to Skoop!</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Navigate through above buttons to get started.
                  </Typography>
                  <Link href="https://play.vidyard.com/XywsZaajMzPAB3WUima3gU" target="_blank" rel="noopener noreferrer">
                    How Skoop Works
                  </Link>
                </CardContent>
              </Card>
            </div>
          </Container>
          </>
      } 
    </div>
  );
};

export default Homepage;