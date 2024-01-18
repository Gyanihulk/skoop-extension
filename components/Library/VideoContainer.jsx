import React, { useEffect, useState } from 'react';
import API_ENDPOINTS from '../apiConfig';
import VideoCard from './VideoCard';
import Pagination from './Pagination';

const VideoContainer = ({ folderName, handleLinkInsertion, deleteVideo, toggleFavourite, currentPage, totalPages, handlePageChange }) => {
  console.log(folderName, 'from videoContainer');
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.linkData}directory=${folderName}&page=${currentPage}&limit=${10}`,
        {
          method: 'GET',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setVideos(data.links);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [folderName, currentPage]);

  return (
    <div className="container">
      <div className="row">
        {videos && videos.length > 0 ? (
          videos.map((item) => (
            <VideoCard
              key={item.id}
              video={item}
              folderName={folderName}
              handleLinkInsertion={handleLinkInsertion}
              deleteVideo={deleteVideo}
              toggleFavourite={toggleFavourite}
              fetchVideos={fetchVideos}
            />
          ))
        ) : folderName !== 'favorites' ? (
          <div className="col-12 text-center">
            <p>No videos available</p>
          </div>
        ) : null}
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-center mt-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
