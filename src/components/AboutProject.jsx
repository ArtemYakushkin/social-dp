import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import stroke from "../assets/stroke.png";
import map from "../assets/map-stroke.png";
import leter from "../assets/letter.png";

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

import "../styles/AboutProject.css";

const AboutProject = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const slides = [
    <div className="ap-slide1">
      <img className="ap-slide1-img-stroke" src={stroke} alt="" />
      <img className="ap-slide1-img-map" src={map} alt="" />
      <div className="ap-slide1-info">
        <h4 className="ap-slide1-title">What is a Dear Penfriend?</h4>
        <p className="ap-slide1-text">
          This is a social network for those who want to communicate while learning English with
          people from all over the world
        </p>
      </div>
      <div className="ap-slide1-bubble">
        <p className="ap-slide1-speech">Swipe right and find out how it works</p>
      </div>
      <img className="ap-slide1-img-leter" src={leter} alt="" />
    </div>,
    <div>
      <h4>Title 2</h4>
      <p>Description for the 2 slide</p>
    </div>,
    <div>
      <h4>Title 3</h4>
      <p>Description for the 3 slide</p>
    </div>,
  ];

  const slideCount = slides.length;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
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

        <div className="ap-slider-container">
          <div className="ap-slider">
            <div className="ap-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slide, index) => (
                <div className="ap-slide" key={index}>
                  {slide}
                </div>
              ))}
            </div>
          </div>

          <button className="ap-prev" onClick={handlePrev}>
            <MdOutlineArrowBackIos size={22} style={{ color: "var(--text-white)" }} />
          </button>
          <button className="ap-next" onClick={handleNext}>
            <MdOutlineArrowForwardIos size={22} style={{ color: "var(--text-white)" }} />
          </button>

          <div className="ap-navigation">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`ap-nav-dot ${currentSlide === index ? "ap-nav-active" : ""}`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
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
