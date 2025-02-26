import React from "react";
import { useMediaQuery } from "react-responsive";

import Map from "../assets/Main_image.png";
import MapTablet from "../assets/tablet/Main_image-tablet.png";
import MapMobile from "../assets/mobile/Main_image-mobile.png";

import "../styles/Hero.css";

const Hero = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  const getImage = () => {
    if (isMobile) return MapMobile;
    if (isTablet) return MapTablet;
    return Map;
  };

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
          <div className="hero-btn-box">
            <a className="hero-btn" href="#options">
              Get started
            </a>
          </div>
        </div>

        <div className="hero-image-box">
          <img className="hero-image" src={getImage()} alt="Hero map" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
