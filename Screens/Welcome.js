import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScreenContext from '../contexts/ScreenContext';

const Welcome = () => {
    const { navigateToPage } = useContext(ScreenContext);

    return (
        <div className="welcome-main">
            <div className='welcome-logo'>
                <img src="/screens/logo.png" alt="Skoop" />
            </div>
            <div className='welcom-content'>
                <h3>Welcome to</h3>
                <h1>Skoop<br />Application</h1>
                <button className='get-start-btnw-100' onClick={() => { navigateToPage('SignInIntro'); localStorage.setItem('welcomePageShown', true) }}>
                    Get started
                </button>
            </div>
        </div>
    );
};

export default Welcome;
