import React, { useContext } from 'react';
import ScreenContext from '../contexts/ScreenContext';
import AuthContext from '../contexts/AuthContext';



const CalendarSync = () => {
    const { calendarSync  } = useContext(AuthContext);
    const handleLogin = async () => {};
    const {  navigateToPage } = useContext(ScreenContext);
    return (
        <>
            <div class="container">
                <h2 class="my-4">Connect your calendar</h2>
                <p>
                    Connect your calendar to auto-check for busy times and add new events as they
                    are scheduled.
                </p>

                <div class="list-group">
                    <div
                        onClick={()=>calendarSync('google')}
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <h5 class="mb-1">Google Calendar</h5>
                            <p class="mb-1">Sync Events with Google Calendar.</p>
                        </div>
                        <span class="badge badge-primary badge-pill"></span>
                    </div>
                    <a
                        href="#"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <h5 class="mb-1">Outlook Calendar</h5>
                            <p class="mb-1">
                                Office 365, Outlook.com, live.com, or hotmail calendar
                            </p>
                        </div>
                        <span class="badge badge-primary badge-pill"></span>
                    </a>
                    <div
                        onClick={()=>calendarSync('calendly')}
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <h5 class="mb-1">Calendly </h5>
                            <p class="mb-1">Sync Events with Calendly.</p>
                        </div>
                        <span class="badge badge-primary badge-pill"></span>
                    </div>
                </div>

                <div onClick={()=>navigateToPage('Home')} class="btn btn-link mt-4">
                    Continue without calendar
                </div>
            </div>
        </>
    );
};

export default CalendarSync;
