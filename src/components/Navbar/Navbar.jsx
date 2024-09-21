import React from "react";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useAuth } from "../../auth/useAuth";
import avatar from "../../assets/avatar.png";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to={"/"} className="navbar-logo">
            <h1>
              D<span>ear</span> P<span>enfriend</span>
            </h1>
          </Link>
          <Link to={"/"} className="navbar-link">
            Home
          </Link>
          {user && (
            <Link to="/create-post" className="navbar-create-post">
              <IoIosAddCircleOutline style={{ cursor: "pointer" }} />
            </Link>
          )}
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
              <Link to={"/register"} className="navbar-register">
                Sign Up
              </Link>
              <Link to={"/login"} className="navbar-login">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
