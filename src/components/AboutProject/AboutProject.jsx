import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { useAuthModals } from "../../hooks/useAuthModals";
import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";

import { MdOutlinePlayCircleOutline } from "react-icons/md";

import poster from "../../assets/Cover_video.png";
import video from "../../assets/Promo_Dear_Penfriend.mp4";

const AboutProject = () => {
  const {
    isRegisterModalOpen,
    isLoginModalOpen,
    setIsRegisterModalOpen,
    setIsLoginModalOpen,
    openLogin,
    openRegister,
    handleRegisterClick,
  } = useAuthModals();
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleVideoPlay = () => setIsPlaying(true);
    const handleVideoPause = () => setIsPlaying(false);
    const handleVideoEnd = () => {
      setIsPlaying(false);
      videoElement.currentTime = 0;
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

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current.play();
  };

  return (
    <div className="about">
      <div className="container">
        <h2 className="about-title sectionTitle">About the project</h2>

        <div className="about-video-container">
          <video
            ref={videoRef}
            src={video}
            poster={poster}
            className="about-video-element"
            controls={isPlaying}
          />
          {!isPlaying && (
            <button onClick={handlePlay} className="about-play-button">
              <MdOutlinePlayCircleOutline size={isMobile ? "60" : "100"} />
            </button>
          )}
        </div>
        <div className="about-btn-box">
          <button className="btnHighTransparent" onClick={() => navigate("/about")}>
            Learn more about project
          </button>
          <button className="btnHighFill" onClick={handleRegisterClick}>
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
