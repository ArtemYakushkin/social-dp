import React from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const Logo = ({ closeMenu, logo1, logo2, logo1mob, logo2mob }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <Link to={"/"} className="logo" onClick={closeMenu}>
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
  );
};

export default Logo;
