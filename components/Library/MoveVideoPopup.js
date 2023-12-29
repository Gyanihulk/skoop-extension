import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../apiConfig';

const MoveVideoPopup = ({ videoId, onClose, onMove }) => {
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
        console.log('Video ID:', videoId);
        console.log('Destination Folder:', folderName);
      const response = await fetch(API_ENDPOINTS.moveVideos, {
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
  
      if (response.ok) {
        // If the move operation is successful, notify the parent component
        onMove();
      } else {
        console.error('Move operation failed:', response.statusText);
        // Handle the case where the move operation fails
      }
    } catch (error) {
      console.error('Error moving video:', error);
    } finally {
      // Close the popup regardless of success or failure
      onClose();
    }
  };  

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select a folder to move the video:</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p>Loading folders...</p>
            ) : (
              <div className="list-group">
                {folders.length > 0 &&
                  folders.map((folder) => (
                    <button
                      key={folder.directory_name}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleMove(folder.directory_name)}
                    >
                      {folder.directory_name}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveVideoPopup;
