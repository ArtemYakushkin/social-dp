import React, { useEffect } from "react";

import "../styles/ModalDeleteComment.css";

const ModalConfirmDelete = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Блокируем прокрутку
    } else {
      document.body.style.overflow = ""; // Восстанавливаем прокрутку
    }

    return () => {
      document.body.style.overflow = ""; // Сброс при размонтировании
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" id="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal mcd-modal">
        <div className="mcd-wrapp">
          <h2 className="mcd-title">Are you sure you want to delete this comment?</h2>
          <div className="mcd-actions">
            <button className="mcd-btn mcd-btn-yes" onClick={onConfirm}>
              Yes
            </button>
            <button className="mcd-btn mcd-btn-no" onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
