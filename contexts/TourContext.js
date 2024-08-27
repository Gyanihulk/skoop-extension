import React, { createContext, useRef, useState, useContext, useEffect } from 'react'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import GlobalStatesContext from './GlobalStates'

const TourContext = createContext()

const dynamicMessages = [
  {
    target: '#skoop-extension-body',
    content: (
      <>
        <div>
          <p className="toor-para">When you go to a person’s LinkedIn profile or have any person’s Messaging tabs visible at the bottom of LinkedIn - you will notice above the SKOOP text box there will be the associated names with checkboxes.</p>
          <div className="toor-img mt-1">
            <img src="#" alt="image related to linkedin message tab" />
          </div>
          <h6 className="mt-1 toor-heading">Open the LinkedIn Messaging tab and select a person you want to send a message to.</h6>
          <p className="toor-para mt-1">That will add a checkbox and their names above the SKOOP text box.</p>
        </div>
      </>
    ),
    level: 11,
    placement: 'center',
  },
  {
    target: '#chatWindowsList',
    content: (
      <>
        <div>
          <h6 className="toor-heading">Click the checkbox next to the name you want to send the message to.</h6>
          <p className="toor-para mt-1">Don’t worry after you send it you can delete it from the LinkedIn message.</p>
          <p className="toor-para mt-1">if you are seeing no chat windows please drag the extension to left to open one chat window from the linkedin to see the name here.</p>
        </div>
      </>
    ),
    level: 12,
  },
]

const gmailMessages = {
    target: '#send-button',
    content: (
      <>
        <div>
          <h6 className="toor-heading">Click where you want to insert the message, then click "Send" to insert it into the target location.</h6>
        </div>
      </>
    ),
    level: 13,
    placement: 'auto',
    spotlightPadding: 5,
  };

const linkedInMessages = {
    target: '#send-button',
    content: (
      <>
        <div>
          <h6 className="toor-heading">Click the “Send button.”</h6>
          <p className="toor-para mt-1">You will see that the message was sent to that particular person.</p>
        </div>
      </>
    ),
    level: 13,
    placement: 'auto',
    spotlightPadding: 5,
  };

  const generalMessages = {
    target: '#send-button',
    content: (
      <>
          <div>
              <h6 className="toor-heading">Copy the message and paste it into the required location.</h6>
          </div>
      </>
    ),
    level: 13,
    placement: 'auto',
    spotlightPadding: 5,
  };

