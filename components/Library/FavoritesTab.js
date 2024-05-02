import React from 'react';
import { IoIosLink } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import VideoCard from './VideoCard';

const FavoritesTab = ({ favorites, currentDirectory, handleLinkInsertion, deleteVideo, toggleFavourite }) => {


  favorites=favorites.map((item) => ({
    ...item,
    link: `https://play.vidyard.com/${item.link}`,
  }))
  return (
    <div>
      {favorites.length > 0 ? (
        <div className='row'>
          {favorites.map((favorite) => (
            <>
             <VideoCard
                key={favorite.id}
                video={favorite}
                folderName={"Favourite"}
                handleLinkInsertion={handleLinkInsertion}
                deleteVideo={deleteVideo}
                toggleFavourite={toggleFavourite}
                fetchVideos={()=>{console.log("fetch videos")}}
              />
            </>))}
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
