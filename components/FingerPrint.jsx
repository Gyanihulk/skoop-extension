import { useEffect, useState } from 'react';

const FingerprintIframe = () => {
    const [ipAddress, setIpAddress] = useState('');
    const [operatingSystem, setOperatingSystem] = useState('');
    const [fingerPrint,setFingerPrint]=useState()
    useEffect(() => {
        const getIpAddress = async () => {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            setIpAddress(data.ip);
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
      
          getIpAddress();
          setOperatingSystem(getUserOS());
        const handleFingerprintResult = (event) => {
            if (event.origin === 'https://skoopcrm.sumits.in') {
                console.log('Fingerprint data received:', event.data);
                setFingerPrint(event.data)
            }
        };

        // Add event listener for the 'message' event
        window.addEventListener('message', handleFingerprintResult);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('message', handleFingerprintResult);
        };
    }, []);
console.log(ipAddress,operatingSystem,fingerPrint,"from fingerprint component");
    return (
        <iframe
            src="https://skoopcrm.sumits.in/authentication/sign-in/cover" // The URL of your page that has the fingerprint script
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display:'none'
            }}
            title="Fingerprint Frame"
        ></iframe>
    );
};

export default FingerprintIframe;
