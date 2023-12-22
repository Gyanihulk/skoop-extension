import React, { useContext, useEffect } from 'react';
import AuthContext from '../../contexts/AuthContext';
import ScreenContext from '../../contexts/ScreenContext';

const LoadingScreen = () => {
    return (
        <div>
            <div className="loading-screen-container">
                <div className="loading-content">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status"></div>
                        <h2 className="text-dark mt-3">Loading, please wait...</h2>

                        <img
                            src="chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/icons/icon.png"
                            className="img-fluid rounded-circle my-3"
                            width="100px"
                            alt="Loading"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
