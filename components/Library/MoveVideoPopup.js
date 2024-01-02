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
        onMove();
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
      <div className="modal-dialog" role="document">
        <div className="modal-content">
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
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveVideoPopup;