const tourConfigs = [
  {
    steps: [
      {
        target: '#Message',
        content: 'Click on the “Message” Icon',
        disableBeacon: true,
        level: 1,
      },
      {
        target: '#messages-select-box',
        content: 'Click on the dropdown menu',
        disableBeacon: true,
        level: 2,
      },
      {
        target: '#add-message',
        content: (
          <>
            <div>
              <p className="toor-para">You will notice that there are some preformatted messages already in there. Ignore them for now.</p>
              <h6 className="mt-1 toor-heading">Click the “+ Add New Message” option.</h6>
            </div>
          </>
        ),
        spotlightPadding: 1,
        level: 3,
      },
      {
        target: '#message-template-title',
        content: (
          <>
            <div>
              <p className="toor-para">We will add a title and details.</p>
              <h6 className="mt-1 toor-heading">In the “Enter title” text field add the words</h6>
              <span className="mt-1 toor-span">“Welcome message”</span>
            </div>
          </>
        ),
        level: 4,
      },
      {
        target: '#message-template-description',
        content: (
          <>
            <div>
              <h6 className="toor-heading">In the “Enter description” text field add the words</h6>
              <p className="toor-para mt-1">
                Hi [FIRST NAME], thank you for being connected. I see that you [ADD DETAILS ABOUT THEM OR HOW WHAT THEY DO CAN RELATE TO YOU AND CONTINUING A MEANINGFUL DISCUSION]. Feel free to reply if it's worth engaging further.
              </p>
            </div>
          </>
        ),
        level: 5,
      },
      {
        target: '#add-message-template-btn',
        content: 'Click the “Save” button.',
        placement: 'left',
        level: 6,
      },
      {
        target: '#messages-select-box',
        content: (
          <>
            <div>
              <p className="toor-para">Congratulations! You just made your first Reusable Message!</p>
              <h6 className="mt-1 toor-heading">Go back to the ”Select Message” and click it to open.</h6>
            </div>
          </>
        ),
        placement: 'auto',
        level: 7,
      },
      {
        target: '#new-template-message',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Look at the first entry at the top of the list. Then, click and drag the item using the 4-arrow icon to move it to the bottom of the list.</h6>
              <p className="toor-para mt-1">That way it is easier to access repeatable messages that are used more often.</p>
            </div>
          </>
        ),
        disableBeacon: true,
        placement:"bottom",
        level: 8,
      },
      {
        target: '#messages-select-box',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Now simply click on the “Select Message” again”</h6>
            </div>
          </>
        ),
        level: 9,
      },
      {
        target: '#new-template-message',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click on the “Welcome Message.”</h6>
              <p className="toor-para mt-1">You will notice it copied the content you just created in the text box at the bottom of SKOOP.</p>
            </div>
          </>
        ),
        level: 10,
        disableBeacon: true,
      },
      {
        target: '#send-button',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Copy the message and paste it into the required location.</h6>
            </div>
          </>
        ),
        level: 13,
        placement: 'auto',
        spotlightPadding: 5,
      },
      {
        target: '#skoop-extension-body',
        content: 'Great job! You now know how to create and use reusable messages, identify the people you want to reply to, and send the message.',
        placement: 'center',
        level: 14,
      },
    ],

    run: false,
    name: 'messages',
  },
  {
    steps: [
      {
        target: '#skoop-extension-body',
        content: (
          <>
            <div>
              <p className="toor-para">So you know, you will be starting with the reusable welcome message you created in tutorial 1.</p>
              <p className="toor-para mt-1">But first, we need to find who you want to send a welcome message to.</p>
              <p className="toor-para mt-1">Most likely a new LinkedIn connection.</p>
              <p className="toor-para mt-1">If you do have not new connections then you can adjust the content appropriately.</p>
              <h6 className="mt-1 toor-heading">On LinkedIn, click on the “My Network” Icon (top center of the screen).</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        placement: 'center',
        level: 1,
      },
      {
        target: '#skoop-extension-body',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click “Manage my network” (left of the screen).</h6>
              <p className="toor-para mt-1">The LinkedIn interface is always changing so if you do not see “Manage my network,” then skip to the next step.</p>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 2,
      },
      {
        target: '#skoop-extension-body',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click “Connections” to view your recent new connections.</h6>
              <p className="toor-para mt-1">You will notice that LinkedIn is showing you your connections in order of connection date. The most recent connections first.</p>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 3,
      },
      {
        target: '#skoop-extension-body',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Scroll down to find connections at least a day or older.</h6>
              <p className="toor-para mt-1">Generally, you do not want to reply right after you connect. It is best to give them some room to breathe. So wait at least 1 to 3 days before sending a message.</p>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 4,
      },
      {
        target: '#skoop-extension-body',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click the message button so the SKOOP App can see who you want to send a video message to.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 5,
      },
      {
        target: '#Message',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Open the SKOOP app and click the “Message” Icon.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 6,
      },
      {
        target: '#messages-select-box',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click “Select Message”</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 7,
      },
      {
        target: '#new-template-message',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Select “Welcome message”</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 8,
      },
      {
        target: '#floatingTextarea',
        content: (
          <>
            <div>
              <p className="toor-para">You will notice that the welcome message content was added to the SKOOP App text area at the bottom.</p>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 9,
      },
      {
        target: '#floatingTextarea',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Confirm the correct text was auto-generated and inserted in the SKOOP app text area.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 10,
      },
      {
        target: '#skoop-extension-body',
        content: (
          <>
            <div>
              <p className="toor-para">Look at the picture and title of the person you are having a conversation with. And sometimes you want to view their profile (open in a new tab) for more details if needed.</p>
              <h6 className="mt-1 toor-heading">Replace any test in the brackets “[]” with the correct information and make adjustments that are appropriate.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        placement: 'center',
        level: 11,
      },
      {
        target: '#skoop_record_button',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click the large “Record Video” button and create a 20 to 40-second welcome video.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 12,
      },
      {
        target: '#video-stop-btn',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click the center graphic on the video interface to stop and save the video.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 13,
      },
      {
        target: '#preview-uploaded-video',
        content: (
          <>
            <div>
              <h6 className="toor-heading">In the Skoop App interface the video will be animated. Click the 3 dots to the right of the video animation and “Rename the video”.</h6>
              <p className='toor-para mt-1'>Make sure you add the name of the person you are talking to.</p>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 14,
      },
      {
        target: '#chatWindowsList',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click the Check Box for the person you are sending the message to.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 15,
      },
      {
        target: '#send-button',
        content: (
          <>
            <div>
              <h6 className="toor-heading">Click the “Send” button.</h6>
            </div>
          </>
        ),
        disableBeacon: true,
        level: 16,
      },
      {
        target: '#skoop-extension-body',
        content: (
          <>
            <div>
              <p className="toor-para">Great job! You just sent a video to a new connection!</p>
            </div>
          </>
        ),
        disableBeacon: true,
        placement: 'center',
        level: 17,
      },
    ],

    run: false,
    name: 'videos',
  },
  {
    steps: [
      {
        target: '#ChatGpt',
        content: 'Use ChatGPT for generating text in your messages',
        disableBeacon: true,
      },
      {
        target: '#gpt-dropdown',
        content: 'Select a new or existing prompt from this dropdown',
        disableBeacon: true,
      },
      {
        target: '#chatgpt-msg-box',
        content: 'Type or select your prompt here',
      },
      {
        target: '#chatgpt-generate-response',
        content: 'Generate a response using ChatGPT',
      },
      {
        target: '#main-message-window',
        content: 'View the ChatGPT-generated message and edit as needed',
      },
      {
        target: '#giphy',
        content: 'Add GIFs to your messages for more fun and expression',
        placement: 'left',
        disableBeacon: true,
        offset: 3,
        spotlightPadding: 5,
      },
      {
        target: '#emoji',
        content: 'Insert emojis to express feelings or reactions',
        placement: 'auto',
        disableBeacon: true,
        offset: 3,
        spotlightPadding: 7,
      },
      {
        target: '#upload-video',
        content: 'Upload a video from your device for more interactive messages',
        placement: 'auto',
        disableBeacon: true,
        offset: 2,
        spotlightPadding: 5,
      },
      {
        target: '#save-custom-message',
        content: 'Save your message as a template for future use',
        placement: 'auto',
        offset: 3,
        spotlightPadding: 5,
      },
      {
        target: '#Message',
        content: 'Add a new message to your drafts or send queue',
      },
      {
        target: '#messages-dropdown',
        content: 'Create a new template or use an existing one for quick messaging',
      },
      {
        target: '#send-button',
        content: 'Perform the action intended',
        placement: 'auto',
        offset: 3,
        spotlightPadding: 5,
      },
    ],
    run: false,
    name: 'chatgpt',
  },
  // Add more tours as needed
]

export const TourContextProvider = ({ children }) => {
  const recordVideoBtnRef = useRef(null);
  const messageRef = useRef(null)
  const selectMessageRef = useRef()
  const addMessageRef = useRef()
  const saveMessageRef = useRef()
  const lastmessageRef = useRef()
  const [showMessageModal, setShowMessageModal] = useState(null)
  const [tours, setTours] = useState(tourConfigs)
  const [stepIndex, setStepIndex] = useState(0)
  const [activeTour, setActiveTour] = useState(null)
  const [isToorActive, setIsToorActive] = useState(false)
  const [activeTourName, setActiveTourName] = useState('')
  const [activeTourStep, setActiveTourStep] = useState(null)

  const [isMessageTour, setIsMessageTour] = useState(false)
  const [activeTourAction, setActiveTourAction] = useState('')
  const [activeTourType, SetActiveTourType] = useState('')
  const [activeTourStepIndex, setActiveTourStepIndex] = useState(0)
  const [openSelect, setOpenSelect] = useState(false)
  const [isNextDisabled, setIsNextDisabled] = useState(false)
  const [saveMessagewithNext, setSaveMessagewithNext] = useState(false)
  const [disableBtnForDes, setDisableBtnForDes] = useState(true)
  const [isAlreadySaved, setIsAlreadySaved] = useState(false)
  const { isLinkedin, isGmail } = useContext(GlobalStatesContext)
  const [disableRecipientSelect, setDisableRecipientSelect] = useState(false)
  const [disableCheckbox, setDisableCheckbox] = useState(false)
  const [sendMessages, setSendMessages] = useState(false)
  const [isSelectOpened, setIsSelectOpened] = useState(false);
  const [messagesTemplateHeight, setMessagesTemplateHeight] = useState(null);
  const [addNewClicked, setAddNewClicked] = useState(false);
  const [isMessageSended, setIsMessageSended] = useState(false)
  const [selectMessage, setSelectMessage] = useState(false)

  const [componentsVisible, setComponentsVisible] = useState({
    renderItem: null,
    nextButtonVisible: false,
  })

  // videos state
  const [isVideoTour, setIsVideoTour] = useState(false);

  useEffect(() => {
    if (tours) {
      const updatedTours = tours.map((tour) => {
        if (tour.name === 'messages') {
          let updatedSteps = tour.steps.filter(
            (step) => step.level !== 11 && step.level !== 12 && step.level !== 13
          );
  
          if (isLinkedin) {
            const stepsToAdd = dynamicMessages;
            const insertAfterStep = 10;
            const insertIndex = updatedSteps.findIndex((step) => step.level === insertAfterStep) + 1;
  
            updatedSteps.splice(insertIndex, 0, ...stepsToAdd);
            updatedSteps.splice(insertIndex + stepsToAdd.length, 0, linkedInMessages);
          } else if (isGmail) {
            updatedSteps.splice(10, 0, gmailMessages);
          } else {
            updatedSteps.splice(10, 0, generalMessages);
          }
  
          return {
            ...tour,
            steps: updatedSteps,
          };
        }
        return tour;
      });

      setTours(updatedTours);
    }
  }, [tours, isLinkedin, isGmail]);
  

  function renderNext() {
    setStepIndex(stepIndex + 1)
  }

  const startTour = (tourName) => {
    const updatedTours = tours.map((tour) => {
      if (tour.name === tourName) {
        setActiveTour(tour.steps)
        setActiveTourName(tourName)
        setIsToorActive(true)
        setIsMessageTour(tourName === 'messages')
        setIsVideoTour(tourName === 'videos')
      }
      return {
        ...tour,
        run: tour.name === tourName,
      }
    })
    setTours(updatedTours)
  }

  const initializeTour = () => {
    const updatedTours = tours.map((tour) => ({
      ...tour,
      run: false,
    }))
    setTours(updatedTours)
    setActiveTourName('')
    setActiveTour(null)
    setIsToorActive(false)
    setActiveTourStep(null)
    setIsMessageTour(false)
    setStepIndex(0)
    setSaveMessagewithNext(false)
    setShowMessageModal(null)
    setOpenSelect(false)
    setIsNextDisabled(false)
    setSaveMessagewithNext(false)
    setDisableCheckbox(false)
    setComponentsVisible({
      renderItem: null,
      nextButtonVisible: false,
    })
    setSendMessages(false);
    setIsSelectOpened(false);
    setIsAlreadySaved(false);
    setIsVideoTour(false);
    setAddNewClicked(false);
    setMessagesTemplateHeight(null);
    setIsMessageSended(false);
    setSelectMessage(false);
  }

  const handleJoyrideCallback = (data) => {
    try {
      const { action, index, type, status, size } = data
      setActiveTourStepIndex(index)
      if (activeTour) {
        let step = activeTour[index]
        setActiveTourStep(step)
      }
      if ((index === activeTour?.length && type === 'tooltip') || action === ACTIONS.CLOSE || action === ACTIONS.SKIP) {
        initializeTour();
        return
      }

      if (index === 10 && type === EVENTS.STEP_BEFORE) {
        setOpenSelect(false)
      }

      if (type === EVENTS.STEP_AFTER || (action === ACTIONS.CLICK && activeTour)) {
        if(index + 1 === size) {
          initializeTour();
        }
        const nextStep = activeTour[index + 1]
        if (nextStep) {
          const nextTarget = document.querySelector(nextStep.target)
          if (!nextTarget) {
            setComponentsVisible({ ...componentsVisible, renderItem: index + 1 })
          } else {
              if(isMessageTour) {
                if(index == 1 && !isSelectOpened) {
                  setOpenSelect(true);
                  setIsSelectOpened(true);
                  setComponentsVisible({ ...componentsVisible, renderItem: 2 })
                }
                if (index === 2) {
                  setComponentsVisible({ ...componentsVisible, renderItem: 3 })
                } else if (index === 5 && !isAlreadySaved) {
                  setIsAlreadySaved(true)
                  setOpenSelect(false)
                  setSaveMessagewithNext(true)
                } else if (index === 6) {
                  setComponentsVisible({ ...componentsVisible, renderItem: 7 })
                } else if (index === 7) {
                  setOpenSelect(false)
                } else if (index === 8) {
                  setIsNextDisabled(true)
                  setComponentsVisible({ ...componentsVisible, renderItem: 9 })
                  setOpenSelect(true)
                }
                else if (activeTourStep?.level === 13 && !sendMessages) {
                  setSendMessages(true);
                }
                else if (activeTourStep?.level === 14) {
                  initializeTour();
                }
    
                if (action !== ACTIONS.CLOSE && action !== ACTIONS.SKIP && activeTourStep?.level !== 13 && index !==2 && index !==6) {
                    setStepIndex(index + 1);
                }
              } else if(isVideoTour) {
                if(index === 6 && !isSelectOpened) {
                  setOpenSelect(true);
                  setIsSelectOpened(true);
                  setIsNextDisabled(true);
                  setComponentsVisible({ ...componentsVisible, renderItem: 7 })
                }

                if(index === 7) {
                  setIsNextDisabled(false);
                  setOpenSelect(false);
                  setIsSelectOpened(false);
                }

                if(index === 11) {
                  recordVideoBtnRef?.current?.click();
                  setComponentsVisible({ ...componentsVisible, renderItem: 12 })
                }

                if (action !== ACTIONS.CLOSE && action !== ACTIONS.SKIP && (index!==5 && index !==6 && index !==11 && index !==12)) {
                  setStepIndex(index + 1)
                }
              }
          }
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <TourContext.Provider
      value={{
        recordVideoBtnRef,
        messageRef,
        addMessageRef,
        selectMessageRef,
        saveMessageRef,
        lastmessageRef,
        showMessageModal,
        isMessageTour,
        setIsMessageTour,
        tours,
        setTours,
        stepIndex,
        setStepIndex,
        activeTour,
        setActiveTour,
        isToorActive,
        setIsToorActive,
        setShowMessageModal,
        handleJoyrideCallback,
        startTour,
        activeTourName,
        setActiveTourName,
        activeTourStep,
        setActiveTourStep,
        activeTourAction,
        setActiveTourAction,
        activeTourType,
        SetActiveTourType,
        activeTourStepIndex,
        setActiveTourStepIndex,
        openSelect,
        setOpenSelect,
        isNextDisabled,
        setIsNextDisabled,
        saveMessagewithNext,
        setSaveMessagewithNext,
        componentsVisible,
        setComponentsVisible,
        renderNext,
        disableBtnForDes,
        setDisableBtnForDes,
        isAlreadySaved,
        setIsAlreadySaved,
        disableRecipientSelect,
        setDisableRecipientSelect,
        disableCheckbox,
        setDisableCheckbox,
        sendMessages,
        setSendMessages,
        isSelectOpened, 
        setIsSelectOpened,
        isVideoTour, 
        setIsVideoTour,
        messagesTemplateHeight, 
        setMessagesTemplateHeight,
        addNewClicked, 
        setAddNewClicked,
        isMessageSended, 
        setIsMessageSended,
        selectMessage, 
        setSelectMessage
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export default TourContext
