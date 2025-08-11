import React from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";
import BtnMobMenu from "./BtnMobMenu";

const NavbarGuest = ({
  closeMenu,
  setIsRegisterModalOpen,
  setIsLoginModalOpen,
  logo1,
  logo2,
  logo1mob,
  logo2mob,
  isMobileMenuOpen,
  toggleMobileMenu,
}) => {
  return (
    <div className="guest">
      <div className="guest-nav">
        <Logo
          closeMenu={closeMenu}
          logo1={logo1}
          logo2={logo2}
          logo1mob={logo1mob}
          logo2mob={logo2mob}
        />
        <Link to={"/about"} className="guest-link navbarLink">
          About project
        </Link>
      </div>
      <div className="guest-buttons">
        {/* <a
          className="guest-support navbarLink"
          href="mailto:artem.frontdeveloper@gmail.com"
          target="_blank"
          rel="noreferrer"
        >
          Support us
        </a> */}
        <button
          className="guest-none btnModerateTransparent"
          onClick={() => setIsRegisterModalOpen(true)}
        >
          Register
        </button>
        <button
          className="btnModerateFill"
          onClick={() => {
            setIsLoginModalOpen(true);
            closeMenu();
          }}
        >
          Sign in
        </button>
        <BtnMobMenu isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      </div>
    </div>
  );
};

export default NavbarGuest;
