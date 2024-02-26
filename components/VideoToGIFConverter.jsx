import React, { useEffect, useRef, useState } from 'react';

const VideoToGIFConverter = ({ videoBlob }) => {
    useEffect(()=>{console.log(videoBlob,"inside gif convertor")},[videoBlob])
    const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  const extractFrames = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const duration = video.duration;
    const captureInterval = 1; // Capture a frame every second, adjust as needed
    let currentTime = 0;

    const captureFrame = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      images.push(canvas.toDataURL('image/jpeg'));
      currentTime += captureInterval;

      if (currentTime < duration) {
        video.currentTime = currentTime;
      } else {
        // Here you would encode the images into a GIF
        console.log('Frames captured:', images.length);
        setImages([images[0]]);
      }
    };

    video.addEventListener('seeked', captureFrame);

    video.currentTime = currentTime;
  };

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} src={URL.createObjectURL(videoBlob)}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button onClick={extractFrames}>Convert to GIF</button>
      {/* Display images for testing */}
      {images.map((imgSrc, index) => (
        <img key={index} src={imgSrc} alt={`Frame ${index}`} />
      ))}
    </div>
  );
};

export default VideoToGIFConverter;


