import React from 'react'
import { IoMdClose } from 'react-icons/io'

const ConfirmationModal = ({ show, onHide, onConfirm }) => {
  const onConfirmed = () => {
    onConfirm()
    onHide()
  }

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-overlay  modal-dialog-centered" role="document">
        <div className="modal-content mx-2">
          <div className="modal-header d-flex flex-row justify-content-between px-3 pt-3 pb-2 border-0">
            <h5 className="modal-title">Confirm Subscription</h5>
            <button type="button" className="custom-close-button" onClick={onHide} aria-label="Close">
              <IoMdClose size={16} />
            </button>
          </div>
          <div className="modal-body">
            <h5 className="modal-title">Are you sure you don't have a coupon to apply?</h5>
          </div>
          <div className="modal-footer d-flex justify-content-end border-0 py-1">
            <button type="button" className="modal-btn me-2" onClick={onHide}>
              No
            </button>
            <button type="button" className="modal-btn" onClick={onConfirmed}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
