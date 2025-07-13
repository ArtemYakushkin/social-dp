import React, { useState, useEffect } from "react";

import "../styles/ModalEdit.css";

const ModalEdit = ({ text, onSave, onCancel, onTextChange }) => {
  const [error, setError] = useState("");

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

  const handleSaveClick = () => {
    if (text.trim() === "") {
      setError("Message cannot be empty");
      return;
    }

    const englishRegex = /^[\p{Emoji}A-Za-z0-9 .,!?'"()\-\n\r]+$/u;
    if (!englishRegex.test(text)) {
      setError("Only English characters are allowed");
      return;
    }

    setError("");
    onSave();
  };

  return (
    <div className="modal-overlay" id="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal mer-modal">
        <div className="mer-wrapp">
          <textarea
            className="mer-input"
            value={text}
            onChange={(e) => {
              onTextChange(e.target.value);
              setError("");
            }}
          />
          {error && <p className="mer-error">{error}</p>}
          <div className="mer-actions">
            <button className="mer-btn mer-btn-save" onClick={handleSaveClick}>
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

export default ModalEdit;
