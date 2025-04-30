import React, { useState, useEffect } from "react";

import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import Robot from "../assets/robby-hello2.svg";

import { IoIosClose } from "react-icons/io";

import "../styles/UnregisteredModal.css";

const UnregisteredModal = ({ isOpen, onClose }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen || isRegisterModalOpen || isLoginModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isRegisterModalOpen, isLoginModalOpen]);

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
    closeModal();
  };

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
    closeModal();
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-btn-close" onClick={onClose}>
          <IoIosClose size={30} color="var(--text-grey-dark)" />
        </button>

        <div className="unreg-wrapp">
          <div className="unreg-img-box">
            <img className="unreg-img-robot" src={Robot} alt="robot" />
          </div>
          <div className="unreg-content">
            <h4 className="unreg-title">Please note</h4>
            <p className="unreg-text">
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
      </div>

      {isRegisterModalOpen && (
        <RegisterPage
          isVisible={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          openLogin={openLogin}
          onCloseUnreg={closeModal}
        />
      )}

      {isLoginModalOpen && (
        <LoginPage
          isVisible={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          openRegister={openRegister}
          onCloseUnreg={closeModal}
        />
      )}
    </div>
  );
};

export default UnregisteredModal;
