import React, { useState } from 'react';  
import { IoIosLink } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdMoveUp } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import MoveVideoPopup from './MoveVideoPopup';
import RenameVideoPopup from './RenameVideoPopup';
import API_ENDPOINTS from '../apiConfig';
import VideoPreviewPopup from './VideoPreviewPopup';
import { FaPlayCircle } from "react-icons/fa";

const VideoCard = ({ video, handleLinkInsertion, deleteVideo, toggleFavourite, fetchVideos}) => {
  const [showMovePopup, setShowMovePopup] = useState(false);
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [newTitle, setNewTitle] = useState(video.video_title);
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);


  const handleMoveClick = () => {
    console.log('Move button clicked for video ID:', video.id);
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
      console.log('Video ID:', video.id);
      console.log('New Title:', newTitle);
      
      const response = await fetch(API_ENDPOINTS.renameVideo +`/${video.id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          newTitle: newTitle
        }),
      });
  
      console.log('Rename Response:', response);
  
      if (response.ok) {
        video.video_title = newTitle;
        handleCloseRenamePopup();
        toast.success('Video renamed successfully');
      } else {
        console.error('Rename operation failed:', response.statusText);
        toast.error('Failed to rename video');
      }
    } catch (error) {
      console.error('Error renaming video:', error);
      toast.error('Failed to rename video');
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteVideo(video.id);
      toast.success('Video deleted successfully');
      fetchVideos(); // Refresh the folder immediately after deletion
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handleToggleFavouriteClick = async () => {
    try {
      await toggleFavourite(video.id);
      toast.success(video.is_favourite ? 'Removed from favorites' : 'Added to favorites');
      fetchVideos(); 
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
    <div className="col-6" key={video.id}>
      <div className="card mb-1 card-overflow-hidden">
      <div className="video-card position-relative" onClick={handlePreviewClick}>
          <iframe
            title={video.video_title}
            width="100%"
            height="100vw"
            src={video.link}
            allow="autoplay; fullscreen; picture-in-picture"
            className="no-border"
          />
          <div className="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
          <FaPlayCircle/>
          </div>
        </div>
        <div className="card justify-content-between align-items-center">
          <h8 className="card-title text-truncate title-width" title={video.video_title}>
            {video.video_title}
          </h8>
          <div className="btn-group d-flex flex-wrap" role="group">
            <button
              title="Insert link to mail body"
              className="btn btn-link btn-sm"
              onClick={() => {
                handleLinkInsertion(video.link, video.id);
                toast.success('Link inserted to mail body');
              }}
            >
              <IoIosLink />
            </button>
            <button
              title="Delete video"
              className="btn btn-link btn-sm"
              onClick={handleDeleteClick}
            >
              <FiTrash2 />
            </button>
            <button
              title={video.is_favourite ? "Remove from favorites" : "Add to favorites"}
              className="btn btn-link btn-sm"
              onClick={handleToggleFavouriteClick}
            >
              {video.is_favourite ? (
                <FaStar className="text-primary" />
              ) : (
                <FaRegStar />
              )}
            </button>
            <div className="d-flex flex-wrap justify-content-center">
              <button
                title="Rename video"
                className="btn btn-link btn-sm"
                onClick={handleRenameClick}
              >
                <FaPencilAlt />
              </button>
              <button
                title="Move video to another folder"
                className="btn btn-link btn-sm"
                onClick={handleMoveClick}
              >
                <MdMoveUp />
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
            videoTitle={video.video_title}
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
    </div>
  );
};

export default VideoCard;
