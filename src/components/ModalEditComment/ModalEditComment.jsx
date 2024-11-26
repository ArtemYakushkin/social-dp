import React, { useState } from "react";
import "./ModalEditComment.css";

const ModalEditComment = ({ isOpen, currentText, onClose, onSave }) => {
  const [newText, setNewText] = useState(currentText);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(newText);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal mec-modal">
        <div className="mec-wrapp">
          <input
            className="mec-input"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Edit your comment"
          />
          <div className="mec-actions">
            <button className="mec-btn" onClick={handleSave}>
              Save
            </button>
            <button className="mec-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditComment;
