import React, { useContext } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import AuthContext from '../contexts/AuthContext';
const SubscriptionScreen = () => {
    const { createSubscription } = useContext(AuthContext);
    return (
        <div className="subscription-container">
            <div className="subscription-header">
                {/* <button type="button" className="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button> */}
                <h1>Start your 3-day free trial.</h1>
                <span>Unlock all the premium benfits now.</span>
                <ul className="feature-list">
                    <li>🔓 Accessibility to all features</li>
                    <li>✉️ Send unlimited messages</li>
                    <li>⚡ Faster AI generated responses</li>
                </ul>
            </div>
            <svg
                width="315"
                height="1"
                viewBox="0 0 315 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line y1="0.5" x2="315" y2="0.5" stroke="black" stroke-opacity="0.2" />
            </svg>

            <div className="subscription-options">
                <div className="subscription-option d-flex flex-row align-items-center bg-monthly">
                    <input class="form-check-input" type="checkbox" value="" id="circleCheckbox" />
                    <div className="ps-4 pt-2">
                        <h5>Monthly</h5>
                        <p>First 3 days free, then $45/month</p>
                    </div>
                </div>
                <div className="subscription-option d-flex flex-row align-items-center bg-yearly">
                    <div>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="circleCheckbox"
                        />
                    </div>

                    <div className="ps-4 pt-2">
                        <h5>
                            Yearly{' '}
                            <span className="badge rounded-pill bg-warning text-dark">
                                SAVE 20%{' '}
                            </span>
                        </h5>
                        <p>First 3 days free, then $432/year</p>
                    </div>
                </div>
            </div>

            <div className="subscription-button d-grid gap-2">
                <button className="btn btn-primary btn-trial" type="button" onClick={()=>createSubscription({subscription_start: "2024-01-01",subscription_type:"Monthly"})}>
                    START 3-DAY FREE TRIAL
                </button>
                <span classNameName="px-2">
                    3 days free,then $45/month,Free trial only offered to first time subscribers
                </span>
            </div>
            <div className="subscription-footer">
                <a href="#">Privacy policy</a> <a href="#">Terms of use</a>
            </div>
        </div>
    );
};

export default SubscriptionScreen;
