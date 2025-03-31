import React from "react";

import instagram from "../assets/instagram.png";
import telegram from "../assets/telegram.png";
import whatsapp from "../assets/whatsapp.png";
import linkedin from "../assets/linkedin.png";
import Anna from "../assets/Anna.png";
import Artem from "../assets/Artem.png";
import Nastya from "../assets/Nastya.png";

import "../styles/OurTeam.css";

const OurTeam = () => {
  return (
    <div className="team">
      <div className="container">
        <div className="team-wrapp">
          <div className="team-left">
            <h2 className="team-title">Our team</h2>
            <p className="team-text">
              Meet those who put their heart, soul and countless cups of coffee into creating this
              project:)
            </p>
          </div>

          <div className="team-right">
            <div className="team-item team-item-anna-height">
              <div className="team-item-anna">
                <img src={Anna} alt="Anna" />
              </div>
              <h4 className="team-name">Anna Yakushkina</h4>
              <p className="team-description">
                Author of the project, a wonderful teacher of English, methodologist. Creator of
                posts for users of the Dear Penfriend website.
              </p>
              <div className="team-contacts">
                <p className="team-cont">Contacts:</p>
                <a
                  className="team-link"
                  href="https://www.linkedin.com/in/anna-yakushkina-3011202a9"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="" />
                </a>
                <a
                  className="team-link"
                  href="https://www.instagram.com/start_english_today?igsh=MTdxdGJsZnQ1YWNxbQ=="
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={instagram} alt="" />
                </a>
                <a
                  className="team-link"
                  href="tg://resolve?domain=AnnaYakushkina"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={telegram} alt="" />
                </a>
              </div>
            </div>

            <div className="team-item team-item-artem-height">
              <div className="team-item-artem">
                <img src={Artem} alt="Artem" />
              </div>
              <h4 className="team-name">Artem Yakushkin</h4>
              <p className="team-description">
                Site developer. Analysis, development of website functionality, layout, programming.
              </p>
              <div className="team-contacts">
                <p className="team-cont">Contacts:</p>
                <a
                  className="team-link"
                  href="https://www.linkedin.com/in/artem-yakushkin-a86722229/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="" />
                </a>
                <a
                  className="team-link"
                  href="https://www.instagram.com/yakushkin_artem_/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={instagram} alt="" />
                </a>
                <a
                  className="team-link"
                  href="tg://resolve?domain=ArtemYakushkin"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={telegram} alt="" />
                </a>
              </div>
            </div>

            <div className="team-item team-item-nastya-height">
              <div className="team-item-nastya">
                <img src={Nastya} alt="Nastya" />
              </div>
              <h4 className="team-name">Anastasia Horbatenko</h4>
              <p className="team-description">
                UI/UX designer. Analysis, development of concept, design and functionality of the
                site.
              </p>
              <div className="team-contacts">
                <p className="team-cont">Contacts:</p>
                <a
                  className="team-link"
                  href="https://linkedin.com/in/anastasiia-horbatenko-designer/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="" />
                </a>
                <a
                  className="team-link"
                  href="tg://resolve?domain=StasiaGor"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={telegram} alt="" />
                </a>
                <a
                  className="team-link"
                  href="https://wa.me/+380663611504"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={whatsapp} alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
