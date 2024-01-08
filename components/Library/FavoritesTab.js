import React from 'react';
import { IoIosLink } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from 'react-hot-toast';

const FavoritesTab = ({ favorites, currentDirectory, handleLinkInsertion, deleteVideo, toggleFavourite }) => {
  console.log("Favorites:", favorites);

  return (
    <div>
      {favorites.length > 0 ? (
        <div className='row'>
          {favorites.map((favorite) => (
            <div key={favorite.id} className="col-6 mb-1">
              <iframe
                title={favorite.video_title}
                width="100%"
                height="80vw" 
                src={favorite.link}
                allow="autoplay; fullscreen; picture-in-picture"
                className="no-border"
              />
              <div className="card justify-content-between align-items-center">
                <h8 className="card-title text-truncate title-width" title={favorite.video_title}>
                  {favorite.video_title}
                </h8>
                <button
                  title="Insert link to mail body"
                  className="btn btn-link"
                  onClick={() => {
                    handleLinkInsertion(favorite.link, favorite.id);
                  }}
                >
                  <IoIosLink />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-12 text-center">
        <p>No Favorites to display</p>
      </div>
      )}
    </div>
  );
};

export default FavoritesTab;