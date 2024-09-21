import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import validator from "validator";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      navigate("/");
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
    <div className="login">
      {loading ? (
        <Loader />
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Login</h2>
          <div className="login-group">
            <label className="login-label">
              Email
              <input
                className="login-input"
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorMessage.email && (
                <p className="login-error">{errorMessage.email}</p>
              )}
            </label>
          </div>

          <div className="login-group">
            <label className="login-label">
              Password
              <input
                className="login-input"
                type="password"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage.password && (
                <p className="login-error">{errorMessage.password}</p>
              )}
            </label>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
