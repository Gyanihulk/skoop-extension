import React, { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { FaCheckCircle } from 'react-icons/fa';
const SubscriptionScreen = () => {
    const { createSubscription } = useContext(AuthContext);
    const [subscriptionType, setSubscriptionType] = useState('monthly');
    const [sessionUrl, setSessionUrl] = useState('');
    const handleSubscriptionChange = (type) => {
        setSubscriptionType(type);
    };

    const handleCreateSubscription = async () => {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const session = await createSubscription({
            start_date: startDate,
            plan_type: subscriptionType,
        });
        setSessionUrl(session.url);
    };
    const [couponCode, setCouponCode] = useState('');

    // A function to handle changes to the input field
    const handleInputChange = (event) => {
        // Update the 'couponCode' state with the input's current value
        setCouponCode(event.target.value);
    };
    return (
        <div className="subscription-container">
            <div className="subscription-header">
                {/* {sessionUrl && (
                <iframe 
                    src={sessionUrl} 
                    style={{width: '100%', height: '600px', border: 'none'}} 
                    title="Subscription Session"
                ></iframe>
            )} */}
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
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="circleCheckbox"
                        checked={subscriptionType === 'monthly'}
                        onChange={() => handleSubscriptionChange('monthly')}
                    />
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
                            checked={subscriptionType === 'yearly'}
                            onChange={() => handleSubscriptionChange('yearly')}
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

            <div className="d-flex flex-column">
                <div class="input-group mb-3">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        value={couponCode} // Set the input value to the 'couponCode' state
                        onChange={handleInputChange}
                    />
                    <span class="input-group-text" id="basic-addon2">
                        <FaCheckCircle />
                        Check
                    </span>
                </div>
            </div>
            <div className="subscription-button d-grid gap-2">
                <button
                    className="btn btn-primary btn-trial"
                    type="button"
                    onClick={handleCreateSubscription}
                >
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
