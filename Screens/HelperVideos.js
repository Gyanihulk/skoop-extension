import React, { useContext, useState } from 'react'
import ScreenContext from '../contexts/ScreenContext'
import BackButton from '../components/BackButton'
import { FaPlay } from 'react-icons/fa'
import { sendMessageToBackgroundScript } from '../lib/sendMessageToBackground'

const MiddleSection = ({ detail, openModal }) => {
  const addModules = detail.map(({ imgSrc, videoSrc, alt, text }, index) => {
    return (
      <div className="title-video-parent mx-1" key={index} onClick={(e) => openModal(videoSrc, e)}>
        <div class="title-video overflow-hidden position-relative">
          <img key={index} src={imgSrc} alt={alt} />
          <div id="video-play-icon" style={{ width: '24px', height: '24px' }}>
            <FaPlay color="white" size={10} />
          </div>
        </div>
        <p className="para-md mt-1 text-wrap cursor-pointer">{text}</p>
      </div>
    )
  })

  return (
    <section className="video-middle mt-2">
      <div className="w-100 d-flex justify-content-between mt-2">{detail && addModules}</div>
    </section>
  )
}

const SmallVideoModule = ({ detail, openModal }) => {
  return (
    <div className="d-flex align-items-center justify-content-start mb-2">
      <div class="title-video-sm overflow-hidden position-relative">
        <img width={150} height={110} src={detail.imgSrc} alt={detail.alt} onClick={(e) => openModal(detail.videoSrc, e)} />
        <div id="video-play-icon" style={{ width: '18px', height: '18px' }} onClick={(e) => openModal(detail.videoSrc, e)}>
          <FaPlay color="white" size={6} />
        </div>
      </div>
      <p className="para-small mt-1 cursor-pointer" onClick={(e) => openModal(detail.videoSrc, e)}>
        {detail.text}
      </p>
    </div>
  )
}

const detail = [
  {
    videoSrc: 'https://play.vidyard.com/LChiCn2f7NSdWJexnhzkyz',
    imgSrc: '/screens/helperImages/0.png',
    alt: 'This image is Overview of skoop app.',
    text: 'Demo of the extension.',
  },
  {
    videoSrc: 'https://play.vidyard.com/UGEUwRVNppReqNcqthBrNh',
    imgSrc: '/screens/helperImages/2.png',
    alt: 'This image is related to a video which says about how to record & send video',
    text: 'Create a video on LinkedIn',
  },
]

