import React, { useContext, useState } from "react";
import ScreenContext from "../contexts/ScreenContext";
import BackButton from "../components/BackButton";

const MiddleSection = ({  detail, openModal }) => {
  const addModules = detail.map(({ imgSrc, videoSrc, alt, text }, index) => {
    return (
      <div className="title-video-parent" key={index}>
        <div class="title-video border-radius-8 overflow-hidden ">
          <img
            key={index}
            src={imgSrc}
            alt={alt}
            onClick={(e) => openModal(videoSrc, e)}
          />
        </div>
        <p
          className="para-sm mt-1 text-wrap cursor-pointer"
          onClick={(e) => openModal(videoSrc, e)}
        >
          {text}
        </p>
      </div>
    );
  });

  return (
    <section className="video-header mt-2">
      <div className="d-flex align-items-center justify-content-between p-0 m-0 mt-2">
        {detail && addModules}
      </div>
    </section>
  );
};

const SmallVideoModule = ({ detail, openModal }) => {
  return (
    <div className="d-flex align-items-center justify-content-start px-0 mx-0 mt-2">
      <div class="title-video-sm border-radius-8 overflow-hidden ">
        <img
          src={detail.imgSrc}
          alt={detail.alt}
          onClick={(e) => openModal(detail.videoSrc, e)}
        />
      </div>
      <p
        className="para-sm ms-3 text-wrap cursor-pointer"
        onClick={(e) => openModal(detail.videoSrc, e)}
      >
        {detail.text}
      </p>
    </div>
  );
};
const HelperVideos = () => {
  const [playingVideo, setPlayingVideo] = useState(false);
  const { navigateToPage } = useContext(ScreenContext);

  async function sendMessageToBackgroundScript(request) {
    await chrome.runtime.sendMessage(request);
  }

  const openPopUp = (src, event) => {
    if (event) {
      event.stopPropagation();
    }
    const height = 322*2;
    const width = 574*2;

    sendMessageToBackgroundScript({
      action: "startPlayingVideo",
      height,
      width,
      src,
    });
    setPlayingVideo(true);
  };

  const closePopUp = () => {
    setSource("");
    setShowModal(false);
  };

  const detail = [
    {
      videoSrc: "https://play.vidyard.com/UGEUwRVNppReqNcqthBrNh",
      imgSrc: "/screens/helperImages/2.png",
      alt: "This image is related to a video which says about how to record & send video",
      text: "Creating a simple video",
    },
    {
      videoSrc: "https://play.vidyard.com/Az8t22sqAuJeZytJwGekE4",
      imgSrc: "/screens/helperImages/3.png",
      alt: "This image is related to a video which says about how to send audio",
      text: " Creating a Welcome Video",
    },
  ];

  const info = [
    {
      videoSrc: "https://play.vidyard.com/GFCJo68GJP6PARscaHAQg7",
      imgSrc: "/screens/helperImages/4.png",
      alt: "This image is related to a video which says about how to record & send video",
      text: "Creating a Voice Memo",
    },
    {
      videoSrc: "https://play.vidyard.com/bLmzPhpegHvo8rWpLboKNb",
      imgSrc: "/screens/helperImages/5.png",
      alt: "This image is related to a video which says about how to send audio",
      text: "Adding an Animated Gif",
    },
    {
      videoSrc: "https://play.vidyard.com/U15yecB66tJ2Fxnh2bQFhY",
      imgSrc: "/screens/helperImages/6.png",
      alt: "This image is related to a video which says about how to send Chatgpt prompts",
      text: "Reusable Replies",
    },
    {
      videoSrc: "https://play.vidyard.com/oMuPe7PpZZCEZXjpueFshA",
      imgSrc: "/screens/helperImages/7.png",
      alt: "This image is related to a video which says about how to send GIF",
      text: "Manage Your Videos and Media",
    },
  ];

  const videomodules = info.map((detail, index) => {
    return (
      <SmallVideoModule detail={detail} key={index} openModal={openPopUp} />
    );
  });
  return (
    <>
      <div id="helper-videos">
        <div className="lighter-pink">
          <div>
             <div className="pt-3 mb-4">
                <BackButton navigateTo="Home" />
             </div>
          </div>
          <div className="px-4-2">
            <section className="video-header m-0 p-0">
              <div className="border-radius-8 overflow-hidden">
                <img
                  src= "/screens/helperImages/1.png"
                  alt="This image is related to a video which says about how to record & send video"
                  onClick={(e) => {
                    openPopUp(
                      "https://play.vidyard.com/WnmHTXaJe9StcYvc8uqJdm",
                      e
                    );
                  }}
                />
                <p
                  className="para-md mt-1 text-wrap text-center cursor-pointer"
                  onClick={(e) => {
                    openPopUp(
                      "https://play.vidyard.com/WnmHTXaJe9StcYvc8uqJdm",
                      e
                    );
                  }}
                >
                
                </p>
              </div>
            </section>

            {detail && (
              <MiddleSection
                detail={detail}
                openModal={openPopUp}
              />
            )}

            <section className=" my-2 overflow-auto">

              {info && videomodules}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
export default HelperVideos;
