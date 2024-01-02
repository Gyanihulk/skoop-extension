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

const VideoCard = ({ video, handleLinkInsertion, deleteVideo, toggleFavourite }) => {
  const [showMovePopup, setShowMovePopup] = useState(false);
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [newTitle, setNewTitle] = useState(video.video_title);

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
  

  return (
    <div className="col-6" key={video.id}>
      <div className="card mb-1" style={{ overflow: 'hidden' }}>
        <iframe
          title={video.video_title}
          width="100%"
          height="80vw" 
          src={video.link}
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ border: 'none' }} 
        />
        <div className="card justify-content-between align-items-center">
          <h8 className="card-title text-truncate" style={{ maxWidth: '100px' }} title={video.video_title}>
            {video.video_title}
          </h8>
          <div className="btn-group" role="group">
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
              onClick={async () => {
                await deleteVideo(video.id);
                toast.success('Video deleted successfully');
              }}
            >
              <FiTrash2 />
            </button>
            <button
              title={video.is_favourite ? "Remove from favorites" : "Add to favorites"}
              className="btn btn-link btn-sm"
              onClick={() => {
                toggleFavourite(video.id);
                toast.success(video.is_favourite ? 'Removed from favorites' : 'Added to favorites');
              }}
            >
              {video.is_favourite ? (
                <FaStar className="text-primary" />
              ) : (
                <FaRegStar />
              )}
            </button>
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
          {showMovePopup && (
            <MoveVideoPopup
              videoId={video.id}
              onClose={handleCloseMovePopup}
              onMove={() => {
                handleCloseMovePopup();
                toast.success('Video moved successfully');
                //fetchVideos();
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
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
