import React, { useState, useEffect } from "react";

import "../styles/ModalEditComment.css";

const ModalEditComment = ({ isOpen, currentText, onClose, onSave }) => {
  const [newText, setNewText] = useState(currentText);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setNewText(currentText);
  }, [currentText]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(newText);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" id="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal mec-modal">
        <div className="mec-wrapp">
          <textarea
            className="mec-input"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <div className="mec-actions">
            <button className="mec-btn mec-btn-save" onClick={handleSave}>
              Save
            </button>
            <button className="mec-btn mec-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditComment;
