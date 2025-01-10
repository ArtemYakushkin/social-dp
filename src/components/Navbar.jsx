import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import avatar from "../assets/avatar.png";
import logo from "../assets/logo.png";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiLogOut, FiUser } from "react-icons/fi";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isRegisterModalOpen || isLoginModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRegisterModalOpen, isLoginModalOpen]);

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

  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to={"/"} className="navbar-logo">
            <img src={logo} alt="logo" />
            <h2>Dear Penfriend</h2>
          </Link>
          <div className="navbar-links">
            <Link to={"/about"} className="navbar-link">
              About project
            </Link>
          </div>
          {user ? (
            <div className="navbar-user">
              <button className="navbar-btn navbar-support-user">Support us</button>
              <div className="navbar-avatar">
                <img src={user.photoURL || avatar} alt="avatar" />
              </div>
              <div className="navbar-arrow" onClick={toggleDropdown}>
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
                    <div className="navbar-dropdown-item" onClick={logout}>
                      <FiLogOut
                        style={{ color: "var(--text-grey-dark)", transform: "rotate(180deg)" }}
                        size={24}
                      />
                      <p className="navbar-dropdown-item-text">Logout</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="navbar-buttons">
              <button className="navbar-support">Support us</button>
              <button
                className="navbar-btn navbar-register"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </button>
              <button className="navbar-btn navbar-login" onClick={() => setIsLoginModalOpen(true)}>
                Sign in
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
    </div>
  );
};

export default Navbar;
