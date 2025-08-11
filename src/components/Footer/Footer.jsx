import React from "react";
import { Link } from "react-router-dom";

import logo1 from "../../assets/logo-1.svg";
import logo2 from "../../assets/logo-2.svg";

import { GoDotFill } from "react-icons/go";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-top-wrapp">
            <div className="footer-top-nav">
              <Link to={"/"} className="footer-logo">
                <img className="logo-img-1" src={logo1} alt="logo" />
                <img className="logo-img-2" src={logo2} alt="logo" />
                <div>
                  <p>Dear</p>
                  <p>Penfriend</p>
                </div>
              </Link>
              <Link to={"/about"} className="footer-top-link linkFooter">
                About project
              </Link>
            </div>

            <div className="footer-top-social-box">
              <a
                className="policyFooter"
                href="mailto: artem.frontdeveloper@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                Help
              </a>
              <Link to={"/privacy"} className="footer-top-policy policyFooter">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-center">
        <div className="container">
          <div className="footer-center-wrap">
            <h4 className="footer-center-title titleFooter">The project was made by:</h4>
            <div className="footer-center-text">
              <div className="footer-center-block-text">
                <GoDotFill size={10} style={{ color: "var(--text-black)" }} />
                <div className="footer-center-author">
                  <p className="jobFooter">Project author</p>
                  <a
                    className="footer-center-name jobFooter"
                    href="https://a-teacher.netlify.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Anna Yakushkina
                  </a>
                </div>
              </div>

              <div className="footer-center-block-text">
                <GoDotFill size={10} style={{ color: "var(--text-black)" }} />
                <div className="footer-center-author">
                  <p className="jobFooter">Site developer</p>
                  <a
                    className="footer-center-name jobFooter"
                    href="https://artem-yakushkin.netlify.app"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Artem Yakushkin
                  </a>
                </div>
              </div>

              <div className="footer-center-block-text">
                <GoDotFill size={10} style={{ color: "var(--text-black)" }} />
                <div className="footer-center-author">
                  <p className="jobFooter">Website designer</p>
                  <a
                    className="footer-center-name jobFooter"
                    href="https://anastasiiahorbatenko.weblium.site/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Anastasia Horbatenko
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-bottom-text jobFooter">Dear Penfriend © 2024. All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
