import React from "react";

const ModalLogout = ({ logout, onClose }) => {
  return (
    <div className="modal-overlay" id="modal-overlay">
      <div className="modal mdr-modal">
        <div className="mdr-wrapp">
          <h2 className="mdr-title">Are you sure you want to log out of your account?</h2>
          <div className="mdr-actions">
            <button
              className="mdr-btn mdr-btn-yes"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Yes
            </button>
            <button className="mdr-btn mdr-btn-no" onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLogout;
