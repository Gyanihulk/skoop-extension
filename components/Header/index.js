import { useContext, useState, useEffect } from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { MdAccountCircle, MdNotificationsActive, MdClose, MdSaveAlt } from 'react-icons/md';
import { FaExpandAlt, FaExpandArrowsAlt } from 'react-icons/fa';
import GlobalStatesContext from '../../contexts/GlobalStates';
import { FaRegCalendarCheck } from 'react-icons/fa';
import ScreenContext from '../../contexts/ScreenContext';
import API_ENDPOINTS from '../apiConfig';
import { FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import ProfileScraper from '../ProfileScraper/index.js';

export default function Header() {
    const { navigateToPage, activePage } = useContext(ScreenContext);
    const { setScraperPage, scraperPage, isProfilePage } = useContext(GlobalStatesContext);
    const [expand, setExpand] = useState(false);

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

    

    const toggleProfileDropdown = () => {
        setProfileOpen(!profileOpen);
    };

    const handleLogOut = () => {
        localStorage.setItem('accessToken', JSON.stringify('none'));
        navigateToPage('SignIn');
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
                    console.log('the tab exists');
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
                    console.log('the tab exists');
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
        window.open(
            `${API_ENDPOINTS.skoopCalendarUrl}/index.php/user/login`,
            '_blank'
        );
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
                <div class="navbar-brand">
                    <div className="container">
                        <div class="row justify-content-left px-3">
                            {/* <div className="col">
                                <FaExpandArrowsAlt className="icon-style-normal" />
                            </div> */}

                            <div className="col px-5">
                                {(activePage ==="ContactPage" || activePage ==="AccountSettings") && (
                                    <BsArrowLeftCircle
                                        className="icon-style-normal"
                                        onClick={() => {
                                            navigateToPage('Home');
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex ml-auto align-items-center">
                    {isProfilePage && (
                        <button
                            className="btn btn-link"
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
                    {/* Calendar Link */}
                    <button
                        className="btn btn-link"
                        onClick={openCalendarWindow}
                        data-mdb-toggle="tooltip"
                        data-mdb-placement="bottom"
                        title="Go to your Meeting Calendar Schedular"
                    >
                        <FaRegCalendarCheck className="icon-style-normal" />
                    </button>

                  

                    {/* Profile Dropdown */}
                    <div className={`nav-item dropdown custom ${profileOpen ? 'show' : ''}`}>
                        <button className="btn btn-link dropstart" 
                                onClick={toggleProfileDropdown}
                                data-mdb-toggle="tooltip"
                                data-mdb-placement="bottom"
                                title="User Profile">
                            <MdAccountCircle className="icon-style-normal" />
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
                            <button className="dropdown-item"
                            onClick={() => {
                                handleLogOut();
                                toggleProfileDropdown();
                            }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    <button
                        className="btn btn-link"
                        data-mdb-toggle="tooltip"
                        data-mdb-placement="bottom"
                        title="Expand/Shrink"
                        onClick={expandMinimizeExtension}
                    >
                        {expand ? (
                            <FiMaximize2 className="icon-style-normal" />
                        ) : (
                            <FiMinimize2 className="icon-style-normal" />
                        )}
                    </button>
                    <button
                        className="btn btn-link"
                        data-mdb-toggle="tooltip"
                        data-mdb-placement="bottom"
                        title="Close"
                        onClick={closeExtension}
                    >
                        <MdClose className="icon-style-normal" />
                    </button>
                </div>
            </nav>
        </>
    );
}
