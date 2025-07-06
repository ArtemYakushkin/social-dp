import React from "react";
import { Link } from "react-router-dom";

import { MdOutlineRocketLaunch } from "react-icons/md";
import { RiHandHeartLine } from "react-icons/ri";
import { FiLogOut, FiUser } from "react-icons/fi";

import ModalLogout from "./ModalLogout";

import "../styles/MobileMenu.css";

const MobileMenu = ({ isOpen, user, closeMenu, openLogout, modalLogout }) => {
  const handleExit = () => {
    closeMenu();
    openLogout();
  };

  return (
    <div className={`mobile-menu ${isOpen ? "mobile-menu-open" : ""}`}>
      {user ? (
        <div className="mobile-menu-user">
          <div className="mobile-menu-box-nickname">
            <h4 className="mobile-menu-nickname">{user.displayName || "User"}</h4>
          </div>
          <ul className="mobile-menu-list">
            <li className="mobile-menu-item">
              <Link to={"/about"} className="mobile-menu-link" onClick={closeMenu}>
                <MdOutlineRocketLaunch size={24} />
                <p>About project</p>
              </Link>
            </li>
            <li className="mobile-menu-item">
              <a
                className="mobile-menu-link"
                href="mailto:artem.frontdeveloper@gmail.com"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                <RiHandHeartLine size={24} />
                <p>Support us</p>
              </a>
            </li>
            <li className="mobile-menu-item">
              <Link to={"/profile"} className="mobile-menu-link" onClick={closeMenu}>
                <FiUser size={24} />
                <p>Profile</p>
              </Link>
            </li>
            <li className="mobile-menu-item">
              <Link className="mobile-menu-link" onClick={handleExit}>
                <FiLogOut size={24} style={{ transform: "rotate(180deg)" }} />
                <p>Logout</p>
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="mobile-menu-user">
          <ul className="mobile-menu-list">
            <li className="mobile-menu-item">
              <Link to={"/about"} className="mobile-menu-link" onClick={closeMenu}>
                <MdOutlineRocketLaunch size={24} />
                <p>About project</p>
              </Link>
            </li>
            <li className="mobile-menu-item">
              <a
                className="mobile-menu-link"
                href="mailto:artem.frontdeveloper@gmail.com"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                <RiHandHeartLine size={24} />
                <p>Support us</p>
              </a>
            </li>
          </ul>
        </div>
      )}

      {modalLogout && <ModalLogout />}
    </div>
  );
};

export default MobileMenu;
