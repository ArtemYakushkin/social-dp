import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { useAuth } from "../auth/useAuth";
import { ThemeContext } from "../context/ThemeContext";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import MobileMenu from "./MobileMenu";
import NotificationsIcon from "./NotificationsIcon";
import ModalLogout from "./ModalLogout";

import logo1 from "../assets/logo-1.svg";
import logo2 from "../assets/logo-2.svg";
import logo1mob from "../assets/mobile/logo-1-mobile.svg";
import logo2mob from "../assets/mobile/logo-2-mobile.svg";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiLogOut, FiUser } from "react-icons/fi";
import { LuSun, LuMoon } from "react-icons/lu";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    if (isRegisterModalOpen || isLoginModalOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRegisterModalOpen, isLoginModalOpen, isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to={"/"} className="navbar-logo" onClick={closeMenu}>
            {isMobile ? (
              <>
                <img className="logo-img-1" src={logo1mob} alt="logo" />
                <img className="logo-img-2" src={logo2mob} alt="logo" />
              </>
            ) : (
              <>
                <img className="logo-img-1" src={logo1} alt="logo" />
                <img className="logo-img-2" src={logo2} alt="logo" />
              </>
            )}
            <div>
              <p>Dear</p>
              <p>Penfriend</p>
            </div>
          </Link>
          <div className="navbar-links">
            <Link to={"/about"} className="navbar-link">
              About project
            </Link>
          </div>
          {user ? (
            <div className="navbar-user">
              <a
                className="navbar-btn navbar-support-user"
                href="mailto: artem.frontdeveloper@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                Support us
              </a>

              <NotificationsIcon currentUser={user} />

              <div className="navbar-avatar" onClick={() => navigate("/profile")}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" />
                ) : (
                  <div className="navbar-avatar-initial">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="navbar-arrow" onClick={toggleDropdown} ref={dropdownRef}>
                {isOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
                {isOpen && (
                  <div className="navbar-dropdown-list">
                    <div className="navbar-dropdown-nickname-box">
                      <p className="navbar-nickname">{user.displayName || "User"}</p>
                    </div>

                    <div className="navbar-dropdown-item" onClick={() => navigate("/profile")}>
                      <FiUser style={{ color: "var(--text-grey-dark)" }} size={24} />
                      <p className="navbar-dropdown-item-text">Profile</p>
                    </div>

                    <div className="navbar-dropdown-item" onClick={toggleTheme}>
                      {isDarkTheme ? (
                        <LuSun size={24} style={{ color: "var(--text-grey-dark)" }} />
                      ) : (
                        <LuMoon size={24} style={{ color: "var(--text-grey-dark)" }} />
                      )}
                      <p className="navbar-dropdown-item-text">Change theme to dark</p>
                    </div>

                    <div
                      className="navbar-dropdown-item"
                      onClick={() => setIsLogoutModalOpen(true)}
                    >
                      <FiLogOut
                        style={{ color: "var(--text-grey-dark)", transform: "rotate(180deg)" }}
                        size={24}
                      />
                      <p className="navbar-dropdown-item-text">Logout</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                className={`navbar-mobile-menu ${
                  isMobileMenuOpen ? "navbar-mobile-menu-open" : ""
                }`}
                onClick={toggleMobileMenu}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          ) : (
            <div className="navbar-buttons">
              <a
                className="navbar-support"
                href="mailto:artem.frontdeveloper@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                Support us
              </a>
              <button
                className="navbar-btn navbar-register"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </button>
              <button
                className="navbar-btn navbar-login"
                onClick={() => {
                  setIsLoginModalOpen(true);
                  closeMenu();
                }}
              >
                Sign in
              </button>

              <button
                className={`navbar-mobile-menu ${
                  isMobileMenuOpen ? "navbar-mobile-menu-open" : ""
                }`}
                onClick={toggleMobileMenu}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isRegisterModalOpen && (
        <RegisterPage
          isVisible={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          openLogin={openLogin}
        />
      )}

      {isLoginModalOpen && (
        <LoginPage
          isVisible={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          openRegister={openRegister}
        />
      )}

      {isMobileMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        user={user}
        logout={logout}
        closeMenu={closeMenu}
        onClose={() => setIsLogoutModalOpen(false)}
        openLogout={() => setIsLogoutModalOpen(true)}
        modalLogout={isLogoutModalOpen}
      />

      {isLogoutModalOpen && (
        <ModalLogout logout={logout} onClose={() => setIsLogoutModalOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;
