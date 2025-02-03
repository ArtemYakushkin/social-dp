import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

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

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { GoPlus } from "react-icons/go";

import "../styles/Slider.css";

const AboutSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const slides = [
    <div className="aboutSlider-slide">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--bg-white)" />
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

    <div className="aboutSlider-slide">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--bg-white)" />
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

    <div className="aboutSlider-slide">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--bg-white)" />
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

    <div className="aboutSlider-slide">
      <div className="aboutSlider-slide-textBox">
        <div className="aboutSlider-avatars">
          <div className="aboutSlider-avatars-add">
            <GoPlus size={32} color="var(--bg-white)" />
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

  const slideCount = slides.length;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  return (
    <div className="aboutSlider">
      <div className="container aboutSlider-container">
        <div className="aboutSlider-slider-container">
          <div className="aboutSlider-slider">
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
          </div>

          <button className="aboutSlider-prev" onClick={handlePrev}>
            <MdOutlineArrowBackIos size={22} style={{ color: "var(--text-white)" }} />
          </button>
          <button className="aboutSlider-next" onClick={handleNext}>
            <MdOutlineArrowForwardIos size={22} style={{ color: "var(--text-white)" }} />
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

export default AboutSlider;
