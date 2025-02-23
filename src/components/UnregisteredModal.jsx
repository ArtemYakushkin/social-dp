import React, { useState, useEffect } from "react";

import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import Robot from "../assets/robot-attention.png";

import { IoIosClose } from "react-icons/io";

import "../styles/UnregisteredModal.css";

const UnregisteredModal = ({ isOpen, onClose }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (isRegisterModalOpen || isLoginModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRegisterModalOpen, isLoginModalOpen]);

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

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
          <div className="unreg-btn-box">
            <button className="unreg-btn unreg-login" onClick={() => setIsLoginModalOpen(true)}>
              Sign in
            </button>
            <button
              className="unreg-btn unreg-register"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Register
            </button>
          </div>
        </div>

        <button className="modal-btn-close" onClick={onClose}>
          <IoIosClose size={30} color="var(--text-grey-light)" />
        </button>
      </div>

      {isRegisterModalOpen && (
        <RegisterPage
          isVisible={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          openLogin={openLogin}
        />
      )}

      {isLoginModalOpen && (
        <LoginPage
          isVisible={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          openRegister={openRegister}
        />
      )}
    </div>
  );
};

export default UnregisteredModal;
