import React, { useState, useEffect, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb';
import API_ENDPOINTS from '../apiConfig';
import { timezones } from '../../lib/timezones';
import AuthContext from '../../contexts/AuthContext';
import ScreenContext from '../../contexts/ScreenContext';

function Copyright() {
    return (
      <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-xs-auto text-secondary text-center">
          {'Copyright © '}
          <a href="https://appfoster.com/" className="text-inherit">
            Skoop
          </a>{' '}
          {new Date().getFullYear()}
          {'.'}
        </div>
      </div>
    </div>
    );
}

export default function SignUp(props) {
    const [selectedOption, setSelectedOption] = React.useState('');

    const { handleRegister } = useContext(AuthContext);
    const { navigateToPage } = useContext(ScreenContext);
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card my-5">
                            <form
                                className="card-body cardbody-color p-lg-5"
                                onSubmit={handleRegister}
                            >
                                <h2 className="text-center text-dark mt-5">Sign Up</h2>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first-name"
                                        placeholder="First Name"
                                        name="firstName"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last-name"
                                        placeholder="Last Name"
                                        name="lastName"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Email Address"
                                        name="email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        name="password"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirm-password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                    />
                                </div>
                                <div className="mb-3">
                                    <select className="form-select" id="timezone" name="timezone">
                                        <option selected>Select Timezone</option>
                                        {timezones.map((option, index) => (
                                          <option key={index} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-color px-5 mb-5 w-100">
                                        Sign Up
                                    </button>
                                </div>

                                <div className="form-text text-center mb-5 text-dark">
                                    Already have an account?{' '}
                                    <a
                                        href="#"
                                        onClick={() => navigateToPage('SignIn')}
                                        className="text-dark fw-bold"
                                    >
                                        Sign in
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Container style={{ maxWidth: '90%', height: '70%', marginTop: '7rem', borderRadius: '1rem', position: 'relative' }}>
      <Row className="justify-content-md-center">
      <Col xs={12} md={10}>
      <div className="text-center mb-4">
            <TbListDetails style={{ fontSize:"16px" }}/> 
            <h2>Sign Up</h2>
          </div>
          <Form noValidate onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                required
                name="firstName"
                autoComplete="given-name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                required
                name="lastName"
                autoComplete="family-name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email Address"
                required
                name="email"
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="timezone">
              <Form.Select
                value={selectedOption}
                required
                name="timezone"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option>Select Timezone</option>
                {timezones.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <br></br>
            <button 
            type="submit" 
            className=" w-100 mb-2" 
            style={{ fontSize: '1.5rem', color:'#FFFFFF', backgroundColor:'#0a66c2', border: '1' }}>
              Sign Up
            </button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-center">
        <Col xs={12} className="text-center">
          <p>
            Already have an account?{' '}
            <a
                href="#"
                className="text-secondary"
                onClick={() => {
                  navigateToPage('SignIn');
                }}
              >
                Sign in
              </a>
          </p>
        </Col>
      </Row>
      <Copyright/>
    </Container> */}
        </div>
    );
}
