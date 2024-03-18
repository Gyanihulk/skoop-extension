import { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

const FingerprintIframe = () => {
    const { setIpAddress, setOperatingSystem, setFingerPrint, createUserDevice } =
        useContext(AuthContext);
    useEffect(() => {
        const getIpAddress = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIpAddress(data.ip);
                return data.ip;
            } catch (err) {
                console.log(err);
            }
        };

        const getUserOS = () => {
            const userAgent = window.navigator.userAgent;
            const platform = window.navigator.platform;
            const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
            const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
            const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
            let os = null;

            if (macosPlatforms.indexOf(platform) !== -1) {
                os = 'Mac OS';
            } else if (iosPlatforms.indexOf(platform) !== -1) {
                os = 'iOS';
            } else if (windowsPlatforms.indexOf(platform) !== -1) {
                os = 'Windows';
            } else if (/Android/.test(userAgent)) {
                os = 'Android';
            } else if (!os && /Linux/.test(platform)) {
                os = 'Linux';
            }

            return os;
        };

        const handleFingerprintResult =async (event) => {
          const ip =await getIpAddress()
      
            if (event.origin === 'https://skoopcrm.sumits.in') {
                if (event.data) {
                  const ipInfo=
                    createUserDevice({
                        device_id: event.data.data.visitorId,
                        ip_address: ip,
                        operating_system: getUserOS(),
                        data_dump: JSON.stringify(event.data), // any additional data as a JSON string
                    });
                }
                setFingerPrint(event.data);
            }
        };

        // Add event listener for the 'message' event
        window.addEventListener('message', handleFingerprintResult);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('message', handleFingerprintResult);
        };
    }, []);

    return (
        <iframe
            src="https://skoopcrm.sumits.in/authentication/sign-in/cover"
            style={{
                display: 'none',
            }}
            title="Fingerprint Frame"
        ></iframe>
    );
};

export default FingerprintIframe;
