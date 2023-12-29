// Tabs.js
import React from 'react';
import { LuPlus } from "react-icons/lu";
import VideoContainer from './VideoContainer';

const Tabs = ({ activeTab, handleTabChange, handleNewTab, folders }) => (
  <div className="container">
    {console.log(folders,"from tabs")}
    <div className="row">
      <div className="col-12">
        <div className="d-flex overflow-auto">
          <ul className="nav nav-tabs nav-justified mr-2 flex-nowrap">
            {/* Existing tabs */}
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => handleTabChange('favorites')}
                href="#"
              >
                Favorites
              </a>
            </li>
        

            {/* Dynamically generated tabs from folders */}
            {folders.map((folder) => (
              <li key={folder.directory_name} className="nav-item">
                <a
                  className={`nav-link ${activeTab === folder.directory_name ? 'active' : ''}`}
                  onClick={() => handleTabChange(folder.directory_name)}
                  href="#"
                >
                  {folder.directory_name}
                </a>
              </li>
            ))}


            {/* New tab (folder) button */}
            <li className="nav-item">
              <button className="btn btn-sm btn-light" onClick={handleNewTab}>
                <LuPlus/>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Tabs;
