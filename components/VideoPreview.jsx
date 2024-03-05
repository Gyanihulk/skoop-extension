import React, { useContext, useEffect, useState } from 'react';
import API_ENDPOINTS from './apiConfig';
import toast from 'react-hot-toast';
import GlobalStatesContext from '../contexts/GlobalStates';

import { FaEdit } from 'react-icons/fa';
import MediaUtilsContext from '../contexts/MediaUtilsContext';
import { handleCopyToClipboard } from '../utils';
import RenameVideoPopup from './Library/RenameVideoPopup';

export const VideoPreview = () => {
    const [thumbnailImage, setThumbnailImage] = useState(
        '/images/videoProcessing.png'
    );
    const [showRenamePopup, setShowRenamePopup] = useState(false);
    const [newTitle, setNewTitle] = useState();
    const { latestVideo, latestBlob ,setLatestVideo} = useContext(GlobalStatesContext);
    const { deleteVideo } = useContext(MediaUtilsContext);
    useEffect(() => {
        console.log(latestVideo, thumbnailImage, 'from video preview ');

        if(latestVideo?.urlForThumbnail){

            setThumbnailImage(latestVideo?.urlForThumbnail);
        }
    }, [latestVideo,showRenamePopup,thumbnailImage]);
    useEffect(() => {
        console.log(latestBlob, 'from video preview ');
    }, [latestBlob, thumbnailImage]);

    const UpdateThumbnail = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailImage(e.target.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('thumbnailImage', file);

            try {
                const res = await fetch(
                    API_ENDPOINTS.updateThumbnailImage + '/' + latestVideo.facade_player_uuid,
                    {
                        method: 'PATCH',
                        body: formData,
                        headers: {
                            authorization: `Bearer ${JSON.parse(
                                localStorage.getItem('accessToken')
                            )}`,
                        },
                    }
                );
                if (res.ok) {
                    const jsonResponse = await res.json();
                    console.log(jsonResponse);
                    setThumbnailImage(jsonResponse?.thumbnailUrl);

                    toast.success('Thumbnail Image Updated');
                } else throw new Error('Error in the database');
            } catch (err) {
                toast.error('Thumbnail Image Not Updated, Try Again');
            }
        }
    };


    const handleRenameSave = async () => {
        try {
            const response = await fetch(
                API_ENDPOINTS.renameVideo + `/${latestVideo?.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        newTitle: newTitle,
                    }),
                }
            );

            if (response.ok) {
                toast.success('Video renamed successfully');
                setShowRenamePopup(!showRenamePopup);
            } else {
                toast.error('Failed to rename video.');
            }
        } catch (error) {
            toast.error('Failed to rename video.');
        }
    };
    const handleDeleteClick = async () => {
        try {
            await deleteVideo(latestVideo.id);
            toast.success('Video deleted successfully');
            setLatestVideo();
        } catch (error) {
            toast.error('Failed to delete video');
        }
    };
    const handleDownload = React.useCallback(() => {
        if (latestBlob) {
            const urlToDownload =
                latestBlob instanceof Blob ? window.URL.createObjectURL(latestBlob) : latestBlob;

            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = urlToDownload;
            a.target = '_blank';
            a.download = 'Skoop video.mp4';
            a.click();

            document.body.removeChild(a);

            if (urlToDownload !== latestBlob) {
                window.URL.revokeObjectURL(urlToDownload);
            }
        }
    }, [latestBlob]);
    if (!latestBlob && !latestVideo) {
        return;
    }
    const handleIconClick = (eventKey) => {
        console.log(eventKey);
        if (eventKey == 'Copy Link') {
            handleCopyToClipboard(
                'https://skoop.hubs.vidyard.com/watch/' + latestVideo?.facade_player_uuid
            );
        }
        if (eventKey == 'Download') {
            handleDownload();
        }
        if (eventKey == 'Update Thumbnail') {
            document.getElementById('file-upload').click();
        }
        if (eventKey == 'Delete') {
            handleDeleteClick();
        }
        if (eventKey == 'Rename') {
            setShowRenamePopup(!showRenamePopup);
        }
    };

    const renderNavButtonItem = (eventKey, icon, tooltipText) => (
        <li key={eventKey} className="rounded-2">
            <>
                <input
                    id="file-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={UpdateThumbnail}
                    accept="image/*"
                />
            </>

            <a
                className="text-decoration-none"
                onClick={() => handleIconClick(eventKey)}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title={tooltipText}
            >
                <div className="d-flex flex-column align-items-center justify-content-center">
                    {React.cloneElement(icon, {
                        className: `svg-icon`,
                    })}
                    <span className="preview-button-bottom-text">{eventKey}</span>
                </div>
            </a>
        </li>
    );

    return (
        <>
        {showRenamePopup && (
                <RenameVideoPopup
                    newTitle={newTitle}
                    onClose={() => {
                        setShowRenamePopup(!showRenamePopup);
                    }}
                    onSave={handleRenameSave}
                    onTitleChange={(e) => setNewTitle(e.target.value)}
                />
            )}

        <div className="container" id="video-Preview">
            
            <div className="card d-flex flex-row align-items-center video-preview-iframe">
                {/* <iframe 
                        src={`https://play.vidyard.com/${latestVideo?.facade_player_uuid}.html?`}
                        className='video-preview-iframe'
                        frameborder="2"
                        ></iframe> */}
                <img className="video-preview-iframe" src={thumbnailImage} />

                <ul className="nav-button" id="preview-video-button">
                    {renderNavButtonItem(
                        'Copy Link',
                        <svg
                            width="9"
                            height="4"
                            viewBox="0 0 9 4"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.5 0H5.3C5.08 0 4.9 0.18 4.9 0.4C4.9 0.62 5.08 0.8 5.3 0.8H6.5C7.16 0.8 7.7 1.34 7.7 2C7.7 2.66 7.16 3.2 6.5 3.2H5.3C5.08 3.2 4.9 3.38 4.9 3.6C4.9 3.82 5.08 4 5.3 4H6.5C7.604 4 8.5 3.104 8.5 2C8.5 0.896 7.604 0 6.5 0ZM2.89999 1.99994C2.89999 2.21994 3.07999 2.39994 3.29999 2.39994H5.69999C5.91999 2.39994 6.09999 2.21994 6.09999 1.99994C6.09999 1.77994 5.91999 1.59993 5.69999 1.59993H3.29999C3.07999 1.59993 2.89999 1.77994 2.89999 1.99994ZM3.7 3.2H2.5C1.84 3.2 1.3 2.66 1.3 2C1.3 1.34 1.84 0.8 2.5 0.8H3.7C3.92 0.8 4.1 0.62 4.1 0.4C4.1 0.18 3.92 0 3.7 0H2.5C1.396 0 0.5 0.896 0.5 2C0.5 3.104 1.396 4 2.5 4H3.7C3.92 4 4.1 3.82 4.1 3.6C4.1 3.38 3.92 3.2 3.7 3.2Z"
                                fill="#2D68C4"
                            />
                        </svg>,

                        'Copy the Url of the recorded video.'
                    )}
                    {renderNavButtonItem(
                        'Download',
                        <svg
                            width="7"
                            height="8"
                            viewBox="0 0 7 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M5.66064 2.82329H4.91221V0.470344C4.91221 0.211521 4.70039 -0.000244141 4.44149 -0.000244141H2.55864C2.29974 -0.000244141 2.08792 0.211521 2.08792 0.470344V2.82329H1.33949C0.920551 2.82329 0.708729 3.33152 1.00528 3.62799L3.16586 5.78799C3.34944 5.97152 3.64599 5.97152 3.82956 5.78799L5.99014 3.62799C6.28669 3.33152 6.07958 2.82329 5.66064 2.82329ZM0.205078 7.52945C0.205078 7.78828 0.4169 8.00004 0.675792 8.00004H6.32436C6.58326 8.00004 6.79508 7.78828 6.79508 7.52945C6.79508 7.27063 6.58326 7.05887 6.32436 7.05887H0.675792C0.4169 7.05887 0.205078 7.27063 0.205078 7.52945Z"
                                fill="#2D68C4"
                            />
                        </svg>,
                        'Download a copy of recorded video'
                    )}

                    {renderNavButtonItem(
                        'Update Thumbnail',
                        <FaEdit />,
                        'Update the thumbnail of the video.'
                    )}
                    {renderNavButtonItem('Rename', <FaEdit />, 'Update the Name of the video.')}
                    {renderNavButtonItem(
                        'Delete',
                        <svg
                            width="7"
                            height="8"
                            viewBox="0 0 7 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1.1002 6.7999C1.1002 7.2399 1.4602 7.5999 1.9002 7.5999H5.10019C5.54019 7.5999 5.90019 7.2399 5.90019 6.7999V2.7999C5.90019 2.3599 5.54019 1.9999 5.10019 1.9999H1.9002C1.4602 1.9999 1.1002 2.3599 1.1002 2.7999V6.7999ZM5.9002 0.799902H4.9002L4.6162 0.515902C4.5442 0.443902 4.4402 0.399902 4.3362 0.399902H2.6642C2.5602 0.399902 2.4562 0.443902 2.3842 0.515902L2.1002 0.799902H1.1002C0.880195 0.799902 0.700195 0.979902 0.700195 1.1999C0.700195 1.4199 0.880195 1.5999 1.1002 1.5999H5.9002C6.1202 1.5999 6.3002 1.4199 6.3002 1.1999C6.3002 0.979902 6.1202 0.799902 5.9002 0.799902Z"
                                fill="#2D68C4"
                            />
                        </svg>,
                        'Delete video forever.'
                    )}
                </ul>
            </div>
        </div>
        </>
    );
};
