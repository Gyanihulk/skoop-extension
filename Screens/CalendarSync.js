import React, { useContext, useEffect } from 'react';
import ScreenContext from '../contexts/ScreenContext';
import AuthContext from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from "react-icons/fa";
import API_ENDPOINTS from '../components/apiConfig';


const CalendarSync = () => {
    const { calendarSync  } = useContext(AuthContext);
    const {  navigateToPage } = useContext(ScreenContext);
// useEffect(()=>{
//     const handleSubmit = async () => {

//         const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//         try {
//             const res = await fetch(API_ENDPOINTS.userPreferences, {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     preferred_start_time: "09:00",
//                     preferred_end_time: "17:00",
//                     time_zone: detectedTimezone,
//                     additional_details: "Update this details from the extnsion account settings"
//                 }),
//                 headers: {
//                     "Content-type": "application/json; charset=UTF-8",
//                     "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
//                 },
//             });
// console.log(res.json())
            
//         } catch (err) {
//            console.log(err)
//         }
//     };
//     handleSubmit();
// },[])
    
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
                            <FcGoogle  />
                            <h5 class="mb-1">Google Calendar</h5>
                            <p class="mb-1">Sync Events with Google Calendar.</p>
                        </div>
                        <span class="badge badge-primary badge-pill"></span>
                    </div>
                    <div
                     onClick={()=>calendarSync('microsoft')}
                        href="#"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                        <div>
                        <FaMicrosoft  />
                            <h5 class="mb-1">Outlook Calendar</h5>
                            <p class="mb-1">
                                Office 365, Outlook.com, live.com, or hotmail calendar
                            </p>
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
