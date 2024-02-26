import React, { useContext, useEffect, useState } from 'react'
import API_ENDPOINTS from './apiConfig';
import toast from 'react-hot-toast';
import GlobalStatesContext from '../contexts/GlobalStates';
import VideoToGIFConverter from './VideoToGIFConverter';



export const VideoPreview = () => {
    const [thumbnailImage, setThumbnailImage] = useState(
        'https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-1023x1024-bve9uom6.png'
    );
    
    const { latestVideoId ,latestBlob} =
    useContext(GlobalStatesContext);
    useEffect(()=>{console.log(latestBlob,"from video preview ")},[latestVideoId])
    // Function to handle the file input change event
    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailImage(e.target.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('thumbnailImage', file);
            
            try {
                const res = await fetch(API_ENDPOINTS.updateThumbnailImage + "/" + latestVideoId, {
                    method: 'PATCH',
                    body: formData, 
                    headers: {
                        authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
  
                    },
                });
                
                if (res.ok) {
                  const jsonResponse = await res.json(); 
                  setThumbnailImage(API_ENDPOINTS.backendUrl + '/' + jsonResponse.image_path); 
                  toast.success('thumbnail Image Updated');
                } else throw new Error('Error in the database');
            } catch (err) {
                toast.error('thumbnail Image Not Updated, try Again');
            }
        }
    };

    // Function to trigger the file input when the image is clicked
    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className="card card-with-border px-4">
            {latestBlob && <VideoToGIFConverter videoBlob={latestBlob}/>}
            <div className="card-body">
         
                    <div >
                        <img
                            src={
                                 thumbnailImage
                            }
                            className="container p-2 rounded-4"
                            onClick={triggerFileInput}
                            alt="thumbnail"
                        />
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    
                    </div>
        
            </div>
        </div>
    );
};
