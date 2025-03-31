import React, { useEffect } from "react";

import "../styles/ModalEditReply.css";

const ModalEditReply = ({ text, onSave, onCancel, onTextChange }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" id="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal mer-modal">
        <div className="mer-wrapp">
          <textarea
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
