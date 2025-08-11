import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import Logo from "./Logo";
import NotificationsIcon from "../NotificationsIcon";
import BtnMobMenu from "./BtnMobMenu";

import { ThemeContext } from "../../context/ThemeContext";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiLogOut, FiUser } from "react-icons/fi";
import { LuSun, LuMoon } from "react-icons/lu";

const NavbarUser = ({
  user,
  setIsLogoutModalOpen,
  closeMenu,
  isMobileMenuOpen,
  toggleMobileMenu,
  logo1,
  logo2,
  logo1mob,
  logo2mob,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user">
      <div className="user-nav">
        <Logo
          closeMenu={closeMenu}
          logo1={logo1}
          logo2={logo2}
          logo1mob={logo1mob}
          logo2mob={logo2mob}
        />

        <Link to={"/about"} className="user-link navbarLink">
          About project
        </Link>
      </div>

      <div className="user-options">
        {/* <a
          className="user-support btnModerateTransparent"
          href="mailto: artem.frontdeveloper@gmail.com"
          target="_blank"
          rel="noreferrer"
        >
          Support us
        </a> */}

        <NotificationsIcon currentUser={user} />

        <div className="user-avatar avatarBig" onClick={() => navigate("/profile")}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" />
          ) : (
            <div className="user-avatar-initial">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        <div className="user-arrow" onClick={toggleDropdown} ref={dropdownRef}>
          {isOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
          {isOpen && (
            <div className="user-dropdown">
              <div className="user-nickname-box">
                <p className="user-nickname letterNick">{user.displayName || "User"}</p>
              </div>

              <div className="user-item" onClick={() => navigate("/profile")}>
                <FiUser style={{ color: "var(--text-grey-dark)" }} size={24} />
                <p className="dropText">Profile</p>
              </div>

              <div className="user-item" onClick={toggleTheme}>
                {isDarkTheme ? (
                  <LuSun size={24} style={{ color: "var(--text-grey-dark)" }} />
                ) : (
                  <LuMoon size={24} style={{ color: "var(--text-grey-dark)" }} />
                )}
                <p className="dropText">Change theme to dark</p>
              </div>

              <div className="user-item" onClick={() => setIsLogoutModalOpen(true)}>
                <FiLogOut
                  style={{ color: "var(--text-grey-dark)", transform: "rotate(180deg)" }}
                  size={24}
                />
                <p className="dropText">Logout</p>
              </div>
            </div>
          )}
        </div>

        <BtnMobMenu isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      </div>
    </div>
  );
};

export default NavbarUser;
