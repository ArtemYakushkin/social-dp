import React from 'react';
import { Link } from 'react-router-dom';

import avatarPlaceholder from '../../assets/avatar.png';
import coverPlaceholder from '../../assets/cover-img.png';
import facebook from '../../assets/facebook.png';
import instagram from '../../assets/instagram.png';
import telegram from '../../assets/telegram.png';

import { FiSettings } from 'react-icons/fi';

const CardProfileTab = ({
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
  showSettings,
}) => {
  return (
    <div className="container">
      <div className="cardTab-info">
        <div className="cardTab-avatar">
          <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
        </div>

        <img className="cardTab-cover" src={cover || coverPlaceholder} alt="Profile Cover" />

        <div className="cardTab-social">
          {(facebookLink || instagramLink || telegramLink) && (
            <p className="sortTitle">Contacts:</p>
          )}
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

        <h1 className="cardTab-nickname sectionTitle">{nickname}</h1>

        <div className="cardTab-line">
          <div></div>
        </div>

        <div className="cardTab-options">
          <ul className="cardTab-status">
            <li className="cardTab-item">
              <p className="cardStatus">
                Country: <span className="sortItemText">{country}</span>
              </p>
            </li>
            <li className="cardTab-item">
              <p className="cardStatus">
                Status: <span className="sortItemText">{profession}</span>
              </p>
            </li>
          </ul>
          {showSettings && (
            <div className="cardTab-settings">
              <button className="cardTab-set" onClick={() => setIsModalSetting(true)}>
                <FiSettings size={28} />
              </button>
            </div>
          )}
        </div>

        {showSettings && (
          <>
            <button
              className="cardTab-edit btnModerateTransparent"
              onClick={() => setIsModalOpen(true)}
            >
              Edit profile information
            </button>

            {isAllowed && (
              <Link to="/create-post">
                <button className="cardTab-create btnModerateFill">Create a post</button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CardProfileTab;
