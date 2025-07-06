import React from "react";

const ModalLogout = ({ logout, onClose }) => {
  return (
    <div className="modal-overlay" id="modal-overlay">
      <div className="modal mcd-modal">
        <div className="mcd-wrapp">
          <h2 className="mcd-title">Are you sure you want to log out of your account?</h2>
          <div className="mcd-actions">
            <button
              className="mcd-btn mcd-btn-yes"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Yes
            </button>
            <button className="mcd-btn mcd-btn-no" onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLogout;
