import React from 'react';
import { Link } from 'react-router-dom';

import avatarPlaceholder from '../../assets/avatar.png';
import coverPlaceholder from '../../assets/cover-img.png';
import facebook from '../../assets/facebook.png';
import instagram from '../../assets/instagram.png';
import telegram from '../../assets/telegram.png';

import { FiSettings } from 'react-icons/fi';

const CardProfileDesk = ({
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
    <div className="cardDesk-container">
      <div className="cardDesk-info">
        <div className="cardDesk-avatar">
          <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
        </div>

        <img className="cardDesk-cover" src={cover || coverPlaceholder} alt="Profile Cover" />

        <div className="cardDesk-personal">
          <h1 className="sectionTitle">{nickname}</h1>
          <div className="cardDesk-social">
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
        </div>

        <div className="cardDesk-line">
          <div></div>
        </div>

        <div className="cardDesk-options">
          <ul className="cardDesk-status">
            <li className="cardDesk-item">
              <p className="cardStatus">
                Country: <span className="sortItemText">{country}</span>
              </p>
            </li>
            <li className="cardDesk-item">
              <p className="cardStatus">
                Status: <span className="sortItemText">{profession}</span>
              </p>
            </li>
          </ul>

          {showSettings && (
            <div className="cardDesk-settings">
              <button className="btnModerateTransparent" onClick={() => setIsModalOpen(true)}>
                Edit profile information
              </button>
              {isAllowed && (
                <Link to="/create-post">
                  <button className="btnModerateFill">Create a post</button>
                </Link>
              )}
              <button className="cardDesk-set" onClick={() => setIsModalSetting(true)}>
                <FiSettings size={28} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProfileDesk;
