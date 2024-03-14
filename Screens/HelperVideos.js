import React, { useContext, useState } from "react";
import ScreenContext from "../contexts/ScreenContext";
import BackButton from "../components/BackButton";

const MiddleSection = ({ title, detail, openModal }) => {
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
      <h4 class="title">{title}</h4>
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
      videoSrc: "https://play.vidyard.com/2ZvdQMJWiHaN6GHDMwG6wG.html?",
      imgSrc: "/screens/Record_video.png",
      alt: "This image is related to a video which says about how to record & send video",
      text: "How to send Video",
    },
    {
      videoSrc: "https://play.vidyard.com/JXjqZR2ACN5aoZNJxWkZJJ.html?",
      imgSrc: "/screens/Record_audio.png",
      alt: "This image is related to a video which says about how to send audio",
      text: "How to send Audio",
    },
  ];

  const info = [
    {
      videoSrc: "https://play.vidyard.com/2ZvdQMJWiHaN6GHDMwG6wG.html?",
      imgSrc: "/screens/Record_video.png",
      alt: "This image is related to a video which says about how to record & send video",
      text: "How to send Video",
    },
    {
      videoSrc: "https://play.vidyard.com/JXjqZR2ACN5aoZNJxWkZJJ.html?",
      imgSrc: "/screens/Record_audio.png",
      alt: "This image is related to a video which says about how to send audio",
      text: "How to send Audio",
    },
    {
      videoSrc: "https://play.vidyard.com/nfAw1a2scendwz7VfuydyE.html?",
      imgSrc: "/screens/Record_chatgpt_prompts.png",
      alt: "This image is related to a video which says about how to send Chatgpt prompts",
      text: "How to add Chatgpt prompts",
    },
    {
      videoSrc: "https://play.vidyard.com/bZYGwE5EsWUMzMjf9zNJpa.html?",
      imgSrc: "/screens/Record_gif.png",
      alt: "This image is related to a video which says about how to send GIF",
      text: "How to send GIF",
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
                  src="/screens/Record_video.png"
                  alt="This image is related to a video which says about how to record & send video"
                  onClick={(e) => {
                    openPopUp(
                      "https://play.vidyard.com/2ZvdQMJWiHaN6GHDMwG6wG.html?",
                      e
                    );
                  }}
                />
                <p
                  className="para-md mt-1 text-wrap text-center cursor-pointer"
                  onClick={(e) => {
                    openPopUp(
                      "https://play.vidyard.com/2ZvdQMJWiHaN6GHDMwG6wG.html?",
                      e
                    );
                  }}
                >
                  How to send Video
                </p>
              </div>
            </section>

            {detail && (
              <MiddleSection
                title="How to Videos"
                detail={detail}
                openModal={openPopUp}
              />
            )}

            <section className=" my-2 overflow-auto">
              <h4 class="title">Tutorial Videos</h4>

              {info && videomodules}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
export default HelperVideos;
