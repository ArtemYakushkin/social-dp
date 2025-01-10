import React, { useState } from "react";

import girl from "../assets/america-girl.png";
import boy from "../assets/ukraine-boy.png";
import woman from "../assets/australia-woman.png";
import canada from "../assets/canada.png";
import uk from "../assets/uk.png";
import point from "../assets/point.jpg";
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import star from "../assets/stars.png";
import scrin from "../assets/slide-5-scrin.png";

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { GoArrowRight, GoPlus } from "react-icons/go";

import "../styles/Slider.css";

const AboutSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <div className="aboutSlider-slide1">
      <div className="aboutSlider-slide1-textBox">
        <h4>What is this Dear Penfriend project?</h4>
        <p>
          This is a social network born in Ukraine for communication and learning English with
          people from all over the world.
        </p>
        <div className="aboutSlider-slide1-arrowBox">
          <GoArrowRight size={40} color="var(--text-grey-dark)" />
        </div>
      </div>

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

      <img className="aboutSlider-slide1-girl" src={girl} alt="" />
      <img className="aboutSlider-slide1-boy" src={boy} alt="" />
      <img className="aboutSlider-slide1-woman" src={woman} alt="" />
      <img className="aboutSlider-slide1-canada" src={canada} alt="" />
      <img className="aboutSlider-slide1-uk" src={uk} alt="" />
      <img className="aboutSlider-slide1-point1" src={point} alt="" />
      <img className="aboutSlider-slide1-point2" src={point} alt="" />
      <img className="aboutSlider-slide1-point3" src={point} alt="" />
      <img className="aboutSlider-slide1-point4" src={point} alt="" />
      <img className="aboutSlider-slide1-point5" src={point} alt="" />
    </div>,

    <div className="aboutSlider-slide2">
      <div className="aboutSlider-slide2-textBox">
        <h4>Let's learn and have fun together!</h4>
        <p>
          English teachers post educational videos and photos, in the comments to which you can
          communicate, learn and receive feedback from teachers and other students.
          <br /> The interactive tasks that the authors accompany their posts with help you not to
          get bored and get used to real, living English.
        </p>
      </div>

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
    </div>,

    <div className="aboutSlider-slide3">
      <div className="aboutSlider-slide3-textBox">
        <div>
          <h4>Interactives and bonus system</h4>
          <span>
            <img src={star} alt="" />
            <img src={star} alt="" />
            <img src={star} alt="" />
          </span>
        </div>
        <p>
          By participating in interactive events, answering questions and actively participating in
          the discussion of posts, you earn bonuses and points, and also increase your rating.
          Become a leader among students! A high rating and participation give you the respect of
          other participants.
        </p>
      </div>

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
    </div>,

    <div className="aboutSlider-slide4">
      <div className="aboutSlider-slide4-textBox">
        <h4>Advantages of the platform</h4>
        <p>
          Convenient format, interesting content, motivation through games and tasks. Discuss topics
          with other students, find friends, learn the language in natural communication.
        </p>
      </div>

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
    </div>,

    <div className="aboutSlider-slide5">
      <img className="aboutSlider-slide5-scrin" src={scrin} alt="" />

      <div className="aboutSlider-slide5-textBox">
        <h4>Join today!</h4>
        <p>
          Connect with thousands of students and teachers from all over the world - learn and have
          fun together! Sign up and start learning English easily and with pleasure.
        </p>
      </div>

      <button className="aboutSlider-slide5-btn">Get started</button>
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

          <div className="aboutSlider-navigation">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`aboutSlider-nav-dot ${
                  currentSlide === index ? "aboutSlider-nav-active" : ""
                }`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>
        <div className="aboutSlider-top-title">
          <h2 className="aboutSlider-top-title-d">D</h2>
          <h2 className="aboutSlider-top-title-ear">EAR</h2>
        </div>
        <div className="aboutSlider-bottom-title">
          <h2 className="aboutSlider-bottom-title-penfrien">PENFRIEN</h2>
          <h2 className="aboutSlider-bottom-title-d">D</h2>
        </div>
      </div>
    </div>
  );
};

export default AboutSlider;
