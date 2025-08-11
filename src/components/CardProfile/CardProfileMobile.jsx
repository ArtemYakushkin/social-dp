import React from "react";
import { Link } from "react-router-dom";

import avatarPlaceholder from "../../assets/avatar.png";
import coverPlaceholder from "../../assets/cover-img.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import telegram from "../../assets/telegram.png";

import { FiSettings } from "react-icons/fi";

const CardProfileMobile = ({
  avatar,
  nickname,
  cover,
  facebookLink,
  instagramLink,
  telegramLink,
  country,
  profession,
  setIsModalOpen,
  setIsModalSetting,
  isAllowed,
}) => {
  return (
    <div className="cardMob-info">
      <div className="cardMob-avatar">
        <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
      </div>

      <div className="cardMob-settings">
        <button className="cardMob-set" onClick={() => setIsModalSetting(true)}>
          <FiSettings size={28} />
        </button>
      </div>

      <img className="cardMob-cover" src={cover || coverPlaceholder} alt="Profile Cover" />

      <div className="container cardMob-container">
        <div className="cardMob-social">
          {facebookLink && (
            <a href={facebookLink} target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="facebook" />
            </a>
          )}
          {instagramLink && (
            <a href={instagramLink} target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="instagram" />
            </a>
          )}
          {telegramLink && (
            <a href={telegramLink} target="_blank" rel="noopener noreferrer">
              <img src={telegram} alt="telegram" />
            </a>
          )}
        </div>

        <h1 className="cardMob-nickname sectionTitleMobile">{nickname}</h1>

        <div className="cardMob-line">
          <div></div>
        </div>

        <ul className="cardMob-status">
          <li className="cardMob-item">
            <p className="cardStatus">
              Country: <span className="sortItemText">{country}</span>
            </p>
          </li>
          <li className="cardMob-item">
            <p className="cardStatus">
              Status: <span className="sortItemText">{profession}</span>
            </p>
          </li>
        </ul>

        <button
          className="cardMob-edit btnModerateTransparent"
          onClick={() => setIsModalOpen(true)}
        >
          Edit profile information
        </button>
        {isAllowed && (
          <Link to="/create-post">
            <button className="cardMob-create btnModerateFill">Create a post</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CardProfileMobile;
