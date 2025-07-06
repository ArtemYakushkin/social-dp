import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import { MdOutlinePlayCircleOutline } from "react-icons/md";

import poster from "../assets/Cover_video.png";
import video from "../assets/Promo_Dear_Penfriend.mp4";

import "../styles/AboutProject.css";

const AboutProject = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  // const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

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

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleVideoPlay = () => setIsPlaying(true);
    const handleVideoPause = () => setIsPlaying(false);
    const handleVideoEnd = () => {
      setIsPlaying(false);
      videoElement.currentTime = 0; // сбрасываем на начало
    };

    videoElement.addEventListener("play", handleVideoPlay);
    videoElement.addEventListener("pause", handleVideoPause);
    videoElement.addEventListener("ended", handleVideoEnd);

    return () => {
      videoElement.removeEventListener("play", handleVideoPlay);
      videoElement.removeEventListener("pause", handleVideoPause);
      videoElement.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current.play();
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

        <div className="ap-video-container">
          <video
            ref={videoRef}
            src={video}
            poster={poster}
            className="ap-video-element"
            controls={isPlaying}
          />
          {!isPlaying && (
            <button onClick={handlePlay} className="ap-play-button">
              <MdOutlinePlayCircleOutline size={isMobile ? "60" : "100"} />
            </button>
          )}
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
