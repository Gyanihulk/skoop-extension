import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const MobileFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        height: '50px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1201 // The z-index for AppBar is 1100
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Skoop - 
          <Link color="inherit" href="#">Privacy Policy</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default MobileFooter;
