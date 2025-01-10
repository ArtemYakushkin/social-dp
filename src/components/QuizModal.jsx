import React from "react";

import { IoIosClose } from "react-icons/io";

const QuizModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div>{message}</div>
        <button className="modal-btn-close" onClick={onClose}>
          <IoIosClose size={30} color="var(--text-grey-light)" />
        </button>
      </div>
    </div>
  );
};

export default QuizModal;
