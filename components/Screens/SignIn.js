import React, { useState, useEffect, useContext } from 'react';
import { FaSignInAlt, FaTimes } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
import API_ENDPOINTS from '../apiConfig';
import AuthContext from '../../contexts/AuthContext';
import ScreenContext from '../../contexts/ScreenContext';
// import toast, { Toaster } from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
function SignIn() {
    const { handleSkoopLogin, handleSocialLogin } = useContext(AuthContext);
    const { navigateToPage } = useContext(ScreenContext);
    // useEffect(() => {
    //   (async () => {
    //     const res = await verifyToken();
    //     if (res.ok) props.changePage('Home');
    //   })();
    // }, []);

   {/*const message = { message: 'SignIn',width:"450px",height:"700px" };
    chrome.runtime.sendMessage(message, function(response) {
        console.log('Received response:', response);
        if(response && response?.url.startsWith("www.linkedin.com")){
          setIsLinkedin(true)
        }
      }); */}

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card my-1">
                            <form
                                className="card-body cardbody-color p-lg-5"
                                onSubmit={handleSkoopLogin}
                            >
                                <h2 className="text-center text-dark mt-3">Sign In</h2>

                                <div className="text-center">
                                    <img
                                        src="chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/icons/icon.png"
                                        className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                        width="100px"
                                        alt="profile"
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="password"
                                    />
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary mb-3 w-100">
                                        Login
                                    </button>
                                </div>
                                <div className="text-center">
                                    <small class="text-muted">OR</small>
                                    <h6>Sign In With</h6>
                                </div>
                                <h6 className="text-center"></h6>
                                <div className="mb-3">
                                    <div class="d-flex justify-content-around">
                                        {' '}
                                        <FaGoogle size={64} onClick={() => handleSocialLogin(2)} />
                                        <FaLinkedin
                                            size={64}
                                            onClick={() => handleSocialLogin(1)}
                                        />
                                    </div>
                                </div>
                                <div
                                    id="emailHelp"
                                    className="form-text text-center mb-2 text-dark"
                                >
                                    Not Registered?{' '}
                                    <a
                                        href="#"
                                        onClick={() => navigateToPage('SignUp')}
                                        className="text-dark fw-bold"
                                    >
                                        {' '}
                                        Create an Account
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

export default SignIn;
