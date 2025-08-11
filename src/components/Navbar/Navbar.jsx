import React, { useState, useEffect } from "react";

import { useAuth } from "../../auth/useAuth";

import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import MobileMenu from "../MobileMenu";
import ModalLogout from "../ModalLogout";
import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";

import logo1 from "../../assets/logo-1.svg";
import logo2 from "../../assets/logo-2.svg";
import logo1mob from "../../assets/mobile/logo-1-mobile.svg";
import logo2mob from "../../assets/mobile/logo-2-mobile.svg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="navbar">
      <div className="container">
        {user ? (
          <NavbarUser
            user={user}
            setIsLogoutModalOpen={setIsLogoutModalOpen}
            closeMenu={closeMenu}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            logo1={logo1}
            logo2={logo2}
            logo1mob={logo1mob}
            logo2mob={logo2mob}
          />
        ) : (
          <NavbarGuest
            closeMenu={closeMenu}
            setIsRegisterModalOpen={setIsRegisterModalOpen}
            setIsLoginModalOpen={setIsLoginModalOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            logo1={logo1}
            logo2={logo2}
            logo1mob={logo1mob}
            logo2mob={logo2mob}
          />
        )}
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
