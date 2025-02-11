import React from "react";

import Map from "../assets/Main_image.png";

import "../styles/Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-wrapper">
        <div className="hero-title-box">
          <h1 className="hero-title">
            Chat, <div className="hero-title-learn">learn,</div> make friends
          </h1>
          <p className="hero-text">
            Explore fascinating posts, tell your own stories and dive into conversations with your
            comments.
          </p>
          <a className="hero-btn" href="#options">
            Get started
          </a>
        </div>

        <div className="hero-image-box">
          <img className="hero-image" src={Map} alt="Hero map" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
