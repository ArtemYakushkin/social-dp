import React from "react";

const BtnMobMenu = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <button
      className={`burger-menu ${isMobileMenuOpen ? "burger-menu-open" : ""}`}
      onClick={toggleMobileMenu}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default BtnMobMenu;
