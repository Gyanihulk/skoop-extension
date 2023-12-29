import React,{useEffect, useState, useContext} from 'react'
import { FcFolder } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { GoCopy } from "react-icons/go";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineFavorite } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import API_ENDPOINTS from '../apiConfig.js';
import { NewFolderInput } from '../UserInput/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js';
import { toast } from 'react-hot-toast';
import FavoritesTab from './FavoritesTab.js';
import Tabs from './Tabs.js';
import VideoCard from './VideoCard.js';
import VideoContainer from './VideoContainer.jsx';

const Library = (props) => {
    const [links,setLinks]= useState([])
    const [open, setOpen]= useState(false)
    const [dirs,setDirs]= useState([])
    const [openNewFolder,setOpenNewFolder]= useState(0);
    const [currentDirectory, setCurrentDirectory]= useState('')
    const [dirToRename,setDirToRename]= useState('')
    const [fav,setFav]=useState(false);
    const [hoveredDir, setHoveredDir] = useState(null);
    const { globalRefresh, setGlobalRefresh } = useContext(GlobalStatesContext)
    const { getThumbnail } = useContext(MediaUtilsContext)
    const [hovered, setHovered] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites');
    const [favorites, setFavorites] = useState([]); 
    const [tabName, setTabName] = useState('');
    const [folders, setFolders] = useState([]);


    const handleTabChange = (tab) => {
      setActiveTab(tab);
      setCurrentDirectory(tab);
      setFav(false);
    };
  
    const handleOpen = (dir) => {
      getlinks(dir);
      setActiveTab(dir);
      setCurrentDirectory(dir);
    };
  
    const handleNewTab = () => {
      setOpenNewFolder(true);
      setTabName('');
    };
  
    const handleTabCreation = async () => {
      if (activeTab !== 'folders') {
        await createNewTab(tabName);
        setOpenNewFolder(false);
        
      } else {
        // Handle case where tab name is empty
        // You can show an error message or take appropriate action
      }
    };
  
    const handleClose = () => {
      setCurrentDirectory('')
      setFav(false)
      setOpen(false)
    };

    const updateFavoritesState = (updatedLinks) => {
      setFavorites(updatedLinks.filter(item => item.is_favourite));
    };

    const createNewTab = async (tabName) => {
      // Implement logic to create a new folder (tab)
      try {
        const response = await fetch(API_ENDPOINTS.createNewDirectory, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({ directory_name: tabName }),
        });
        await getDirs();
        // Optionally, you may also set the new tab as the active tab
        setActiveTab(tabName);
        setCurrentDirectory(tabName);
      } catch (err) {
        console.log('could not create directory', err);
      }
    };

    const getDirs=async ()=>{
        try{
            var response = await fetch(API_ENDPOINTS.videoDirectories, {
                method: "GET",
                headers: {
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    "Content-type": "application/json; charset=UTF-8"
                }
                })
                response= await response.json()
                console.log("get dirs call was a success")
                setFolders(response)
        }catch(err){
            console.log("could not fetch library folders",err)
        }
    }

    const getlinks=async (dirName,favourite)=>{
        const urlParams = new URLSearchParams();

        if (dirName !== null && dirName !== undefined) {
            urlParams.append('directory', dirName);
        }
        
        if (favourite !== null && favourite !== undefined) {
            urlParams.append('is_favourite', favourite);
        }

        try{
            var response = await fetch(API_ENDPOINTS.linkData+ urlParams.toString(), {
            method: "GET",
            headers: {
                "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        response=await response.json()
        setLinks(response);
        }catch(err){
            alert("could not fetch videos",err)
        }
    }

    const getFavourites=async()=>{
        if(fav==true){
            setFav(false);
            setCurrentDirectory('');
            return 
        }
        setFav(true);
        getlinks(null,true);
    }

    const deleteVideo=async (id,dir)=>{
        try{
            const response = await fetch(`${API_ENDPOINTS.deleteVideo}${id}`,{
                method: "DELETE",
                headers:{
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json'
                }
            })
            await getlinks(dir)
        }catch(err){
            console.log("could not delete",err)
        }
    }
    
    const deleteDirectory=async(dirName)=>{
        console.log("delete directory called")
        try{
            const response =await fetch(API_ENDPOINTS.deleteDirectory+`/${dirName}`,{
                method: "DELETE",
                headers:{
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json'
                }
            })
            await getDirs()
        }catch(err){
            console.log("could not delete directory",err)
        }
    }

    useEffect(()=>{
        (async () => {
            await getDirs();
            await getFavourites();
         })();
         if(currentDirectory!='' || fav){
            if(fav){
                getlinks(null,true);
            }
            else getlinks(currentDirectory);
         }
    },[globalRefresh]);

    // const getThumbnail=async(id)=>{
    //     try{
    //         var response=await fetch(API_ENDPOINTS.getThumbnail+id,{
    //             method: "GET",
    //             headers:{
    //                 "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         response=await response.json();
    //         return response.url;
    //     }catch(err){
    //         console.log("error while fetching thumbnails",err);
    //         return null
    //     }
    // }

    const handleLinkInsertion=async(link,id)=>{
        if(props.appendToBody){
            if(getThumbnail){
                console.log("get thumbnail is defined");
            }
            else console.log("getthumbnail not defined");

            const thumbnail_link=await getThumbnail(id);
            console.log("the thumbnail link provided");
            var ret
            if(thumbnail_link!=undefined && thumbnail_link!=null){
                ret=`<img src='${thumbnail_link}' style={{width: '200px' ,display: 'inline-block'}}/><br>`
            }
            ret+=`<a href='${link}'>video link</a>`
            props.appendToBody(ret)
        }
        else{
            const url = link;
            const facade_player_uuid = url.substring(url.lastIndexOf("/") + 1);
            props.appendToMessage(`https://share.vidyard.com/watch/${facade_player_uuid}`);
        }
    }

    const toggleFavourite = async (videoId) => {
      try {
        await fetch(API_ENDPOINTS.toggleFavourite, {
          method: "PATCH",
          headers: {
            "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: videoId
          })
        });
  
        const updatedLinks = links.map(item => {
          if (item.id === videoId) {
            return { ...item, is_favourite: !item.is_favourite };
          }
          return item;
        });
  
        setLinks(updatedLinks);
        updateFavoritesState(updatedLinks);
  
      } catch (err) {
        console.log("could not move", err);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch directories
          const dirsResponse = await fetch(API_ENDPOINTS.videoDirectories, {
            method: "GET",
            headers: {
              "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
              "Content-type": "application/json; charset=UTF-8"
            }
          });
          const dirsData = await dirsResponse.json();
          setDirs(dirsData);
  
          // Fetch all links
          const linksResponse = await fetch(API_ENDPOINTS.linkData, {
            method: "GET",
            headers: {
              "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
              "Content-type": "application/json; charset=UTF-8"
            }
          });
          const linksData = await linksResponse.json();
          setLinks(linksData);
  
          // Update favorites state based on links
          updateFavoritesState(linksData);
        } catch (err) {
          console.log("Error fetching data", err);
        }
      };
  
      fetchData();
    }, [globalRefresh]);
    
    

  return (
    <div>
      <Tabs
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        handleNewTab={handleNewTab}
        folders={folders}
      />
    <br />
    <br />
    <div className="modal" style={{ display: openNewFolder ? 'block' : 'none' }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Enter title</h5>
                    <button type="button" className="btn btn-outline-dark btn-sm close" onClick={() => { setOpenNewFolder(false) }}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <NewFolderInput closePopup={async () => { setOpenNewFolder(false); getDirs() }} />
                </div>
                <div className="modal-footer">
                    <button type="button" className='btn btn-primary btn-sm' onClick={async () => { setOpenNewFolder(false); getDirs() }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div className="modal" style={{ display: dirToRename !== '' ? 'block' : 'none' }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Rename {dirToRename} to:</h5>
                    <button type="button" className="close" onClick={() => { setDirToRename('') }}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <NewFolderInput
                        closePopup={async () => { setDirToRename(''); getDirs() }}
                        oldDirectoryName={dirToRename}
                    />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={async () => { setDirToRename(''); getDirs() }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>

    {activeTab === 'favorites' && (
      <FavoritesTab
      favorites={favorites}
      handleLinkInsertion={handleLinkInsertion}
    />
 
)}

    {activeTab === 'folders' && (
      <div>
      {/* Render Video Cards for other tabs */}
      {activeTab !== 'favorites' && links.length>0 &&(
        <div className="container">
          <div className="row">
            {links.map((item) => (
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
      )}
    </div>
    )}

    <VideoContainer folderName={activeTab}    
                 handleLinkInsertion={handleLinkInsertion}
                 deleteVideo={deleteVideo}
                toggleFavourite={toggleFavourite}/>
</div>
  )
}

export default Library