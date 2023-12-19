import React, { useContext } from 'react';
import { Container, Card, CardContent, Typography, Link } from '@material-ui/core';
import ScreenContext from '../../contexts/ScreenContext';
import { Button } from 'react-bootstrap';

const LinkedInCom = () => {
  const { navigateToPage } = useContext(ScreenContext);
  return (
    <>
      <Button
        variant="outline-primary"
        className="mx-auto d-block mt-4"
        onClick={() => navigateToPage("ChatPage")}
      >
        Customized DM Message Options
      </Button>


      <Button
        variant="outline-success"
        className="mx-auto d-block mt-4 mb-8"
        onClick={() => navigateToPage("ContactPage")}
      >
        LinkedIn Profile Info Scraper
      </Button>

      <Container className='top-margins'>
        <div className="row justify-content-center">
          <Card className="col-md-10 mt-15 mb-20">
            <CardContent className="text-center mb-20">
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
  );
};

export default LinkedInCom;
