import React from 'react';
import { Container, Card, CardContent, Typography, Link } from '@material-ui/core';

const LindedInCom = (props) => {
  return (
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
  );
};

export default LindedInCom;