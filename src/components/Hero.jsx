import React from "react";

import Map from "../assets/background_map.png";
import Point from "../assets/point.jpg";
import Girl from "../assets/girl.png";
import Boy from "../assets/boy.png";
import Woman from "../assets/woman.png";
import Usa from "../assets/usa.png";
import Canada from "../assets/canada.png";
import Uk from "../assets/uk.png";
import Ukraine from "../assets/ukrain.png";
import Australia from "../assets/australia.png";

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
          <div className="hero-points">
            <img className="hero-point hero-point-1" src={Point} alt="point" />
            <img className="hero-point hero-point-2" src={Point} alt="point" />
            <img className="hero-point hero-point-3" src={Point} alt="point" />
            <img className="hero-point hero-point-4" src={Point} alt="point" />
            <img className="hero-point hero-point-5" src={Point} alt="point" />
          </div>
          <div className="hero-person-country">
            <div className="hero-person-girl">
              <img className="hero-person-img-girl" src={Girl} alt="girl" />
              <div className="hero-chat hero-chat-1">
                <img src={Usa} alt="usa" />
                <div className="hero-lines">
                  <div className="hero-line-1"></div>
                  <div className="hero-line-2"></div>
                </div>
              </div>
            </div>
            <div className="hero-country-canada">
              <img src={Canada} alt="canada" />
            </div>
            <div className="hero-country-uk">
              <img src={Uk} alt="uk" />
            </div>
            <div className="hero-person-boy">
              <img className="hero-person-img-boy" src={Boy} alt="boy" />
              <div className="hero-chat hero-chat-2">
                <img src={Ukraine} alt="ukraine" />
                <div className="hero-lines">
                  <div className="hero-line-1"></div>
                  <div className="hero-line-2"></div>
                </div>
              </div>
            </div>
            <div className="hero-person-woman">
              <img className="hero-person-img-woman" src={Woman} alt="woman" />
              <div className="hero-chat hero-chat-3">
                <img src={Australia} alt="australia" />
                <div className="hero-lines">
                  <div className="hero-line-1"></div>
                  <div className="hero-line-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
