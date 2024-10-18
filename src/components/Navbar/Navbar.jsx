import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../../auth/useAuth";
import RegisterPage from "../../pages/RegisterPage/RegisterPage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import avatar from "../../assets/avatar.png";
import logo from "../../assets/logo.png";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Эффект для управления блокировкой прокрутки страницы при открытом модальном окне
  useEffect(() => {
    if (isRegisterModalOpen || isLoginModalOpen) {
      document.body.style.overflow = "hidden"; // Отключить прокрутку страницы
    } else {
      document.body.style.overflow = ""; // Вернуть стандартное значение
    }

    // Возврат стандартного состояния при размонтировании компонента
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

  // <p className="navbar-nickname">{user.displayName || "User"}</p>;
  // <IoLogOutOutline className="navbar-logout" onClick={logout} />;

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
              <button className="navbar-support-user">Support us</button>
              <Link to={"/profile"} className="navbar-avatar">
                <img src={user.photoURL || avatar} alt="avatar" />
              </Link>
              <div className="navbar-arrow">
                <ArrowDown />
              </div>
            </div>
          ) : (
            <div className="navbar-buttons">
              <button className="navbar-support">Support us</button>
              <button
                className="navbar-register"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </button>
              <button
                className="navbar-login"
                onClick={() => setIsLoginModalOpen(true)}
              >
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
