import React, { useState, useEffect } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";
import Loader from "../components/Loader";

import { PiEyeClosed, PiEye } from "react-icons/pi";
import { VscError } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa";

import "../styles/LoginPage.css";

const LoginPage = ({ isVisible, onClose, openRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail =
      localStorage.getItem("rememberedEmail") || sessionStorage.getItem("rememberedEmail");
    const savedPassword =
      localStorage.getItem("rememberedPassword") || sessionStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  const handleCloseModal = () => {
    if (onClose) onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateFields = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    if (!validator.isEmail(email)) {
      errors.email = "Invalid email address";
    }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage({});
    if (!validateFields()) return;

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        sessionStorage.setItem("rememberedEmail", email);
        sessionStorage.setItem("rememberedPassword", password);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("User not found.");
      } else {
        toast.error("Error during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login ${isVisible ? "login-active" : ""}`} onClick={handleCloseModal}>
      {loading ? (
        <Loader />
      ) : (
        <form className="login-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <h3 className="login-title">Sign in</h3>

          <div className="login-fields-basic">
            <div className="login-input-group">
              <div className="login-input-container">
                <input
                  className={`login-input ${errorMessage.email ? "login-input-error" : ""}`}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="login-placeholder">Email</span>
              </div>
              {errorMessage.email && (
                <p className="login-error">
                  <span>
                    <VscError size={16} />
                  </span>
                  {errorMessage.email}
                </p>
              )}
            </div>

            <div className="login-input-group">
              <div className="login-input-container login-password">
                <input
                  className={`login-input ${errorMessage.password ? "login-input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="login-placeholder">Password</span>
                <span className="login-pass-eye" onClick={togglePasswordVisibility}>
                  {showPassword ? <PiEye size={24} /> : <PiEyeClosed size={24} />}
                </span>
                <p className="login-show-text">Show password</p>
              </div>
              {errorMessage.password && (
                <p className="login-error login-error-fix">
                  <span>
                    <VscError size={16} />
                  </span>
                  {errorMessage.password}
                </p>
              )}
            </div>
          </div>

          <div className="login-remember">
            <input
              className="login-input-remember"
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="login-custom-checkbox" htmlFor="rememberMe">
              <div className="login-checkbox-icon">
                <FaCheck size={16} className="login-custom-icon" />
              </div>
              Remember me
            </label>
          </div>

          <button className="login-btn" type="submit">
            Sign in
          </button>

          <div className="login-link-box">
            <p className="login-link-text">Don't have an account yet?</p>
            <p className="login-link" onClick={openRegister}>
              Register
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
