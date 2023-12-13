import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { FaSignInAlt, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import API_ENDPOINTS from './apiConfig';
import toast, { Toaster } from 'react-hot-toast';

function Copyright() {
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs="auto" className="text-secondary text-center">
          {'Copyright © '}
          <a href="https://appfoster.com/" className="text-inherit">
            Skoop
          </a>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Col>
      </Row>
    </Container>
  );
}

function SignIn(props) {
  const [logInMode, setLogInMode] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    try {
      const response = await fetch(API_ENDPOINTS.signIn, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (response.ok) {
        const resjson = await response.json();
        localStorage.setItem('accessToken', JSON.stringify(resjson.accessToken));
        localStorage.setItem('skoopUsername', JSON.stringify(resjson.skoopUsername));
        props.changePage('Home');
      } else {
        alert('Incorrect username or password');
      }
    } catch (err) {
      alert('Something went wrong, please try again');
    }
  };

  const handleSignIn = async (type) => {
    try {
      if (type === 1) {
        window.open(API_ENDPOINTS.linkedInAuthCode);
        setLogInMode(1);
      } else {
        window.open(API_ENDPOINTS.GoogleAuthCode);
        setLogInMode(2);
      }
    } catch (err) {
      console.log(err);
      alert('Something went wrong, please try again');
    }
  };

  const verifyToken = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.tokenStatus, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      });
      return res;
    } catch (err) {
      return { ok: false };
    }
  };

  useEffect(() => {
    (async () => {
      const res = await verifyToken();
      if (res.ok) props.changePage('Home');
    })();
  }, []);

  const handleAuthCode = async (event, type) => {
    const url = type === 1 ? API_ENDPOINTS.linkedInLogIn : API_ENDPOINTS.GoogleLogIn;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const authCode = data.get('authCode');
    const loadingObj=toast.loading("uploading video...")
    try {
      var result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          code: authCode,
        }),
      });
      result = await result.json();
      toast.success("video uploaded,encoding in progress",{
        id: loadingObj
      })
      localStorage.setItem('accessToken', JSON.stringify(result.accessToken));
      localStorage.setItem('skoopUsername', JSON.stringify(result.skoopUsername));
      props.changePage('Home');
    } catch (err) {
      toast.dismiss();
      toast.error("Sign in failed")
    }
  };

  if (logInMode !== 0) {
    return (
      <Card style={{ height: 'max-content', width: '30rem', margin: 'auto', marginTop: '15rem' }}>
        <Toaster/>
        <Card.Body>
          <Form onSubmit={(event) => handleAuthCode(event, logInMode)} noValidate>
            <Form.Label>Enter the generated code</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                id="authCode"
                name="authCode"
                autoComplete="authCode"
                autoFocus
                required
              />
              <button
                variant="success"
                type="button"
                style={{background:'none', border:'none', color:'#83941f'}}
                onClick={() =>
                  navigator.clipboard.readText().then((text) => (document.getElementById('authCode').value = text))
                }
              >
                Paste
              </button>
            </InputGroup>
            <button type="submit" style={{ background:'none', border:'none', marginRight: '1rem', color:"#0a66c2" }}>
              Sign In
            </button>
            <button type="button" style={{ background:'none', border:'none', color:"#000000", marginRight: '3rem'}} onClick={() => setLogInMode(0)}>
              Back
            </button>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
    <FaTimes style={{ cursor: 'pointer', fontSize: '2rem', position: 'absolute', top: '2', right: '3' }} onClick={props.close} />
    <Container style={{ maxWidth: '90%', height: '70%', marginTop: '7rem', borderRadius: '1rem', position: 'relative' }}>
      <Row className="justify-content-md-center">
        <Col xs={12} md={10}>
          <div className="text-center">
            <FaSignInAlt style={{ fontSize:"16px" }}/>
            <h2>Sign in</h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>E-mail address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required name="username" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required name="password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <br></br>
            <button 
            type="submit" 
            className=" w-100 mb-2" 
            style={{ fontSize: '1.3rem', backgroundColor:'#FFFFFF', border: '1' }}>
              Sign In
            </button>
            <button
              type="button"
              className=" w-100 mb-2 d-flex align-items-center justify-content-center"
              onClick={() => handleSignIn(1)}
              style={{ fontSize: '1.3rem', color:'#FFFFFF', backgroundColor:'#0a66c2', border: 'none' }}
            >
              <span className="ml-2">Sign In With LinkedIn</span>
            </button>
            <button 
            type="button" 
            className=" w-100 mb-2 d-flex align-items-center justify-content-center" 
            onClick={() => handleSignIn(2)} 
            style={{ fontSize: '1.3rem', color:'#FFFFFF', backgroundColor:'#EA4335', border: 'none' }}
            >
            <span className="ml-2"> Sign In With Google </span>
            </button>
            <br></br>
            <div className="d-flex justify-content-between mt-3">
              <Link to="#" className="text-secondary">
                Forgot password?
              </Link>
              <Link to="#" onClick={() => props.changePage('SignUp')} className="text-secondary">
                Don't have an account? Sign Up
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
      <Copyright/>
    </Container>
    </div>
  );
}

export default SignIn;
