const defaultOptions = {
    arrowColor: '#fff',
    backgroundColor: '#fff',
    beaconSize: 36,
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    primaryColor: '#f04',
    spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    textColor: '#333',
    width: 380,
    zIndex: 100,
  }

  const overlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '715px',
  }
  
  const buttonBase = {
    fontFamily:'Montserrat',
    fontSize: 12,
    fontWeight:500,
    fontFamily:'Montserrat',
    lineHeight: 1.7,
  };
  
  const spotlight = {
    borderRadius: 4,
    position: 'absolute',
  };

  const buttonNext =  {
           ...buttonBase,
            backgroundColor: '#2d68c4',
            borderRadius: '20px',
            color: '#fff',
            padding: '5px 15px',
  };

  const buttonBack = {
    ...buttonBase,
            display: 'none',
            color: '#2d68c4',
            marginLeft: 'auto',
            marginRight: '5px',
  };

  const buttonClose = {
    ...buttonBase,
    height: '10px',
    padding: '10px',
    width: '10px',
  }

  const buttonSkip = {
    ...buttonBase,
    color: "#2a2b39",
    padding:'8px 8px 8px 0px',
  };

  const tooltip =  {
    maxWidth: '100%',
    padding: 12,
    left: '50%',
    transform: 'translateX(-50%)',
  };

  const tooltipFooter = {
      marginTop: 5,
    };

  const tooltipContainer = {
      lineHeight: 1.4,
      textAlign: 'center',
    };
    const tooltipTitle = {
      margin: 0,
      color:"#93c47dff",
      fontSize: 13,
      fontWeight: 400,
      fontStrech:"normal",
      fontStyle:"normal",

    };
    const tooltipContent = {
      fontSize: 14,
      fontFamily:'"Montserrat", sans-serif',
      display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '12px 10px 10px',
            fontWeight:500,
            color:"#59d522",
            fontStrech:"normal",
            fontStyle:"normal",
      
    };

  export { defaultOptions, buttonNext, buttonBack, buttonClose, spotlight, buttonSkip, tooltipContainer, tooltipTitle, tooltipContent, tooltip, tooltipFooter, overlay }