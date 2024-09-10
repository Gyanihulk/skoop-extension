import { useContext } from 'react';
import TourContext from '../../contexts/TourContext.js'
import { Toaster } from 'react-hot-toast';


const ToasterWrapper = () => {
  const { isMessageTour } = useContext(TourContext);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'custom-toast',
        duration: 30000,
      }}
      containerClassName={`custom-toast-container ${isMessageTour ? 'tour-active' : ''}`}
    />
  );
};

export default ToasterWrapper;