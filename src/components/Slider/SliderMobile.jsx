import React from "react";

import SliderAvatar from "./SliderAvatar";

const SliderMobile = ({
  currentSlide,
  handleRegisterClick,
  avatar1,
  avatar2,
  avatar3,
  slideMob1,
  slideMob2,
  slideMob3,
  slideMob4,
  starsMobile,
}) => {
  const mobileSlides = [
    <div className="SliderMob-content">
      <h3 className="SliderMob-title SliderMob-title-slide1 SliderTitleMob">
        What is the
        <br /> Dear Penfriend project?
        <SliderAvatar
          avatar1={avatar1}
          avatar2={avatar2}
          avatar3={avatar3}
          currentSlide={currentSlide}
        />
      </h3>
      <div className="SliderMob-img-box">
        <img src={slideMob1} alt="slideMob1" />
      </div>
      <div className="SliderMob-text-box">
        <p className="sliderTextMob">
          Dear Penfriend is a Ukrainian platform that helps children from around the world learn
          English.
        </p>
        <p className="sliderTextMob">
          You can watch educational videos and images. You can comment, chat, learn new words, and
          get replies from teachers and other students.
        </p>
        <p className="sliderTextMob">It’s a safe and fun place to learn together.</p>
      </div>
    </div>,
    <div className="SliderMob-content">
      <h3 className="SliderMob-title SliderMob-title-slide2 SliderTitleMob">
        Interactives and bonus system
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
      </h3>
      <div className="SliderMob-img-box">
        <img src={slideMob2} alt="slideMob1" />
        <img className="SliderMob-img" src={starsMobile} alt="stars" />
      </div>
      <div className="SliderMob-text-box">
        <p className="sliderTextMob">
          When you take part in quizzes, answer questions, and join the chats — you get likes and
          your rating grows.
        </p>
        <p className="sliderTextMob">Be active, be kind, and become a top student!</p>
      </div>
    </div>,
    <div className="SliderMob-content">
      <h3 className="SliderMob-title SliderMob-title-slide3 SliderTitleMob">
        Advantages of the platform
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
      </h3>
      <div className="SliderMob-img-box">
        <img src={slideMob3} alt="slideMob3" />
      </div>
      <div className="SliderMob-text-box">
        <p className="sliderTextMob">
          Easy to use, interesting videos and pictures, fun games and tasks. Discuss topics and make
          friends from other countries. Talk and learn English in real chats.
        </p>
      </div>
    </div>,
    <div className="SliderMob-content">
      <h3 className="SliderMob-title SliderMob-title-slide4 SliderTitleMob">
        Join today and make friends!
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
      </h3>
      <div className="SliderMob-img-box">
        <img src={slideMob4} alt="slideMob4" />
      </div>
      <div className="aboutSlider-mob-text-box">
        <p className="sliderTextMob">
          Join thousands of students and teachers from around the world! Learn English with fun,
          talk with others, and enjoy the journey. Sign up — it’s easy to start!
        </p>
      </div>
      <button className="SliderMob-btn btnBigFill" onClick={handleRegisterClick}>
        Register
      </button>
    </div>,
  ];

  return (
    <>
      {mobileSlides.map((slide, index) => (
        <div
          key={index}
          className={`SliderMob-slide ${currentSlide === index ? "SliderMob-slide-active" : ""}`}
        >
          {slide}
        </div>
      ))}
    </>
  );
};

SliderMobile.count = 4;

export default SliderMobile;
