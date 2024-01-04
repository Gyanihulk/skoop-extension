import React, { useState, useEffect, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb';
import API_ENDPOINTS from '../components/apiConfig';
import { timezones } from '../lib/timezones';
import AuthContext from '../contexts/AuthContext';
import ScreenContext from '../contexts/ScreenContext';

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
                                <h2 className="text-center text-dark mb-2">Sign Up</h2>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first-name"
                                        placeholder="First Name"
                                        name="firstName"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last-name"
                                        placeholder="Last Name"
                                        name="lastName"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Email Address"
                                        name="email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        name="password"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirm-password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        required
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
                                    <button type="submit" className="btn btn-primary mb-3 w-100">
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
        </div>
    );
}
