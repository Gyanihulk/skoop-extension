import React, { useContext } from 'react';
import { IoIosLink } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import VideoCard from './VideoCard';
import GlobalStatesContext from '../../contexts/GlobalStates';

const FavoritesTab = ({ favorites, currentDirectory, handleLinkInsertion, deleteVideo, toggleFavourite }) => {


  favorites = favorites.filter((item) => item.is_favourite).map((item) => ({
    ...item,
    link: `https://play.vidyard.com/${item.link}`,
  }));
  
  const { setTotalMediaCount } = useContext(GlobalStatesContext);
  setTotalMediaCount(favorites.length);
  return (
    <div>
      {favorites.length > 0 ? (
        <div className='row'>
          {favorites.map((favorite) => (
            <>
             {favorite.is_favourite && <VideoCard
                key={favorite.id}
                video={favorite}
                folderName={"Favourite"}
                handleLinkInsertion={handleLinkInsertion}
                deleteVideo={deleteVideo}
                toggleFavourite={toggleFavourite}
                fetchVideos={()=>{return }}
              />}
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
