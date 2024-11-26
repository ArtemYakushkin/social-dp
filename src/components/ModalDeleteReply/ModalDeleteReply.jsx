import React from "react";
import "./ModalDeleteReply.css";

const ModalDeleteReply = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Are you sure you want to delete this reply?</h3>
        <div className="modal-actions">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteReply;
