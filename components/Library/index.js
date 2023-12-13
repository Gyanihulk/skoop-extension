import React,{useEffect, useState, useContext} from 'react'
import { FcFolder } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { GoCopy } from "react-icons/go";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineFavorite } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import API_ENDPOINTS from '../apiConfig.js';
import { NewFolderInput } from '../UserInput/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';

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
    const [hovered, setHovered] = useState(false);

    const handleOpen = (dir) => {
      getlinks(dir)
      setOpen(true)
      setCurrentDirectory(dir)
    };
  
    const handleClose = () => {
      setCurrentDirectory('')
      setFav(false)
      setOpen(false)
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
                setDirs(response)
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
         })();
         if(currentDirectory!='' || fav){
            if(fav){
                getlinks(null,true);
            }
            else getlinks(currentDirectory);
         }
    },[globalRefresh]);

    const getThumbnail=async(id)=>{
        try{
            var response=await fetch(API_ENDPOINTS.getThumbnail+id,{
                method: "GET",
                headers:{
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json'
                }
            });
            response=await response.json();
            return response.url;
        }catch(err){
            console.log("error while fetching thumbnails",err);
            return null
        }
    }

    const handleLinkInsertion=async(link,id)=>{
        if(props.appendToBody){
            const thumbnail_link=await getThumbnail(id);
            var ret
            if(thumbnail_link!=undefined && thumbnail_link!=null){
                ret=`<img src='${thumbnail_link}' style={{width: '200px' ,display: 'inline-block'}}/><br>`
            }
            ret+=`<a href='${link}'>video link</a>`
            props.appendToBody(ret)
        }
        else{
            props.appendToMessage(`${link}`)
        }
    }

    const toggleFavourite=async(videoId)=>{
        
        try{
            await fetch(API_ENDPOINTS.toggleFavourite,{
                method: "PATCH",
                headers:{
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: videoId
                })
            })
            
        }catch(err){
            console.log("could not move",err)
        }
    }

  return (
    <div>
    <div className="text-center" >
    <button
    style={{ marginTop: '16px', marginRight: '8px', fontSize: '16px', color: '#0d6efd', border:'none', background:'none' }}
    onClick={() => { setOpenNewFolder(true) }}
>
    <FaFolderPlus style={{ marginRight: '4px', color: '#0d6efd' }} />
    Create new folder
</button>

<button
    variant= 'outline-primary'
    style={{ marginTop: '16px', marginLeft: '8px', fontSize: '16px', color: '#0d6efd', border:'none', background:'none' }}
    onClick={getFavourites}
>
    <FaRegStar style={{ marginRight: '4px', color: '#0d6efd' }} />
    Favourites
</button>

    <br />
    <br />
    <div className="modal" style={{ display: openNewFolder ? 'block' : 'none' }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Enter title</h5>
                    <button type="button" className="close" onClick={() => { setOpenNewFolder(false) }}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <NewFolderInput closePopup={async () => { setOpenNewFolder(false); getDirs() }} />
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={async () => { setOpenNewFolder(false); getDirs() }}>
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
    {
    dirs.length > 0 && (
        <h4 className="mt-2 mb-3 ">Folders</h4>
        )
     }
        {
           dirs.map((dir) => {
            return (
                    <div className="d-inline-block">
                        <div
                            className="card"
                            style={{
                                textAlign: 'center',
                                display: 'inline-block',
                                padding: '6px',
                                margin: '6px',
                                width: '180px',
                                height: '50px',
                                background: 'transparent',
                                boxShadow: 'none',
                                border:'none'
                            }}
                            onMouseEnter={() => setHoveredDir(dir.directory_name)}
                            onMouseLeave={() => setHoveredDir(null)}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                <div
                                    onClick={() => {
                                        handleOpen(dir.directory_name);
                                    }}
                                    style={{ alignItems: 'center', display: 'flex', flex: 1 }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FcFolder style={{ width: '48px', height: '48px', marginBottom: '5px' }} />
                                    </div>
                                    <div style={{ marginLeft: '7px' }}>
                                        <h7 style={{ margin: 0 }}>{dir.directory_name}</h7>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {/* Rename button */}
                                    {hoveredDir === dir.directory_name && (
                                    <button
                                        onClick={() => {
                                            setDirToRename(dir.directory_name);
                                        }}
                                        style={{ marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                        data-mdb-toggle="tooltip"
                                        data-mdb-placement="bottom"
                                        title="Rename this video"
                                    >
                                    <MdOutlineDriveFileRenameOutline/>
                                    </button>
                                    )}
        
                                    {/* Delete button */}
                                    {hoveredDir === dir.directory_name && (
                                    <button
                                        onClick={async () => {
                                            await deleteDirectory(dir.directory_name);
                                        }}
                                        style={{ marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                        data-mdb-toggle="tooltip"
                                        data-mdb-placement="bottom"
                                        title="Delete this video"
                                    >
                                    <RiDeleteBin6Line/>
                                    </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
            );
        })
        }
       {(currentDirectory !== '' || fav) && (
        <div className="mt-2"> 
            <button style={{color: '#0d6efd', border:'none', background:'none'}} onClick={handleClose}>
            Close Folder
            </button>
        </div>
)}
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {(currentDirectory !== '' || fav) &&
            links.map((item) => (
            <div style={{ display: 'inline-block', marginTop: '10px' }} key={item.id}>
                <div
                className="card"
                style={{
                    width: '330px',
                    borderRadius: '1%',
                    border: '1px solid black',
                    position: 'relative',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                >
                <iframe
                    title={item.video_title}
                    width="100%"
                    height="auto"
                    src={item.link}
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{ backgroundColor: 'black' }}
                />
                    <div className="card-body" style={{ paddingTop: '0', paddingBottom: '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h6 className="card-title">{item.video_title}</h6>
                        {hovered && ( 
                        <div className="btn-group" role="group" aria-label="Video actions">
                        <button
                            title="Insert link to mail body"
                            style={{ color: '#0d6efd', border: 'none', marginRight: '6px', backgroundColor: '#FFFFFF' }}
                            onClick={() => {
                            handleLinkInsertion(item.link, item.id);
                            }}
                        >
                            <IoIosLink />
                        </button>
                        <button
                            title="Copy to clipboard"
                            style={{ color: '#0d6efd', border: 'none', marginRight: '6px', backgroundColor: '#FFFFFF' }}
                            onClick={() => {
                            navigator.clipboard.writeText(`${item.link}`);
                            }}
                        >
                            <GoCopy />
                        </button>
                        <button
                            title="Delete video"
                            style={{ color: '#0d6efd', border: 'none', marginRight: '6px', backgroundColor: '#FFFFFF' }}
                            onClick={async () => {
                            await deleteVideo(item.id, currentDirectory);
                            }}
                        >
                            <FiTrash2 />
                        </button>
                        <button
                            title="Add to favourites"
                            style={{ color: '#0d6efd', border: 'none', marginRight: '6px', backgroundColor: '#FFFFFF' }}
                            onClick={() => {
                            toggleFavourite(item.id);
                            }}
                        >
                            {item.is_favourite ? <MdOutlineFavorite className="text-primary" /> : <MdOutlineFavorite />}
                        </button>
                        </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
    </div>
</div>
  )
}

export default Library