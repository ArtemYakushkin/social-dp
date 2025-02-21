import React from "react";

import { IoIosClose } from "react-icons/io";

import Robot from "../assets/robot-attention.png";

import "../styles/UnregisteredModal.css";

const UnregisteredModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="unreg-wrapp">
          <div className="unreg-img-box">
            <img className="unreg-img-robot" src={Robot} alt="robot" />
          </div>
          <div className="unreg-content">
            <h4 className="unreg-title">Please note</h4>
            <p className="quiz-happy-text">
              Please register or log in to the site to leave comments / likes / participate in
              interactives
            </p>
          </div>
        </div>

        <button className="modal-btn-close" onClick={onClose}>
          <IoIosClose size={30} color="var(--text-grey-light)" />
        </button>
      </div>
    </div>
  );
};

export default UnregisteredModal;
