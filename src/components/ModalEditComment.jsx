import React, { useState, useEffect } from "react";

import "../styles/ModalEditComment.css";

const ModalEditComment = ({ isOpen, currentText, onClose, onSave }) => {
  const [newText, setNewText] = useState(currentText);

  useEffect(() => {
    setNewText(currentText); // Обновляем текст при открытии модального окна
  }, [currentText]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(newText);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal mec-modal">
        <div className="mec-wrapp">
          <h2 className="mec-title">Edit your comment</h2>
          <input
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
