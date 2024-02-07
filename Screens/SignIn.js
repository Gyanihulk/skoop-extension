import React, { useState, useEffect, useContext } from 'react';
import { FaSignInAlt, FaTimes } from 'react-icons/fa';
import API_ENDPOINTS from '../components/apiConfig';
import AuthContext from '../contexts/AuthContext';
import ScreenContext from '../contexts/ScreenContext';
import { FaGoogle } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa6";



function SignIn() {
    const { handleSkoopLogin, handleSocialLogin, rememberMe, setRememberMe  } = useContext(AuthContext);

    const { navigateToPage } = useContext(ScreenContext);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    const handleCheckboxChange = () => {
        setRememberMe(!rememberMe);
    };

    (function () {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
      
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
          .forEach(function (form) {
            form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
              }
      
              form.classList.add('was-validated')
            }, false)
          })
      })()
      
    return (
            <div>
                <div className="container" style={{  fontFamily: "'Montserrat', sans-serif"}}>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card my-1" style={{ border: 'none' }}>
                        <div className="mb-5"></div>
                            <form
                                className="card-body cardbody-color p-lg-5 needs-validation"
                                onSubmit={handleSkoopLogin}
                                novalidate
                                style={{ paddingTop: '100px', fontFamily: "'Lato', sans-serif"}}
                            >
                                <h2 className="text-center text-dark mt-7" style={{ fontWeight: '600'}}>Welcome Back!</h2>
                                <h6 className="text-center" style={{ color: "rgba(44, 45, 46, 0.5)",fontSize: "14px"}}>Sign in with email</h6>
                                <div className="mb-5"></div>
                                <div className="mb-3 has-validation">
                                    <input
                                        type="text"
                                        className="form-control form-control-sign-in "
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder="Email address"
                                        name="username"
                                        required
                                        style={{ color: "rgba(44, 45, 46, 0.5)"}}
                                    />
                                     <div className="invalid-feedback">
                                        Please choose a username.
                                    </div>
                                </div>
                                <div className="mb-3 position-relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className=" form-control form-control-sign-in "
                                        id="password"
                                        placeholder="Password"
                                        name="password"
                                        required
                                        style={{ color: "rgba(44, 45, 46, 0.5)"}}
                                    />
                                    <button
                                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y password-icon"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {/* <div className="text-start mb-3">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor="rememberMe" className="ms-2">
                                        Keep me Signed In
                                    </label>
                                </div> */}

                                <div
                                    id="emailHelp"
                                    className="form-text text-start mb-2"
                                >
                                    <a
                                        href="#"
                                        onClick={() => navigateToPage('ForgotPassword')}
                                        className="text-dark"
                                        style={{ textDecoration: 'none' , fontWeight: 500 ,fontSize: '12px'}}
                                    >
                                        {' '}
                                        Forgot Password?
                                    </a>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary btn-lg mt-3 mb-2 w-100" style={{ backgroundColor: '#2D68C4', fontSize: '16px',
                                            fontWeight: '400' }}
                                    >
                                        Sign in
                                    </button>
                                </div>
                                <div className="text-center mt-5 mb-2" style={{ paddingTop: '10px' ,backgroundColor:"#FFFFFF"}}>
                                    <h6>or Sign in with</h6>
                                </div>
                                <h6 className="text-center"></h6>
                                <div className="mb-3">

                                <div className="text-center" style={{  fontFamily: "'Poppins', sans-serif"}}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg mt-2 mb-3 w-100"  style={{ backgroundColor: '#007BB5', fontSize: '14px' ,fontWeight: "300"}}
                                            onClick={() => handleSocialLogin(1)}
                                        >
                                            <FaLinkedinIn className='button-icon' /> Continue with LinkedIn
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-outline-dark btn-lg mb-3 w-100 button-size" style={{fontSize: '14px' ,fontWeight: "300"}}
                                            onClick={() => handleSocialLogin(2)}
                                        >
                                            <FcGoogle className='button-icon' /> Continue with Google
                                        </button>
                                    </div>

                                    {/* <div class="d-flex justify-content-around">
                                        {' '}
                                        <FaGoogle size={64} color="red" className="clickable-icon" onClick={() => handleSocialLogin(2)} />
                                        <FaLinkedin
                                            size={64}
                                            color="#0A66C2"
                                            onClick={() => handleSocialLogin(1)}
                                            className="clickable-icon"
                                        />
                                    </div> */}
                                </div>
                                <div
                                    id="emailHelp"
                                    className="form-text text-center mb-2 text-dark"
                                >
                                    Not Registered?{' '}
                                    <a
                                        href="#"
                                        onClick={() => navigateToPage('SignUp')}
                                        className="fw-bold footer-font"
                                        
                                    >
                                        {' '}
                                        Create an Account
                                    </a>
                                </div>
                                {/* <div
                                    id="emailHelp"
                                    className="form-text text-center mb-5 text-dark"
                                >
                                    <a
                                        href="#"
                                        onClick={() => navigateToPage('ForgotPassword')}
                                        className="text-dark fw-bold"
                                    >
                                        {' '}
                                        ForgotPassword?
                                    </a>
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>
                </div>
        </div>
    );
}

export default SignIn;
