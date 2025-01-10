import React from "react";

import "../styles/ModalEditReply.css";

const ModalEditReply = ({ text, onSave, onCancel, onTextChange }) => {
  return (
    <div className="modal-overlay">
      <div className="modal mer-modal">
        <div className="mer-wrapp">
          <h2 className="mer-title">Edit your reply</h2>
          <input
            className="mer-input"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
          />
          <div className="mer-actions">
            <button className="mer-btn mer-btn-save" onClick={onSave}>
              Save
            </button>
            <button className="mer-btn mer-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditReply;
