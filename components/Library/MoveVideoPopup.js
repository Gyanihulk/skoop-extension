import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';
import { IoMdClose } from "react-icons/io";


const MoveVideoPopup = ({ videoId, onClose, onMove, fetchVideos }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        if (Array.isArray(data) && data.length > 0) {
          setFolders(data);
          setLoading(false);
        } else {
          console.error('Empty or invalid response:', data);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, []);

  const handleMove = async (folderName) => {
    try {
      const response = await fetch(API_ENDPOINTS.moveVideos, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          videoIds: [videoId],
          to: folderName,
        }),
      });

      if (response.ok) {
        await onMove();  
        fetchVideos();
      } else {
        console.error('Move operation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error moving video:', error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
  <div className="modal-overlay  modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h6 className="modal-title">Move video to- </h6>
        <button type="button" className="custom-close-button" onClick={onClose} aria-label="Close">
        <IoMdClose/>
        </button>
      </div>
      <div className="modal-body">
        {loading ? (
          <p>Loading folders...</p>
        ) : (
          <div className="list-group">
            {folders.length > 0 &&
              folders.map((folder, index) => (
                index % 2 === 0 && (
                  <div key={folder.directory_name} className="d-flex">
                    <button
                      className="list-group-item list-group-item-action mr-2"
                      onClick={() => handleMove(folder.directory_name)}
                    >
                      {folder.directory_name}
                    </button>
                    {index + 1 < folders.length && (
                      <button
                        className="list-group-item list-group-item-action"
                        onClick={() => handleMove(folders[index + 1].directory_name)}
                      >
                        {folders[index + 1].directory_name}
                      </button>
                    )}
                  </div>
                )
              ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>


  );
};

export default MoveVideoPopup;
