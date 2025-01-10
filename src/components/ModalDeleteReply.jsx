import React from "react";

import "../styles/ModalDeleteReply.css";

const ModalDeleteReply = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal mdr-modal">
        <div className="mdr-wrapp">
          <h2 className="mdr-title">Are you sure you want to delete this reply?</h2>
          <div className="mdr-actions">
            <button className="mdr-btn mdr-btn-yes" onClick={onConfirm}>
              Yes
            </button>
            <button className="mdr-btn mdr-btn-no" onClick={onCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteReply;
