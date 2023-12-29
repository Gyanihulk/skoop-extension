// MoveVideoPopup.js
import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';

const MoveVideoPopup = ({ videoId, onClose, onMove }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Fetch folder names
    const fetchFolders = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.videoDirectories, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const data = await response.json();
        setFolders(data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, []);

  const handleMove = async (folderName) => {
    try {
      console.log('Before API call');
      // Call the API to move the video
      await fetch(API_ENDPOINTS.moveVideos, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          videoId,
          destinationFolder: folderName,
        }),
      });
      console.log('After API call');
  
      // Notify parent component about the move
      onMove();
    } catch (error) {
      console.error('Error moving video:', error);
    } finally {
      // Close the popup
      onClose();
    }
  };
  

  return (
    <div className="move-video-popup">
      <h3>Select a folder to move the video:</h3>
      <ul>
      {folders.map((folder) => (
        <li key={folder} onClick={() => handleMove(folder)}>
            {folder}
        </li>
        ))}
      </ul>
    </div>
  );
};

export default MoveVideoPopup;
