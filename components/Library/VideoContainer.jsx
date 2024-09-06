import React, { useContext, useEffect, useState } from 'react'
import API_ENDPOINTS from '../apiConfig'
import VideoCard from './VideoCard'
import Pagination from './Pagination'
import GlobalStatesContext from '../../contexts/GlobalStates'
import { useUserSettings } from '../../contexts/UserSettingsContext'
import AuthContext from '../../contexts/AuthContext'

const VideoContainer = ({ folderName, handleLinkInsertion, deleteVideo, toggleFavourite, currentPage, handlePageChange }) => {
  const { setTotalMediaCount ,totalMediaCount} = useContext(GlobalStatesContext)

  const [totalPages, setTotalPages] = useState()
  const [videos, setVideos] = useState([])
  const {appConfig}=useContext(AuthContext);
  const { userSettings } = useUserSettings()
  const fetchVideos = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.linkData}directory=${folderName}&page=${currentPage}&limit=${4}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      const data = await response.json()
      setTotalMediaCount(data.totalItems)
      setTotalPages(data.totalPages)
      data.links = data.links.map((item) => ({
        ...item,
        link: `https://play.vidyard.com/${item.link}`,
      }))

      setVideos(data.links)
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [folderName, currentPage])
  return (
    <div className="container mt-1">
      <div className="row" id="media-list-container">
        {videos && videos.length > 0 ? (
          videos.map((item) => {
            return <VideoCard key={item.id} video={item} folderName={folderName} handleLinkInsertion={handleLinkInsertion} deleteVideo={deleteVideo} toggleFavourite={toggleFavourite} fetchVideos={fetchVideos} />
          })
        ) : folderName !== 'favorites' ? (
          <div className="col-12 text-center">
            <p>No videos available</p>
          </div>
        ) : null}
      </div>
      <div className="d-flex justify-content-center my-2">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <div className="mx-1 media-count">{userSettings.fullAccess?"":`Remaining Videos:${appConfig.max_videos-totalMediaCount}`}</div>
    </div>
  )
}

export default VideoContainer
