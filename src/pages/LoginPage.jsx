import React, { useState, useEffect } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase";
import Loader from "../components/Loader";

import { PiEyeClosed, PiEye } from "react-icons/pi";
import { VscError } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa";

import "../styles/LoginPage.css";

const LoginPage = ({ isVisible, onClose, openRegister, onCloseUnreg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [view, setView] = useState("login");
  // const [resetCode, setResetCode] = useState("");
  // const [newPassword, setNewPassword] = useState("");

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
      // toast.success("Login successful!");
      console.log("Login successful!");

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        sessionStorage.setItem("rememberedEmail", email);
        sessionStorage.setItem("rememberedPassword", password);
      }

      if (onClose) {
        onClose();
        onCloseUnreg();
      }
    } catch (error) {
      // toast.error("Error during login.");
      console.log("Error during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validator.isEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent!");
      setView("confirmReset");
    } catch (error) {
      toast.error("Error sending reset email.");
    }
  };

  return (
    <div className={`login ${isVisible ? "login-active" : ""}`} onClick={handleCloseModal}>
      {loading ? (
        <Loader />
      ) : view === "login" ? (
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

            <p className="login-forgot" onClick={() => setView("reset")}>
              Forgot your password?
            </p>
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
      ) : view === "reset" ? (
        <div className="login-form" onClick={(e) => e.stopPropagation()}>
          <h3 className="login-title">Reset password</h3>
          <div className="login-fields-basic">
            <div className="login-input-group">
              <div className="login-input-container">
                <input
                  className={`login-input ${errorMessage.email ? "login-input-error" : ""}`}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="login-placeholder">Enter your email</span>
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
          </div>

          <button className="login-btn login-recovery-btn" onClick={handleResetPassword}>
            Send reset email
          </button>
        </div>
      ) : (
        <div className="login-form" onClick={(e) => e.stopPropagation()}>
          <h3 className="login-title">Password recovery instructions</h3>
          <ul className="login-recovery-list">
            <li className="login-recovery-item">
              1. A link to reset your password has been sent to your email.
            </li>
            <li className="login-recovery-item">2. Follow this link and enter a new password.</li>
            <li className="login-recovery-item">
              3. Reopen the window to log into your account and enter a new password.
            </li>
            <li className="login-recovery-item">4. Voila. You are back with us.</li>
          </ul>
          <button className="login-btn login-recovery-btn" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
