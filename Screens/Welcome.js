import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScreenContext from '../contexts/ScreenContext';

const Welcome = () => {
    const { navigateToPage } = useContext(ScreenContext);

    return (
        <div className="welcome-background-image">
            <button
                className="get-started-button"
                onClick={() => {navigateToPage('SignInIntro'); localStorage.setItem('welcomePageShown',true)}}
            >
            </button>
        </div>
    );
};

export default Welcome;
