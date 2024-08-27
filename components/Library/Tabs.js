// Tabs.js
import React from 'react'
import { LuPlus } from 'react-icons/lu'
import VideoContainer from './VideoContainer'

const Tabs = ({ activeTab, handleTabChange, handleNewTab, folders }) => (
  <div className="d-flex custom-video-nav">
    <ul className="nav nav-tabs flex-nowrap">
      {/* Existing tabs */}

      <li className={`custom-video-nav-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => handleTabChange('favorites')}>
        Favorites
      </li>

      {/* Dynamically generated tabs from folders */}
      {folders.map((folder) => (
        <li className={`custom-video-nav-item ${activeTab === folder.directory_name ? 'active' : ''}`} onClick={() => handleTabChange(folder.directory_name)}>
          {folder.directory_name}
        </li>
      ))}

      {/* New tab (folder) button */}
      <li className="custom-video-nav-item">
        <LuPlus id="create-video-folder" onClick={handleNewTab} />
      </li>
    </ul>
  </div>
)

export default Tabs
