import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../../auth/useAuth";
import RegisterPage from "../../pages/RegisterPage/RegisterPage";
import avatar from "../../assets/avatar.png";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
              About
            </Link>
            {user && (
              <Link to="/create-post" className="navbar-link">
                Add post
              </Link>
            )}
          </div>
          {user ? (
            <div className="navbar-user">
              <Link to={"/profile"} className="navbar-info">
                <p className="navbar-nickname">{user.displayName || "User"}</p>
                <img
                  className="navbar-avatar"
                  src={user.photoURL || avatar}
                  alt="avatar"
                />
              </Link>
              <IoLogOutOutline className="navbar-logout" onClick={logout} />
            </div>
          ) : (
            <div className="navbar-buttons">
              <button
                className="navbar-register"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </button>
              <button className="navbar-login">Sign in</button>
            </div>
          )}
        </div>
      </div>

      {isRegisterModalOpen && (
        <RegisterPage onClose={() => setIsRegisterModalOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;
