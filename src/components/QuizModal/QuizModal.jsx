import React from "react";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import "./QuizModal.css";

const QuizModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div>{message}</div>
        <button className="modal-btn-close" onClick={onClose}>
          <Close />
        </button>
      </div>
    </div>
  );
};

export default QuizModal;
