import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import AuthContext from '../contexts/AuthContext';
import ScreenContext from '../contexts/ScreenContext';



function SignIn2() {
    const {handleSocialLogin  } = useContext(AuthContext);

    const { navigateToPage } = useContext(ScreenContext);
  return (
    // <div className="App" style={{backgroundImage: `url('https://images.unsplash.com/photo-1593697972496-8f31cba830f2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`, minHeight: '100vh'}}>
    //   <div className="container d-flex flex-column justify-content-between">
    //   <div className="mb-5"></div>
    //   <div className="row">
    //                 <div className="col-md-6"></div>
    //                 <div className="col-md-6 mt-5 text-end">
    //                     <h2 className="text-white">Welcome Back!</h2>
    //                     <p className="text-white">It’s time to get more clients and connect again with old connections</p>
    //                 </div>
    //             </div>
    //     <div className="mb-5"></div>
    //     <div className="row mt-auto">
    //       <div className="col-md-4">
    //         <button type="button" className="btn btn-primary btn-lg btn-block w-100 button-size" onClick={() => handleSocialLogin(2)}>continue with Google</button>
    //       </div>
    //       <div className="col-md-4">
    //         <button type="button" className="btn btn-primary btn-lg btn-block w-100 mt-3 button-size" onClick={() => handleSocialLogin(1)}>continue with LinkedIn</button>
    //       </div>
    //       <div className="mb-5"></div>
    //       <div className="col-md-4">
    //         <button type="button" className="btn btn-lg btn-block w-100 mt-3 mb-2 email-button" onClick={() => navigateToPage('SignIn')} >Login with Email </button>
    //       </div>
    //       <div
                                    
    //                                 className="form-text text-center mb-2 text-light"
    //                             >
    //                                 New to Skoop?{' '}
    //                                 <a
    //                                     href="#"
    //                                     onClick={() => navigateToPage('SignUp')}
    //                                     className="fw-bold footer-font"
                                        
                                        
    //                                 >
    //                                     {' '}
    //                                     Create an Account
    //                                 </a>
    //                             </div>
    //     </div>
    //   </div>
    // </div>


    <div className="signin-background-image">
      <div className="container-fluid h-100 d-flex flex-column justify-content-between">
        <div className="text-center mb-5">
        </div>

        <div className="text-right mt-5 mb-2">
          {/* Second Element */}
        </div>

        <div className="text-end mb-5">
        <h3 className="text-white">Hii, Welcome Back!</h3>
          <p className="text-white">It’s time to get more clients and connect again with old connections</p>
          {/* Third Element */}
        <button type="button" className="btn btn-primary btn-lg btn-block w-100 button-size mt-4 mb-2" style={{ backgroundColor: '#2D68C4', fontSize: '16px', fontWeight: '600' }} onClick={() => handleSocialLogin(2)}>Login with Google</button>
        <button type="button" className="btn btn-primary btn-lg btn-block w-100 button-size mb-4" style={{ backgroundColor: '#2D68C4', fontSize: '16px', fontWeight: '600' }} onClick={() => handleSocialLogin(1)}>Login with LinkedIn</button>
        <button type="button" className="btn btn-lg btn-block w-100 mt-3 mb-2"
        style={{
          backgroundColor: 'white',
          color: '#2D68C4',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600'
        }} onClick={() => navigateToPage('SignIn')} >Login with email </button>

          <div
            className="form-text text-center mb-2 text-light"
              >
              New to Skoop?{' '}
              <a
            href="#"
            onClick={() => navigateToPage('SignUp')}
            className="fw-bold footer-font"                                   
            >
            {' '}
            Create an Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn2;
