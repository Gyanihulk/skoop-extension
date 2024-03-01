import { useContext, useState, useEffect } from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { MdAccountCircle, MdClose, MdSaveAlt } from 'react-icons/md';
import GlobalStatesContext from '../../contexts/GlobalStates';
import { FaRegCalendarCheck } from 'react-icons/fa';
import ScreenContext from '../../contexts/ScreenContext';
import API_ENDPOINTS from '../apiConfig';
import AuthContext from '../../contexts/AuthContext.js';
import CarouselComponent from '../HelperVideos/index.js';
import { MdContactSupport } from 'react-icons/md';
import MessageContext from '../../contexts/MessageContext.js';

export default function Header() {
    const { isAutheticated, setisAutheticated } = useContext(AuthContext);
    const { navigateToPage, activePage } = useContext(ScreenContext);
    const { setScraperPage, scraperPage, isProfilePage, expand, setExpand} = useContext(GlobalStatesContext);
    
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const { message, setMessage } = useContext(MessageContext);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileOpen && !event.target.closest('.custom')) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [profileOpen]);

    const toggleCarousel = () => {
        setIsCarouselOpen(!isCarouselOpen);
    };

    const toggleProfileDropdown = () => {
        setProfileOpen(!profileOpen);
    };

    const handleLogOut = () => {
        localStorage.setItem('accessToken', JSON.stringify('none'));
        setisAutheticated(false);
        setMessage();
        navigateToPage('SignInIntro');
    };
    const executeClose = () => {
        const container = document.getElementById('skoop-extension-container');
        container.style.display = 'none';
    };
    const getToggleButton = () => {
        const toggleButton = document.getElementById('skoop-expand-minimize-button');
        toggleButton.click();
    };

    const closeExtension = () => {
        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const targetTab = tabs[0];
                if (targetTab) {
                    try {
                        chrome.scripting.executeScript({
                            target: { tabId: targetTab.id },
                            func: executeClose,
                        });
                    } catch (err) {
                        console.log('some error occured in executing script', err);
                    }
                } else {
                    console.log('the target tab is not accessible');
                }
            });
        } catch (err) {
            console.log('some error occured while setting up initial array');
        }
    };
    const expandMinimizeExtension = () => {
        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const targetTab = tabs[0];
                if (targetTab) {
                    try {
                        chrome.scripting.executeScript({
                            target: { tabId: targetTab.id },
                            func: getToggleButton,
                        });
                    } catch (err) {
                        console.log('some error occured in executing script', err);
                    }
                } else {
                    console.log('the target tab is not accessible');
                }
            });
            if (expand) {
                document.body.style.overflow = 'auto';
            } else {
                document.body.style.overflow = 'hidden';
            }
            setExpand(!expand);
        } catch (err) {
            console.log('some error occured while setting up initial array');
        }
    };

    const openCalendarWindow = () => {
        document.body.style.overflow = 'auto';
        window.open(API_ENDPOINTS.skoopCalendarUrl, '_blank');
    };
    return (
        <>
            <nav className="navbar pe-3" id="Header">
                <div class="navbar-brand d-flex flex-row">
                    <div className="container">
                        <div class="ps-4">
                                {(activePage === 'ContactPage') && (
                                    <BsArrowLeftCircle
                                        className="icon-style-normal"
                                        onClick={() => {
                                            navigateToPage('Home');
                                        }}
                                    />
                                )}
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-end header-text">
                                    Skoop App
                            </div>
                </div>

                <div className="d-flex ml-auto align-items-right">
                    {isAutheticated && (
                        <>
                            {isProfilePage && (
                                <button
                                    className="btn btn-link header-icon"
                                    data-mdb-toggle="tooltip"
                                    data-mdb-placement="bottom"
                                    title="Save Profile Info "
                                    onClick={() => {
                                        navigateToPage('ContactPage');
                                        setScraperPage(!scraperPage);
                                    }}
                                >
                                    <MdSaveAlt className="icon-style-normal" />
                                </button>
                            )}

                            <button
                                className="btn btn-link header-icon"
                                data-mdb-toggle="tooltip"
                                data-mdb-placement="bottom"
                                title="Helper Videos"
                                onClick={toggleCarousel}
                            >
                                <MdContactSupport className="icon-style-normal" />
                            </button>
                            {/* Calendar Link */}
                            <button
                                className="btn btn-link header-icon"
                                onClick={openCalendarWindow}
                                data-mdb-toggle="tooltip"
                                data-mdb-placement="bottom"
                                title="Go to your Meeting Calendar Schedular"
                            >
                                <FaRegCalendarCheck className="icon-style-normal" />
                            </button>

                            {/* Profile Dropdown */}
                            <div
                                className={`nav-item dropdown custom ${profileOpen ? 'show' : ''}`}
                            >
                                <button
                                    className="btn btn-link header-icon dropstart"
                                    onClick={toggleProfileDropdown}
                                    data-mdb-toggle="tooltip"
                                    data-mdb-placement="bottom"
                                    title="User Profile"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M7.0001 6.99998C8.7681 6.99998 10.2001 5.56798 10.2001 3.79998C10.2001 2.03198 8.7681 0.599976 7.0001 0.599976C5.2321 0.599976 3.8001 2.03198 3.8001 3.79998C3.8001 5.56798 5.2321 6.99998 7.0001 6.99998ZM7.0001 8.59998C4.8641 8.59998 0.600098 9.67198 0.600098 11.8V12.6C0.600098 13.04 0.960098 13.4 1.4001 13.4H12.6001C13.0401 13.4 13.4001 13.04 13.4001 12.6V11.8C13.4001 9.67198 9.1361 8.59998 7.0001 8.59998Z"
                                            fill="white"
                                        />
                                    </svg>
                                </button>
                                <div
                                    className={`ddstyle dropdown-menu ${profileOpen ? 'show' : ''}`}
                                    style={{ marginLeft: '-120px' }}
                                >
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            navigateToPage('AccountSettings');
                                            toggleProfileDropdown();
                                        }}
                                    >
                                        Account Settings
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleLogOut();
                                            toggleProfileDropdown();
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        className="btn btn-link header-icon"
                        data-mdb-toggle="tooltip"
                        data-mdb-placement="bottom"
                        title="Expand/Shrink"
                        onClick={expandMinimizeExtension}
                    >
                        {expand ? (
                            <svg
                                width="10"
                                height="2"
                                viewBox="0 0 10 2"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M0.999951 0.200012H8.99995C9.43995 0.200012 9.79995 0.560012 9.79995 1.00001C9.79995 1.44001 9.43995 1.80001 8.99995 1.80001H0.999951C0.559951 1.80001 0.199951 1.44001 0.199951 1.00001C0.199951 0.560012 0.559951 0.200012 0.999951 0.200012Z"
                                    fill="white"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="10"
                                height="2"
                                viewBox="0 0 10 2"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M0.999951 0.200012H8.99995C9.43995 0.200012 9.79995 0.560012 9.79995 1.00001C9.79995 1.44001 9.43995 1.80001 8.99995 1.80001H0.999951C0.559951 1.80001 0.199951 1.44001 0.199951 1.00001C0.199951 0.560012 0.559951 0.200012 0.999951 0.200012Z"
                                    fill="white"
                                />
                            </svg>
                        )}
                    </button>
                    <button
                        className="btn btn-link header-icon"
                        data-mdb-toggle="tooltip"
                        data-mdb-placement="bottom"
                        title="Close"
                        onClick={closeExtension}
                    >
                        <svg
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M10.7139 0.642013C10.5644 0.492211 10.3615 0.408024 10.1499 0.408024C9.93829 0.408024 9.73537 0.492211 9.5859 0.642013L5.6739 4.54601L1.7619 0.634013C1.61244 0.484211 1.40952 0.400024 1.1979 0.400024C0.986288 0.400024 0.783368 0.484211 0.633902 0.634013C0.321902 0.946013 0.321902 1.45001 0.633902 1.76201L4.5459 5.67401L0.633902 9.58601C0.321902 9.89801 0.321902 10.402 0.633902 10.714C0.945902 11.026 1.4499 11.026 1.7619 10.714L5.6739 6.80201L9.5859 10.714C9.8979 11.026 10.4019 11.026 10.7139 10.714C11.0259 10.402 11.0259 9.89801 10.7139 9.58601L6.8019 5.67401L10.7139 1.76201C11.0179 1.45801 11.0179 0.946013 10.7139 0.642013Z"
                                fill="white"
                            />
                        </svg>
                    </button>
                </div>
            </nav>
            {isCarouselOpen && (
                <div>
                    <CarouselComponent />
                </div>
            )}
        </>
    );
}
