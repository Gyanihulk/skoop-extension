import React from 'react'
import { useRecording } from '../../contexts/RecordingContext'

const RecordStart = ({ onRestart,onStop }) => {
  const {

    isRecording,

    continuousCanvasRef,

  } = useRecording()
  return (
    <div>
      <div className="start-rec-main">
        <div className="start-rec-container">
          <div className="start-rec-top">
            <div className="start-rec-circle d-flex justify-content-center align-items-center ">
              <div className="fill-circle"></div>
            </div>
            <div class="loading-text my-1">Recording</div>
          {isRecording && (
                  <canvas id="continuous" ref={continuousCanvasRef}></canvas>
                )}
          </div>
          <div className="d-flex flex-nowrap">
            <button
              className="record-start-btn rec-restart-btn me-2"
              onClick={onRestart}
            >
              Restart
            </button>
            <button className="record-start-btn rec-stop-btn" onClick={onStop}>Stop</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordStart
