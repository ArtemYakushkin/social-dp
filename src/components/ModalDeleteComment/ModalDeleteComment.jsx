import React from "react";
import "./ModalDeleteComment.css";

const ModalConfirmDelete = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal mcd-modal">
        <div className="mcd-wrapp">
          <h2 className="mcd-title">
            Are you sure you want to delete this comment?
          </h2>
          <div className="mcd-actions">
            <button className="mcd-btn" onClick={onConfirm}>
              Yes
            </button>
            <button className="mcd-btn" onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
