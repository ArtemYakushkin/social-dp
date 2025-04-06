import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import "../styles/HowItWorks.css";

const HowItWorks = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user } = useAuth();

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

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleRegisterClick = () => {
    if (user) {
      toast.info("You are already registered", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      setIsRegisterModalOpen(true);
    }
  };

  return (
    <div className="how">
      <div className="container how-container">
        <h2 className="how-title">How it works</h2>

        <ul className="how-list">
          <li className="how-item-1">
            <span className="how-item-1-step">Step 1</span>
            Complete a short registration, read educational posts and watch interesting videos
          </li>

          <li className="how-item-2">
            <span className="how-item-2-step">Step 2</span>
            You participate in interactive activities, like, actively comment and communicate with
            children from different countries of the world
          </li>

          <li className="how-item-3">
            <span className="how-item-3-step">Step 3</span>
            You receive bonuses and incentives, increase your level on the site and simply enjoy
            communicating with like-minded people
          </li>
        </ul>

        <div className="how-btn-box">
          <button className="how-btn" onClick={handleRegisterClick}>
            Register and start chatting
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
    </div>
  );
};

export default HowItWorks;
