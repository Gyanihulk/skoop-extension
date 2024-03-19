import React, { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { MdMoveUp } from 'react-icons/md';
import { FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import MoveVideoPopup from './MoveVideoPopup';
import RenameVideoPopup from './RenameVideoPopup';
import API_ENDPOINTS from '../apiConfig';
import VideoPreviewPopup from './VideoPreviewPopup';
import { FaPlayCircle } from 'react-icons/fa';

const VideoCard = ({ video, handleLinkInsertion, deleteVideo, toggleFavourite, fetchVideos }) => {
    const [showMovePopup, setShowMovePopup] = useState(false);
    const [showRenamePopup, setShowRenamePopup] = useState(false);
    const [newTitle, setNewTitle] = useState(video.video_title);
    const [showPreviewPopup, setShowPreviewPopup] = useState(false);

    const handleMoveClick = () => {
        setShowMovePopup(true);
    };

    const handleCloseMovePopup = () => {
        setShowMovePopup(false);
    };

    const handleRenameClick = () => {
        setShowRenamePopup(true);
    };

    const handleCloseRenamePopup = () => {
        setShowRenamePopup(false);
    };

    const handleRenameSave = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.renameVideo + `/${video.id}`, {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    newTitle: newTitle,
                }),
            });

            if (response.ok) {
                video.video_title = newTitle;
                handleCloseRenamePopup();
                toast.success('Video renamed successfully');
            } else {
                toast.error('Failed to rename video');
            }
        } catch (error) {
            toast.error('Failed to rename video');
        }
    };

    const handleDeleteClick = async () => {
        try {
            await deleteVideo(video.id);
            toast.success('Video deleted successfully');
            fetchVideos();
        } catch (error) {
            toast.error('Failed to delete video');
        }
    };

    const handleToggleFavouriteClick = async () => {
        try {
            await toggleFavourite(video.id);
            toast.success(video.is_favourite ? 'Removed from favorites' : 'Added to favorites');
            fetchVideos();
        } catch (error) {
            toast.error('Failed to toggle favorite status');
        }
    };

    const handlePreviewClick = () => {
        setShowPreviewPopup(true);
    };

    const handleClosePreviewPopup = () => {
        setShowPreviewPopup(false);
    };

    return (
        <div className="col-6 my-1" key={video.id}>
            <div className="card  video-card">
                
                    <iframe
                        title={video.video_title}
                        width="100%"
                        height="100vw"
                        src={video.link}
                        allow="autoplay; fullscreen; picture-in-picture"
                        className="no-border"
                        onClick={handlePreviewClick}
                    />
                    <div className="overlay position-absolute bottom-0 start-0 w-100 video-card-footer">
                        <div className="d-flex flex-wrap ">
                            <button
                                title="Insert link to mail body"
                                className="btn btn-link btn-sm video-card-footer-button"
                                onClick={() => {
                                    handleLinkInsertion(video.link, video.id);
                                    toast.success('Link inserted');
                                }}
                            >
                                <IoIosLink size={10}/>
                            </button>
                           
                            <button
                                title={
                                    video.is_favourite
                                        ? 'Remove from favorites'
                                        : 'Add to favorites'
                                }
                                className="btn btn-link btn-sm video-card-footer-button"
                                onClick={handleToggleFavouriteClick}
                            >
                                {video.is_favourite ? (
                                    <FaStar className="text-primary" size={10} />
                                ) : (
                                    <FaRegStar size={10} />
                                )}
                            </button>

                            <button
                                title="Rename video"
                                className="btn btn-link btn-sm video-card-footer-button"
                                onClick={handleRenameClick}
                            >
                                <FaPencilAlt size={10}/>
                            </button>
                            <button
                                title="Move video to another folder"
                                className="btn btn-link btn-sm video-card-footer-button"
                                onClick={handleMoveClick}
                            >
                                <MdMoveUp size={10} />
                            </button>
                            <button
                                title="Delete video"
                                className="btn btn-link btn-sm video-card-footer-button"
                                onClick={handleDeleteClick}
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 13 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M4.0499 8.7999C4.0499 9.2399 4.4099 9.5999 4.8499 9.5999H8.0499C8.4899 9.5999 8.8499 9.2399 8.8499 8.7999V4.7999C8.8499 4.3599 8.4899 3.9999 8.0499 3.9999H4.8499C4.4099 3.9999 4.0499 4.3599 4.0499 4.7999V8.7999ZM8.8499 2.7999H7.8499L7.5659 2.5159C7.4939 2.4439 7.3899 2.3999 7.2859 2.3999H5.6139C5.5099 2.3999 5.4059 2.4439 5.3339 2.5159L5.0499 2.7999H4.0499C3.8299 2.7999 3.6499 2.9799 3.6499 3.1999C3.6499 3.4199 3.8299 3.5999 4.0499 3.5999H8.8499C9.0699 3.5999 9.2499 3.4199 9.2499 3.1999C9.2499 2.9799 9.0699 2.7999 8.8499 2.7999Z"
                                        fill="#2D68C4"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                

                {showMovePopup && (
                    <MoveVideoPopup
                        videoId={video.id}
                        onClose={handleCloseMovePopup}
                        onMove={() => {
                            handleCloseMovePopup();
                            toast.success('Video moved successfully');
                            fetchVideos();
                        }}
                    />
                )}
                {showRenamePopup && (
                    <RenameVideoPopup
                        newTitle={newTitle}
                        onClose={handleCloseRenamePopup}
                        onSave={handleRenameSave}
                        onTitleChange={(e) => setNewTitle(e.target.value)}
                    />
                )}
                {showPreviewPopup && (
                    <VideoPreviewPopup video={video} onClose={handleClosePreviewPopup} />
                )}
            </div>
        </div>
    );
};

export default VideoCard;
