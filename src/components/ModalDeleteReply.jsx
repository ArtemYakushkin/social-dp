import React, { useEffect } from "react";

import "../styles/ModalDeleteReply.css";

const ModalDeleteReply = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    // Отключаем прокрутку при открытии модального окна
    document.body.style.overflow = "hidden";

    return () => {
      // Включаем прокрутку при закрытии модального окна
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal mdr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mdr-wrapp">
          <h2 className="mdr-title">Are you sure you want to delete this reply?</h2>
          <div className="mdr-actions">
            <button className="mdr-btn mdr-btn-yes" onClick={onConfirm}>
              Yes
            </button>
            <button className="mdr-btn mdr-btn-no" onClick={onCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteReply;
