import React from "react";
import "./ModalEditReply.css";

const ModalEditReply = ({ text, onSave, onCancel, onTextChange }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Reply</h3>
        <input value={text} onChange={(e) => onTextChange(e.target.value)} />
        <div className="modal-actions">
          <button onClick={onSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditReply;