const info = [
  {
    videoSrc: 'https://play.vidyard.com/LChiCn2f7NSdWJexnhzkyz',
    imgSrc: '/screens/helperImages/0.png',
    alt: 'This image is Overview of skoop app.',
    text: '0.Demo of the extension.',
  },
  {
    videoSrc: 'https://play.vidyard.com/WnmHTXaJe9StcYvc8uqJdm',
    imgSrc: '/screens/helperImages/1.png',
    alt: 'This image is Overview of skoop app.',
    text: '1.Overview of the Skoop Application',
  },
  {
    videoSrc: 'https://play.vidyard.com/UGEUwRVNppReqNcqthBrNh',
    imgSrc: '/screens/helperImages/2.png',
    alt: 'This image is related to a video which says about how to record & send video',
    text: '2.Create a video on LinkedIn',
  },
  {
    videoSrc: 'https://play.vidyard.com/Az8t22sqAuJeZytJwGekE4',
    imgSrc: '/screens/helperImages/3.png',
    alt: 'This image is related to a video which says about how to send audio',
    text: '3.Creating a welcome video',
  },
  {
    videoSrc: 'https://play.vidyard.com/GFCJo68GJP6PARscaHAQg7',
    imgSrc: '/screens/helperImages/4.png',
    alt: 'This image is related to a video which says about how to record & send video',
    text: '4.Creating a Voice Memo',
  },
  {
    videoSrc: 'https://play.vidyard.com/bLmzPhpegHvo8rWpLboKNb',
    imgSrc: '/screens/helperImages/5.png',
    alt: 'This image is related to a video which says about how to send audio',
    text: '5.Adding an Animated Gif',
  },
  {
    videoSrc: 'https://play.vidyard.com/U15yecB66tJ2Fxnh2bQFhY',
    imgSrc: '/screens/helperImages/6.png',
    alt: 'This image is related to a video which says about how to send Chatgpt prompts',
    text: '6.Reusable Replies',
  },
  {
    videoSrc: 'https://play.vidyard.com/oMuPe7PpZZCEZXjpueFshA',
    imgSrc: '/screens/helperImages/7.png',
    alt: 'This image is related to a video which says about how to send GIF',
    text: '7.Manage Your Videos and Media',
  },
  {
    videoSrc: 'https://play.vidyard.com/7xAghki1sGdLDyNWVbE4sR',
    imgSrc: '/screens/helperImages/8.png',
    alt: 'This image is related to a video which says about how use skoop calendar',
    text: '8.Using Skoops Booking calendar',
  },
  {
    videoSrc: 'https://play.vidyard.com/eTUUQcXvEhZQiu5BQbTEkj',
    imgSrc: '/screens/helperImages/9.png',
    alt: 'This image is related to a video which says about how to send GIF',
    text: '9.Sending a video via Gmail',
  },
  {
    videoSrc: 'https://play.vidyard.com/eWtJcmCpnHurtbBfhu8YJ4',
    imgSrc: '/screens/helperImages/10.png',
    alt: 'This image is related to a video which says about how to become affialite',
    text: '10.Become an Affiliate.',
  },
  {
    videoSrc: 'https://play.vidyard.com/qGEcqZB9N4rb3uxn4MZCzG',
    imgSrc: '/screens/helperImages/11.png',
    alt: 'This image is related to a video which says about how to become affialite',
    text: '11.Add Videos and Voice memo to Post Comments.',
  },
  {
    videoSrc: 'https://play.vidyard.com/XwRWJUdBLApPCyGgeJvU26',
    imgSrc: '/screens/helperImages/12.png',
    alt: 'This image is related to a video which says about how to get skoop',
    text: '12.Get Skoop Application and Subscriptions',
  },
  {
    videoSrc: 'https://play.vidyard.com/xco91e4kP3KmDfvCJZKqVa? ',
    imgSrc: '/screens/helperImages/13.png',
    alt: 'How to comments banner.',
    text: '13.Commenting on post with videos and gif.',
  },
]

const HelperVideos = ({ navigateTo }) => {
  const [playingVideo, setPlayingVideo] = useState(false)
  const { navigateToPage } = useContext(ScreenContext)

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

  const videomodules = info.map((detail, index) => {
    return <SmallVideoModule detail={detail} key={index} openModal={openPopUp} />
  })
  return (
    <>
      <div id="helper-videos">
        <div className="lighter-pink">
          <div>
            <div className="pt-3 mb-4">
              <BackButton navigateTo={navigateTo} />
            </div>
          </div>
          <div className="px-4-2">
            <section className="video-header m-0 p-0">
              <div
                className="overflow-hidden"
                onClick={(e) => {
                  openPopUp('https://play.vidyard.com/eWtJcmCpnHurtbBfhu8YJ4', e)
                }}
              >
                <div className="position-relative helper-header-image">
                  <img
                    src="/screens/helperImages/10.png"
                    alt="This image is related to a video which says about how to record & send video"
                    onClick={(e) => {
                      openPopUp('https://play.vidyard.com/eWtJcmCpnHurtbBfhu8YJ4', e)
                    }}
                  />

                  <div id="video-play-icon" style={{ width: '44px', height: '44px' }}>
                    <FaPlay color="white" />
                  </div>
                </div>
                <p className="para-md my-2 text-wrap text-center cursor-pointer">Become an Affiliate.</p>
              </div>
            </section>

            {detail && <MiddleSection detail={detail} openModal={openPopUp} />}

            <section className=" my-2 overflow-auto">{info && videomodules}</section>
          </div>
        </div>
      </div>
    </>
  )
}
export default HelperVideos
