import React, { useContext, useState } from 'react'
import ScreenContext from '../contexts/ScreenContext'
import BackButton from '../components/BackButton'
import { FaPlay } from 'react-icons/fa'

const MiddleSection = ({ detail, openModal }) => {
  const addModules = detail.map(({ imgSrc, videoSrc, alt, text }, index) => {
    return (
      <div className="title-video-parent" key={index}>
        <div class="title-video overflow-hidden position-relative">
          <img
            key={index}
            src={imgSrc}
            alt={alt}
            onClick={(e) => openModal(videoSrc, e)}
          />
          <div id="video-play-icon" style={{ width: '24px', height: '24px' }}>
            <FaPlay color="white" size={10} />
          </div>
        </div>
        <p
          className="para-md mt-1 text-wrap cursor-pointer"
          onClick={(e) => openModal(videoSrc, e)}
        >
          {text}
        </p>
      </div>
    )
  })

  return (
    <section className="video-middle mt-2">
      <div className="w-100 d-flex justify-content-between mt-2 mb-4">
        {detail && addModules}
      </div>
    </section>
  )
}

const SmallVideoModule = ({ detail, openModal }) => {
  return (
    <div className="d-flex align-items-center justify-content-start mb-2">
      <div class="title-video overflow-hidden position-relative">
        <img
          width={150}
          height={110}
          src={detail.imgSrc}
          alt={detail.alt}
          onClick={(e) => openModal(detail.videoSrc, e)}
        />
        <div id="video-play-icon"  style={{ width: '18px', height: '18px' }}>
          <FaPlay color="white" size={6} />
        </div>
      </div>
      <p
        className="para-md mt-1 text-wrap cursor-pointer"
        onClick={(e) => openModal(detail.videoSrc, e)}
      >
        {detail.text}
      </p>
    </div>
  )
}
const HelperVideos = () => {
  const [playingVideo, setPlayingVideo] = useState(false)
  const { navigateToPage } = useContext(ScreenContext)

  async function sendMessageToBackgroundScript(request) {
    await chrome.runtime.sendMessage(request)
  }

  const openPopUp = (src, event) => {
    if (event) {
      event.stopPropagation()
    }
    const height = 322 * 2
    const width = 574 * 2

    sendMessageToBackgroundScript({
      action: 'startPlayingVideo',
      height,
      width,
      src,
    })
    setPlayingVideo(true)
  }

  const closePopUp = () => {
    setSource('')
    setShowModal(false)
  }

  const detail = [
    {
      videoSrc: "https://play.vidyard.com/UGEUwRVNppReqNcqthBrNh",
      imgSrc: "/screens/helperImages/2.png",
      alt: "This image is related to a video which says about how to record & send video",
      text: "2.Create a video on linkedIn",
    },
    {
      videoSrc: "https://play.vidyard.com/Az8t22sqAuJeZytJwGekE4",
      imgSrc: "/screens/helperImages/3.png",
      alt: "This image is related to a video which says about how to send audio",
      text: "3.Creating a welcome video",
    },
  ]

  const info = [
    {
      videoSrc: "https://play.vidyard.com/GFCJo68GJP6PARscaHAQg7",
      imgSrc: "/screens/helperImages/4.png",
      alt: "This image is related to a video which says about how to record & send video",
      text: "4.Creating a Voice Memo",
    },
    {
      videoSrc: "https://play.vidyard.com/bLmzPhpegHvo8rWpLboKNb",
      imgSrc: "/screens/helperImages/5.png",
      alt: "This image is related to a video which says about how to send audio",
      text: "5.Adding an Animated Gif",
    },
    {
      videoSrc: "https://play.vidyard.com/U15yecB66tJ2Fxnh2bQFhY",
      imgSrc: "/screens/helperImages/6.png",
      alt: "This image is related to a video which says about how to send Chatgpt prompts",
      text: "6.Reusable Replies",
    },
    {
      videoSrc: "https://play.vidyard.com/oMuPe7PpZZCEZXjpueFshA",
      imgSrc: "/screens/helperImages/7.png",
      alt: "This image is related to a video which says about how to send GIF",
      text: "7.Manage Your Videos and Media",
    },
    {
      videoSrc: "https://play.vidyard.com/2M5LM4R2B3Zx31sJPBZBHB",
      imgSrc: "/screens/helperImages/8.png",
      alt: "This image is related to a video which says about how use skoop calendar",
      text: "8.Using Skoops Booking calendar",
    },
    {
      videoSrc: "https://play.vidyard.com/eTUUQcXvEhZQiu5BQbTEkj",
      imgSrc: "/screens/helperImages/9.png",
      alt: "This image is related to a video which says about how to send GIF",
      text: "9.Sending a video via Gmail",
    },
  ]

  const videomodules = info.map((detail, index) => {
    return (
      <SmallVideoModule detail={detail} key={index} openModal={openPopUp} />
    )
  })
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
              <div className="overflow-hidden">
                <div className="position-relative">
                  <img
                    src="/screens/helperImages/1.png"
                    alt="This image is related to a video which says about how to record & send video"
                    onClick={(e) => {
                      openPopUp(
                        'https://play.vidyard.com/WnmHTXaJe9StcYvc8uqJdm',
                        e
                      )
                    }}
                  />

                  <div
                    id="video-play-icon"
                    style={{ width: '44px', height: '44px' }}
                  >
                    <FaPlay color="white" />
                  </div>
                </div>
                <p
                  className="para-md my-2 text-wrap text-center cursor-pointer"
                  onClick={(e) => {
                    openPopUp(
                      'https://play.vidyard.com/WnmHTXaJe9StcYvc8uqJdm',
                      e
                    )
                  }}
                >
                 1.Overview of the Skoop Application 
                </p>
              </div>
            </section>

            {detail && <MiddleSection detail={detail} openModal={openPopUp} />}

            <section className=" my-2 overflow-auto">
              {info && videomodules}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
export default HelperVideos
