import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import stroke from "../assets/stroke.png";
import map from "../assets/map-stroke.png";
import leter from "../assets/letter.png";

import "../styles/AboutProject.css";

const AboutProject = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
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
    <div className="ap">
      <div className="container">
        <h2 className="ap-title">About the project</h2>

        <div className="ap-slide">
          <div className="ap-slide-info">
            <h4 className="ap-slide-title">What is a Dear Penfriend?</h4>
            <p className="ap-slide-text">
              This is a social network for those who want to communicate
              <br /> while learning English with people from all over the world
            </p>
          </div>
          <div className="ap-slide-bubble">
            <p className="ap-slide-speech">Swipe right and find out how it works</p>
          </div>
          <img className="ap-slide-img-leter" src={leter} alt="" />
        </div>

        <div className="ap-btn-box">
          <button className="ap-btn ap-btn-learn" onClick={() => navigate("/about")}>
            Learn more about project
          </button>
          <button className="ap-btn ap-btn-start" onClick={handleRegisterClick}>
            Register and start chatting
          </button>
        </div>
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

export default AboutProject;
