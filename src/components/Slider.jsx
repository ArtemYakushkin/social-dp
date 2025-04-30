import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";
import slide4 from "../assets/slide4.png";
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import star from "../assets/stars.png";
import stars from "../assets/tablet/stars.png";
import slideMob1 from "../assets/mobile/slide1.png";
import slideMob2 from "../assets/mobile/slide2.png";
import slideMob3 from "../assets/mobile/slide3.png";
import slideMob4 from "../assets/mobile/slide4.png";
import starsMobile from "../assets/mobile/stars.png";

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { GoPlus } from "react-icons/go";

import "../styles/Slider.css";

const AboutSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user } = useAuth();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

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

  const desktopSlides = [
    <div className="aboutSlider-content">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
        <h4 className="aboutSlider-slide-title">What is the Dear Penfriend project?</h4>
        <p className="aboutSlider-slide-text aboutSlider-slide-text-indent">
          Dear Penfriend is a Ukrainian startup, a platform created to help children from all over
          the world learn English.
        </p>
        <p className="aboutSlider-slide-text">
          You can watch videos and photos published on the site by teachers, comment on them and
          communicate, learn and receive feedback from teachers and other students.
        </p>
      </div>
      <div className="aboutSlider-slide-img">
        <img src={slide1} alt="slide-1" />
      </div>
    </div>,
    <div className="aboutSlider-content">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
        <h4 className="aboutSlider-slide-title">
          Interactives and bonus system
          <span className="aboutSlider-slide-star-box">
            <img src={star} alt="star" />
            <img src={star} alt="star" />
            <img src={star} alt="star" />
          </span>
        </h4>
        <p className="aboutSlider-slide-text aboutSlider-slide-text-indent">
          By participating in interactive events, answering questions and actively participating in
          the discussion of posts, you earn bonuses and points, and also increase your rating.
        </p>
        <p className="aboutSlider-slide-text">
          Become a leader among students! A high rating and participation give you the respect of
          other participants.
        </p>
      </div>
      <div className="aboutSlider-slide-img">
        <img src={slide2} alt="slide-2" />
      </div>
    </div>,
    <div className="aboutSlider-content">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
        <h4 className="aboutSlider-slide-title">Advantages of the platform</h4>
        <p className="aboutSlider-slide-text">
          Convenient format, interesting content, motivation through games and tasks. Discuss topics
          with other students, find friends, learn the language in natural communication.
        </p>
      </div>
      <div className="aboutSlider-slide-img">
        <img src={slide3} alt="slide-3" />
      </div>
    </div>,
    <div className="aboutSlider-content">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
        <h4 className="aboutSlider-slide-title">Join today!</h4>
        <p className="aboutSlider-slide-text">
          Connect with thousands of students and teachers from all over the world - learn and have
          fun together! Sign up and start learning English easily and with pleasure.
        </p>
        <button className="aboutSlider-slide-btn" onClick={handleRegisterClick}>
          Register
        </button>
      </div>
      <div className="aboutSlider-slide-img">
        <img src={slide4} alt="slide-4" />
      </div>
    </div>,
  ];

  const tabletSlides = [
    <div className="aboutSlider-content">
      <h3 className="aboutSlider-tab-title">What is the Dear Penfriend project?</h3>
      <div className="aboutSlider-tab-wrapper aboutSlider-tab-wrapper-slide1">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
        <div className="aboutSlider-tab-text-box">
          <p className="aboutSlider-tab-text">
            Dear Penfriend is a Ukrainian startup, a platform created to help children from all over
            the world learn English
          </p>
          <p className="aboutSlider-tab-text">
            You can watch videos and photos published on the site by teachers, comment on them and
            communicate, learn and receive feedback from teachers and other students.
          </p>
        </div>
      </div>
    </div>,
    <div className="aboutSlider-content">
      <div className="aboutSlider-tab-title-box">
        <h3 className="aboutSlider-tab-title aboutSlider-tab-title-slide2">
          Interactives and bonus system
        </h3>
        <img className="aboutSlider-tab-img" src={stars} alt="stars" />
      </div>
      <div className="aboutSlider-tab-wrapper aboutSlider-tab-wrapper-slide2">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
        <div className="aboutSlider-tab-text-box">
          <p className="aboutSlider-tab-text">
            By participating in interactive events, answering questions and actively participating
            in the discussion of posts, you earn bonuses and points, and also increase your rating.
          </p>
          <p className="aboutSlider-tab-text">
            Become a leader among students! A high rating and participation give you the respect of
            other participants.
          </p>
        </div>
      </div>
    </div>,
    <div className="aboutSlider-content">
      <h3 className="aboutSlider-tab-title">Advantages of the platform</h3>
      <div className="aboutSlider-tab-wrapper aboutSlider-tab-wrapper-slide3">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
        <div className="aboutSlider-tab-text-box">
          <p className="aboutSlider-tab-text">
            Convenient format, interesting content, motivation through games and tasks. Discuss
            topics with other students, find friends, learn the language in natural communication.
          </p>
        </div>
      </div>
    </div>,
    <div className="aboutSlider-content">
      <h3 className="aboutSlider-tab-title">Join today and make friends!</h3>
      <div className="aboutSlider-tab-wrapper aboutSlider-tab-wrapper-slide4">
        <button className="aboutSlider-slide-btn" onClick={handleRegisterClick}>
          Register
        </button>
        <div className="aboutSlider-tab-text-box">
          <p className="aboutSlider-tab-text">
            Connect with thousands of students and teachers from all over the world - learn and have
            fun together! Sign up and start learning English easily and with pleasure.
          </p>
        </div>
      </div>
    </div>,
  ];

  const mobileSlides = [
    <div className="aboutSlider-content">
      <h3 className="aboutSlider-mob-title aboutSlider-mob-title-slide1">
        What is the
        <br /> Dear Penfriend project?
        <div className="aboutSlider-avatars aboutSlider-avatars-slide1">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
      </h3>
      <div className="aboutSlider-mob-img-box">
        <img src={slideMob1} alt="slideMob1" />
      </div>
      <div className="aboutSlider-mob-text-box">
        <p className="aboutSlider-mob-text">
          Dear Penfriend is a Ukrainian startup, a platform created to help children from all over
          the world learn English.
        </p>
        <p className="aboutSlider-mob-text">
          You can watch videos and photos published on the site by teachers, comment on them and
          communicate, learn and receive feedback from teachers and other students.
        </p>
      </div>
    </div>,
    <div className="aboutSlider-content">
      <h3 className="aboutSlider-mob-title aboutSlider-mob-title-slide2">
        Interactives and bonus system
        <div className="aboutSlider-avatars aboutSlider-avatars-slide2">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
      </h3>
      <div className="aboutSlider-mob-img-box">
        <img src={slideMob2} alt="slideMob1" />
        <img className="aboutSlider-mob-img" src={starsMobile} alt="stars" />
      </div>
      <div className="aboutSlider-mob-text-box">
        <p className="aboutSlider-mob-text">
          By participating in interactive events, answering questions and actively participating in
          the discussion of posts, you earn bonuses and points, and also increase your rating.
        </p>
        <p className="aboutSlider-mob-text">
          Become a leader among students! A high rating and participation give you the respect of
          other participants.
        </p>
      </div>
    </div>,
    <div className="aboutSlider-content">
      <h3 className="aboutSlider-mob-title aboutSlider-mob-title-slide3">
        Advantages of the platform
        <div className="aboutSlider-avatars aboutSlider-avatars-slide3">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
      </h3>
      <div className="aboutSlider-mob-img-box">
        <img src={slideMob3} alt="slideMob3" />
      </div>
      <div className="aboutSlider-mob-text-box">
        <p className="aboutSlider-mob-text">
          Convenient format, interesting content, motivation through games and tasks. Discuss topics
          with other students, find friends, learn the language in natural communication.
        </p>
      </div>
    </div>,
    <div className="aboutSlider-content">
      <h3 className="aboutSlider-mob-title aboutSlider-mob-title-slide4">
        Join today and make friends!
        <div className="aboutSlider-avatars aboutSlider-avatars-slide4">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--text-white)" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar1} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar2} alt="" />
          </div>
          <div className="aboutSlider-avatars-photo">
            <img src={avatar3} alt="" />
          </div>
        </div>
      </h3>
      <div className="aboutSlider-mob-img-box">
        <img src={slideMob4} alt="slideMob4" />
      </div>
      <div className="aboutSlider-mob-text-box">
        <p className="aboutSlider-mob-text">
          Connect with thousands of students and teachers from all over the world - learn and have
          fun together! Sign up and start learning English easily and with pleasure.
        </p>
      </div>
      <button className="aboutSlider-slide-btn" onClick={handleRegisterClick}>
        Register
      </button>
    </div>,
  ];

  const slides = isMobile ? mobileSlides : isTablet ? tabletSlides : desktopSlides;

  const slideCount = slides.length;

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX && touchEndX) {
      const deltaX = touchStartX - touchEndX;
      if (deltaX > 50) {
        handleNext();
      } else if (deltaX < -50) {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? desktopSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === desktopSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="aboutSlider"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container aboutSlider-container">
        <div className="aboutSlider-slider-wrapper">
          <div className="aboutSlider-slides">
            {isMobile ? (
              <>
                {mobileSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`aboutSlider-slide ${
                      currentSlide === index ? "aboutSlider-slide-active" : ""
                    }`}
                  >
                    {slide}
                  </div>
                ))}
              </>
            ) : isTablet ? (
              <>
                {tabletSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`aboutSlider-slide ${
                      currentSlide === index ? "aboutSlider-slide-active" : ""
                    }`}
                  >
                    {slide}
                  </div>
                ))}
              </>
            ) : (
              <>
                {desktopSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`aboutSlider-slide ${
                      currentSlide === index ? "aboutSlider-slide-active" : ""
                    }`}
                  >
                    {slide}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* <div className="aboutSlider-slider">
            <div
              className="aboutSlider-slides"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div className="aboutSlider-slide" key={index}>
                  {slide}
                </div>
              ))}
            </div>
          </div> */}

          {!(isMobile || isTablet) && (
            <>
              <button
                className="aboutSlider-prev"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                style={{
                  opacity: currentSlide === 0 ? 0.5 : 1,
                  cursor: currentSlide === 0 ? "default" : "pointer",
                }}
              >
                <MdOutlineArrowBackIos size={22} style={{ color: "var(--text-white)" }} />
              </button>
              <button
                className="aboutSlider-next"
                onClick={handleNext}
                disabled={currentSlide === slideCount - 1}
                style={{
                  opacity: currentSlide === slideCount - 1 ? 0.5 : 1,
                  cursor: currentSlide === slideCount - 1 ? "default" : "pointer",
                }}
              >
                <MdOutlineArrowForwardIos size={22} style={{ color: "var(--text-white)" }} />
              </button>
            </>
          )}

          {(isMobile || isTablet) && (
            <div className="aboutSlider-pagination">
              {Array.from({ length: slideCount }).map((_, index) => (
                <span
                  key={index}
                  className={`aboutSlider-pagination-dot ${
                    currentSlide === index ? "aboutSlider-pagination-dot-active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          )}
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

export default AboutSlider;
