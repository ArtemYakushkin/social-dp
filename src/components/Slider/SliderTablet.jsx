import React from "react";

import SliderAvatar from "./SliderAvatar";

const SliderTablet = ({ currentSlide, handleRegisterClick, avatar1, avatar2, avatar3, stars }) => {
  const tabletSlides = [
    <div className="SliderTab-content">
      <h3 className="SliderTab-title sectionTitle">What is the Dear Penfriend project?</h3>
      <div className="SliderTab-wrapper SliderTab-wrapper-slide1">
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
        <div className="SliderTab-text-box">
          <p className="sliderText">
            Dear Penfriend is a Ukrainian platform that helps children from around the world learn
            English.
          </p>
          <p className="sliderText">
            You can watch educational videos and images. You can comment, chat, learn new words, and
            get replies from teachers and other students.
          </p>
          <p className="sliderText">It’s a safe and fun place to learn together.</p>
        </div>
      </div>
    </div>,
    <div className="SliderTab-content">
      <div className="SliderTab-title-box">
        <h3 className="SliderTab-title SliderTab-title-slide2 sectionTitle">
          Interactives and bonus system
        </h3>
        <img className="SliderTab-img" src={stars} alt="stars" />
      </div>
      <div className="SliderTab-wrapper SliderTab-wrapper-slide2">
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
        <div className="SliderTab-text-box">
          <p className="sliderText">
            When you take part in quizzes, answer questions, and join the chats — you get likes and
            your rating grows.
          </p>
          <p className="sliderText">Be active, be kind, and become a top student!</p>
        </div>
      </div>
    </div>,
    <div className="SliderTab-content">
      <h3 className="SliderTab-title sectionTitle">Advantages of the platform</h3>
      <div className="SliderTab-wrapper SliderTab-wrapper-slide3">
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
        <div className="SliderTab-text-box">
          <p className="sliderText">
            Easy to use, interesting videos and pictures, fun games and tasks. Discuss topics and
            make friends from other countries. Talk and learn English in real chats.
          </p>
        </div>
      </div>
    </div>,
    <div className="SliderTab-content">
      <h3 className="SliderTab-title sectionTitle">Join today and make friends!</h3>
      <div className="SliderTab-wrapper SliderTab-wrapper-slide4">
        <button className="SliderTab-btn btnHighFill" onClick={handleRegisterClick}>
          Register
        </button>
        <div className="SliderTab-text-box">
          <p className="sliderText">
            Join thousands of students and teachers from around the world! Learn English with fun,
            talk with others, and enjoy the journey. Sign up — it’s easy to start!
          </p>
        </div>
      </div>
    </div>,
  ];

  return (
    <>
      {tabletSlides.map((slide, index) => (
        <div
          key={index}
          className={`SliderTab-slide ${currentSlide === index ? "SliderTab-slide-active" : ""}`}
        >
          {slide}
        </div>
      ))}
    </>
  );
};

SliderTablet.count = 4;

export default SliderTablet;
