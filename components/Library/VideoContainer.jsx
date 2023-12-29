import React, { useEffect, useState } from 'react';
import API_ENDPOINTS from '../apiConfig';
import VideoCard from './VideoCard';

const VideoContainer = ({ folderName, handleLinkInsertion, deleteVideo, toggleFavourite }) => {
    console.log(folderName, 'from videoContainer');
    const [videos, setVideos] = useState();
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.linkData}directory=${folderName}`, {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
                const data = await response.json();
                console.log(data);
                setVideos(data.links);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        })();
    }, [folderName]);

    return (
        <div className="container">
            <div className="row">
                {videos &&
                    videos.map((item) => (
                        <VideoCard
                            key={item.id}
                            video={item}
                            handleLinkInsertion={handleLinkInsertion}
                            deleteVideo={deleteVideo}
                            toggleFavourite={toggleFavourite}
                        />
                    ))}
            </div>
        </div>
    );
};

export default VideoContainer;
