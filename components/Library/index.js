import React, { useEffect, useState, useContext } from 'react'
import API_ENDPOINTS from '../apiConfig.js'
import { NewFolderInput } from '../UserInput/index.js'
import GlobalStatesContext from '../../contexts/GlobalStates.js'
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js'
import { toast } from 'react-hot-toast'
import FavoritesTab from './FavoritesTab.js'
import Tabs from './Tabs.js'
import VideoCard from './VideoCard.js'
import VideoContainer from './VideoContainer.jsx'
import { IoMdClose } from 'react-icons/io'
import { handleCopyToClipboard } from '../../utils/index.js'

const Library = (props) => {
  const [links, setLinks] = useState([])
  const [open, setOpen] = useState(false)
  const [dirs, setDirs] = useState([])
  const [openNewFolder, setOpenNewFolder] = useState(0)
  const [currentDirectory, setCurrentDirectory] = useState('')
  const [fav, setFav] = useState(false)
  const { globalRefresh, isLinkedin, setGlobalRefresh } = useContext(GlobalStatesContext)
  const { getThumbnail } = useContext(MediaUtilsContext)
  const [activeTab, setActiveTab] = useState('New')
  const [favorites, setFavorites] = useState([])
  const [tabName, setTabName] = useState('')
  const [folders, setFolders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentDirectory(tab)
    setFav(false)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleNewTab = () => {
    setOpenNewFolder(true)
    setTabName('')
  }

  const updateFavoritesState = async () => {
    try {
      const linksResponse = await fetch(API_ENDPOINTS.linkData, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      const linksData = await linksResponse.json()

      // Check if linksData.links is an array before using filter
      if (Array.isArray(linksData.links)) {
        setFavorites(linksData.links.filter((item) => item.is_favourite))
      } else {
        console.error("Links data's 'links' property is not an array:", linksData)
      }
    } catch (err) {
      console.error('Error updating favorites state', err)
    }
  }

  const getDirs = async () => {
    try {
      var response = await fetch(API_ENDPOINTS.videoDirectories, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      response = await response.json()
      setFolders(response)
    } catch (err) {
      console.error('could not fetch library folders', err)
    }
  }

  const getlinks = async (dirName, favourite) => {
    const urlParams = new URLSearchParams()

    if (dirName !== null && dirName !== undefined) {
      urlParams.append('directory', dirName)
    }

    if (favourite !== null && favourite !== undefined) {
      urlParams.append('is_favourite', favourite)
    }

    try {
      var response = await fetch(API_ENDPOINTS.linkData + urlParams.toString(), {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      response = await response.json()
    } catch (err) {
      toast.error('could not fetch videos', err)
    }
  }

  const getFavourites = async () => {
    if (fav == true) {
      setFav(false)
      setCurrentDirectory('')
      return
    }
    setFav(true)
    getlinks(null, true)
  }

  const deleteVideo = async (id, dir) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.deleteVideo}${id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      })
      await getlinks(dir)
      await updateFavoritesState()
      fetchVideos()
    } catch (err) {
      console.error('could not delete', err)
    }
  }

  const deleteDirectory = async (dirName) => {
    try {
      const response = await fetch(API_ENDPOINTS.deleteDirectory + `/${dirName}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      })
      await getDirs()
    } catch (err) {
      console.error('could not delete directory', err)
    }
  }

  useEffect(() => {
    ;(async () => {
      await getDirs()
      await getFavourites()
    })()
    if (currentDirectory != '' || fav) {
      if (fav) {
        getlinks(null, true)
      } else getlinks(currentDirectory)
    }
  }, [globalRefresh])

  const handleLinkInsertion = async (link, id, name = '') => {
    const facade_player_uuid = link?.substring(link.lastIndexOf('/') + 1)
    const url = `https://skoop.hubs.vidyard.com/watch/${facade_player_uuid}`

    if (!isLinkedin) {
      const thumbnail_link = await getThumbnail(id)
      var ret
      if (thumbnail_link != undefined && thumbnail_link != null) {
        ret = `<a href='${url}'> <p class = "inline-video-title"> Watch Video - ${name} </p> <br> <img src='${thumbnail_link}' className="inline-block-width"/></a>`
      } else {
        ret += `<a href='${url}'>video link</a>`
      }
      props.appendToBody(ret)
    } else {
      props.appendToBody(url)
    }
    handleCopyToClipboard(url)
  }

  const toggleFavourite = async (videoId) => {
    try {
      // Update the state immediately
      setFavorites((prevFavorites) => {
        const updatedFavorites = prevFavorites.map((favorite) => {
          if (favorite.id === videoId) {
            // Toggle the is_favourite property
            const updatedFavorite = {
              ...favorite,
              is_favourite: !favorite.is_favourite,
            }
            return updatedFavorite
          }
          return favorite
        })
        return updatedFavorites
      })

      // Send the request to the server
      const response = await fetch(API_ENDPOINTS.toggleFavourite, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: videoId,
        }),
      })

      // Handle errors if any
      if (!response.ok) {
        // If there's an error, revert the state change
        setFavorites((prevFavorites) => {
          const revertedFavorites = prevFavorites.map((favorite) => {
            if (favorite.id === videoId) {
              const revertedFavorite = {
                ...favorite,
                is_favourite: !favorite.is_favourite,
              }
              return revertedFavorite
            }
            return favorite
          })
          return revertedFavorites
        })
      }

      // Update the favorites state again to ensure consistency
      await updateFavoritesState()
    } catch (err) {
      console.error('Toggle Favorite Error:', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch directories
        const dirsResponse = await fetch(API_ENDPOINTS.videoDirectories, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
        const dirsData = await dirsResponse.json()
        setDirs(dirsData)

        // Fetch all links
        const linksResponse = await fetch(API_ENDPOINTS.linkData, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
        const linksData = await linksResponse.json()
        setLinks(linksData)

        updateFavoritesState(linksData)
      } catch (err) {
        console.error('Error fetching data', err)
      }
    }

    fetchData()
  }, [globalRefresh])

  return (
    <div>
      <Tabs activeTab={activeTab} handleTabChange={handleTabChange} handleNewTab={handleNewTab} folders={folders} />

      {/* User Input Modals */}

      <div className="modal modal-overlay" style={{ display: openNewFolder ? 'block' : 'none' }}>
        <div className=" modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header px-3 pt-3 pb-2">
              <h5 className="modal-title">Create new folder</h5>
              <button
                type="button"
                className="custom-close-button"
                onClick={() => {
                  setOpenNewFolder(false)
                }}
                aria-label="Close"
              >
                <IoMdClose size={16} />
              </button>
            </div>
            <div className="modal-body d-flex flex-row">
              <NewFolderInput
                closePopup={async () => {
                  setOpenNewFolder(false)
                  getDirs()
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'favorites' && <FavoritesTab favorites={favorites} currentDirectory={currentDirectory} handleLinkInsertion={handleLinkInsertion} deleteVideo={deleteVideo} toggleFavourite={toggleFavourite} />}

      <VideoContainer
        folderName={activeTab === 'favorites' ? 'favorites' : activeTab}
        handleLinkInsertion={handleLinkInsertion}
        deleteVideo={deleteVideo}
        toggleFavourite={toggleFavourite}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}

export default Library
