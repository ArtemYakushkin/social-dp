import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import leter from "../assets/letter.png";
import leterTablet from "../assets/tablet/letter-tablet.png";
import leterMobile from "../assets/mobile/letter-mobile.png";

import "../styles/AboutProject.css";

const AboutProject = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  const getImage = () => {
    if (isMobile) return leterMobile;
    if (isTablet) return leterTablet;
    return leter;
  };

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
              This is a social network for those who want to communicate while learning English with
              people from all over the world
            </p>
            <div className="ap-slide-bubble">
              <p className="ap-slide-speech">Swipe right and find out how it works</p>{" "}
            </div>
          </div>
          <img className="ap-slide-img-leter" src={getImage()} alt="letter" />
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
