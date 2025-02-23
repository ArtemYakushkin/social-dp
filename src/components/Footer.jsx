import React from "react";
import { Link } from "react-router-dom";

import logoFooter from "../assets/logo-footer.png";

// import { FaInstagram } from "react-icons/fa";
// import { SlSocialFacebook } from "react-icons/sl";
import { GoDotFill } from "react-icons/go";

import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-top-wrapp">
            <Link to={"/"} className="footer-logo">
              <img src={logoFooter} alt="logo" />
            </Link>
            <Link to={"/about"} className="footer-top-link">
              About project
            </Link>
            <Link to={"/"} className="footer-top-policy">
              Privacy Policy
            </Link>
            {/* <div className="footer-top-social-box">
              <FaInstagram size={24} style={{ color: "var(--text-white)", cursor: "pointer" }} />
              <SlSocialFacebook
                size={24}
                style={{ color: "var(--text-white)", cursor: "pointer" }}
              />
            </div> */}
          </div>
        </div>
      </div>

      <div className="footer-center">
        <div className="container">
          <div className="footer-center-wrap">
            <h4 className="footer-center-title">The project was made by:</h4>
            <div className="footer-center-text">
              <p>
                Аuthor of the project{" "}
                <a
                  href="https://www.instagram.com/start_english_today?igsh=MTdxdGJsZnQ1YWNxbQ=="
                  target="_blank"
                  rel="noreferrer"
                >
                  Anna Yakushkina
                </a>
              </p>
              <GoDotFill size={12} style={{ color: "var(--text-black)" }} />
              <p>
                Site developer{" "}
                <a href="https://artem-yakushkin.netlify.app" target="_blank" rel="noreferrer">
                  Artem Yakushkin
                </a>
              </p>
              <GoDotFill size={12} style={{ color: "var(--text-black)" }} />
              <p>
                Website designer{" "}
                <a
                  href="https://anastasiiahorbatenko.weblium.site/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Anastasia Horbatenko
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-bottom-text">Dear Penfriend © 2024. All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
