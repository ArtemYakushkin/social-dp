import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";

import { ThemeContext } from "../context/ThemeContext";

import Map from "../assets/Main_image.png";
import MapTablet from "../assets/tablet/Main_image-tablet.png";
import MapMobile from "../assets/mobile/Main_image-mobile.png";
import MapDark from "../assets/Main_image_dark.png";
import MapTabletDark from "../assets/tablet/Main_image-tablet-dark.png";
import MapMobileDark from "../assets/mobile/Main_image-mobile-dark.png";

import "../styles/Hero.css";

const Hero = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });
  const { theme } = useContext(ThemeContext);

  const getImage = () => {
    if (theme === "dark") {
      if (isMobile) return MapMobileDark;
      if (isTablet) return MapTabletDark;
      return MapDark;
    } else {
      if (isMobile) return MapMobile;
      if (isTablet) return MapTablet;
      return Map;
    }
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
            comments
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
