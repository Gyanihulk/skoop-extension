// VideoCard.js
import React from 'react';
import { IoIosLink } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from 'react-hot-toast';

const VideoCard = ({ video, handleLinkInsertion, deleteVideo, toggleFavourite }) => (
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
        <div className="d-flex">
          <button
            title="Insert link to mail body"
            className="btn btn-link"
            onClick={() => {
              handleLinkInsertion(video.link, video.id);
              toast.success('Link inserted to mail body');
            }}
          >
            <IoIosLink />
          </button>
          <button
            title="Delete video"
            className="btn btn-link"
            onClick={async () => {
              await deleteVideo(video.id);
              toast.success('Video deleted successfully');
            }}
          >
            <FiTrash2 />
          </button>
          <button
            title={video.is_favourite ? "Remove from favorites" : "Add to favorites"}
            className="btn btn-link"
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
        </div>
      </div>
    </div>
  </div>
);

export default VideoCard;
