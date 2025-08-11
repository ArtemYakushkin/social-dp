import React from "react";

import SliderAvatar from "./SliderAvatar";

const SliderDesk = ({
  currentSlide,
  handleRegisterClick,
  avatar1,
  avatar2,
  avatar3,
  slide1,
  slide2,
  slide3,
  slide4,
  star,
}) => {
  const desktopSlides = [
    <div className="sliderDesk-content">
      <div className="sliderDesk-textBox">
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
        <h4 className="sliderDesk-title sectionTitle">What is the Dear Penfriend project?</h4>
        <p className="sliderDesk-text-indent textMain">
          Dear Penfriend is a Ukrainian platform that helps children from around the world learn
          English.
        </p>
        <p className="sliderDesk-text-indent textMain">
          You can watch educational videos and images. You can comment, chat, learn new words, and
          get replies from teachers and other students.
        </p>
        <p className="textMain">It’s a safe and fun place to learn together.</p>
      </div>
      <div className="sliderDesk-img">
        <img src={slide1} alt="slide-1" />
      </div>
    </div>,
    <div className="sliderDesk-content">
      <div className="sliderDesk-textBox">
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
        <h4 className="sliderDesk-title sectionTitle">
          Interactives and bonus system
          <span className="sliderDesk-star-box">
            <img src={star} alt="star" />
            <img src={star} alt="star" />
            <img src={star} alt="star" />
          </span>
        </h4>
        <p className="sliderDesk-text-indent textMain">
          When you take part in quizzes, answer questions, and join the chats — you get likes and
          your rating grows.
        </p>
        <p className="textMain">Be active, be kind, and become a top student!</p>
      </div>
      <div className="sliderDesk-img">
        <img src={slide2} alt="slide-2" />
      </div>
    </div>,
    <div className="sliderDesk-content">
      <div className="sliderDesk-textBox">
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
        <h4 className="sliderDesk-title sectionTitle">Advantages of the platform</h4>
        <p className="textMain">
          Easy to use, interesting videos and pictures, fun games and tasks. Discuss topics and make
          friends from other countries. Talk and learn English in real chats.
        </p>
      </div>
      <div className="sliderDesk-img">
        <img src={slide3} alt="slide-3" />
      </div>
    </div>,
    <div className="sliderDesk-content">
      <div className="sliderDesk-textBox">
        <SliderAvatar avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
        <h4 className="sliderDesk-title sectionTitle">Join today!</h4>
        <p className="textMain">
          Join thousands of students and teachers from around the world! Learn English with fun,
          talk with others, and enjoy the journey. Sign up — it’s easy to start!
        </p>
        <button className="sliderDesk-btn btnMediumFill" onClick={handleRegisterClick}>
          Register
        </button>
      </div>
      <div className="sliderDesk-img">
        <img src={slide4} alt="slide-4" />
      </div>
    </div>,
  ];

  return (
    <>
      {desktopSlides.map((slide, index) => (
        <div
          key={index}
          className={`sliderDesk-slide ${currentSlide === index ? "sliderDesk-slide-active" : ""}`}
        >
          {slide}
        </div>
      ))}
    </>
  );
};

SliderDesk.count = 4;

export default SliderDesk;
