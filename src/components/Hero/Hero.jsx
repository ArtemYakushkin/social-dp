import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";

import { ThemeContext } from "../../context/ThemeContext";

import Map from "../../assets/Main_image.png";
import MapTablet from "../../assets/tablet/Main_image-tablet.png";
import MapMobile from "../../assets/mobile/Main_image-mobile.png";
import MapDark from "../../assets/Main_image_dark.png";
import MapTabletDark from "../../assets/tablet/Main_image-tablet-dark.png";
import MapMobileDark from "../../assets/mobile/Main_image-mobile-dark.png";

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
    <div className="container">
      <div className="hero">
        <div className="hero-wrapper">
          <div className="hero-title-box">
            <h1 className="hero-title titleMain">
              Chat, <span>learn,</span> make friends
            </h1>
            <p className="hero-text textMain">
              Read interesting posts, write your stories, and comment.
            </p>
            <div className="hero-btn-box">
              <a className="btnMain" href="#options">
                Get started
              </a>
            </div>
          </div>

          <div className="hero-image-box">
            <img className="hero-image" src={getImage()} alt="Hero map" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
