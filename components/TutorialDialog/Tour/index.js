// Import React and React Joyride
import React, { useState, useContext, useEffect } from 'react'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import GlobalStatesContext from '../../../contexts/GlobalStates'
import TourContext from '../../../contexts/TourContext'
import { defaultOptions, buttonNext, buttonBack, buttonClose, spotlight, buttonSkip, tooltipContainer, tooltipTitle, tooltipContent, tooltip, tooltipFooter, overlay } from './styles.js'

const AppTour = () => {
  const { tours, isMessageTour, messagesTemplateHeight, activeTourStep, stepIndex, handleJoyrideCallback, startTour, activeTourStepIndex, isNextDisabled, disableBtnForDes, isVideoTour } = useContext(TourContext)
  const { selectedTutorial, expand } = useContext(GlobalStatesContext)

  useEffect(() => {
    if (selectedTutorial) {
      startTour(selectedTutorial)
    }
  }, [selectedTutorial])


  return (
    <div>
      {tours.map((tour, index) => (
        <div key={index}>
          <Joyride
            continuous={true}
            run={tour.run}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={false}
            steps={tour.steps}
            stepIndex={stepIndex}
            spotlightClicks={true}
            disableOverlayClose={true} 
            callback={handleJoyrideCallback}
            disableScrolling={true}
            locale={{
              close: 'Exit Tutorial',
              last: 'End Tutorial',
              next: 'Next',
            }}
            styles={{
              options: {
                zIndex: 10000,
              },
              overlay: { ...((isMessageTour && [2, 7, 9].includes(activeTourStepIndex)) || (isVideoTour && [7].includes(activeTourStepIndex)) ? (expand ? { height: '100%' } : { height: messagesTemplateHeight || '100%' }) : { height:'100%' })},
              buttonNext: { ...buttonNext, ...(isMessageTour &&isNextDisabled && (activeTourStepIndex === 3 || activeTourStepIndex === 9) ? { pointerEvents: 'none', opacity: 0.5 } : {}), ...(isMessageTour && disableBtnForDes && activeTourStepIndex === 4 ? { pointerEvents: 'none', opacity: 0.5 } : {}), ...(isVideoTour &&isNextDisabled && (activeTourStepIndex === 7) ? { pointerEvents: 'none', opacity: 0.5 } : {}) },
              buttonBack: buttonBack,
              buttonClose: buttonClose,
              buttonSkip: buttonSkip,
              tooltipContainer: tooltipContainer,
              tooltipTitle: tooltipTitle,
              tooltipContent: tooltipContent,
              tooltip: tooltip,
              tooltipFooter: tooltipFooter,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default AppTour
