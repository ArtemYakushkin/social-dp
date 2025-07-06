import React, { useState, useEffect } from "react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PiEyeClosed, PiEye } from "react-icons/pi";
import { VscError } from "react-icons/vsc";
import { IoIosClose } from "react-icons/io";

import "../styles/ModalUpdateCredentials.css";

const ModalUpdateCredentials = ({ onClose }) => {
  const user = auth.currentUser;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleUpdatePassword = async () => {
    let newErrors = {};

    if (!user || !user.email) {
      newErrors.general = "Error: User is not authenticated";
    }

    if (!oldPassword) {
      newErrors.oldPassword = "Enter your current password";
    }

    if (!newPassword) {
      newErrors.newPassword = "Please enter a new password";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm the new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "The passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Update error:", error);

      let errorMessage = {};
      if (error.code === "auth/invalid-credential") {
        errorMessage.oldPassword = "Incorrect old password";
      } else if (error.code === "auth/weak-password") {
        errorMessage.newPassword = "The password is too weak";
      } else {
        errorMessage.general = error.message;
      }

      setErrors(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal muc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-btn-close" onClick={onClose}>
          <IoIosClose size={30} color="var(--text-grey-light)" />
        </button>

        <h2 className="muc-title">Settings</h2>
        <div className="muc-content">
          <div className="muc-input-group">
            <div className="muc-input-container muc-password">
              <input
                className={`muc-input ${errors.oldPassword ? "muc-input-error" : ""}`}
                type={showOldPassword ? "text" : "password"}
                placeholder="Old password (min. 6 characters)"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <span className="muc-placeholder">Old password (min. 6 characters)</span>
              <span className="muc-pass-eye" onClick={() => setShowOldPassword(!showOldPassword)}>
                {showOldPassword ? <PiEye size={24} /> : <PiEyeClosed size={24} />}
              </span>
              <p className="muc-show-text">Show password</p>
            </div>
            {errors.oldPassword && (
              <p className="muc-error muc-error-fix">
                <span>
                  <VscError size={16} />
                </span>
                {errors.oldPassword}
              </p>
            )}
          </div>

          <div className="muc-input-group">
            <div className="muc-input-container muc-password">
              <input
                className={`muc-input ${errors.newPassword ? "muc-input-error" : ""}`}
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span className="muc-placeholder">New password</span>
              <span className="muc-pass-eye" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <PiEye size={24} /> : <PiEyeClosed size={24} />}
              </span>
              <p className="muc-show-text">Show password</p>
            </div>
            {errors.newPassword && (
              <p className="muc-error muc-error-fix">
                <span>
                  <VscError size={16} />
                </span>
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="muc-input-group">
            <div className="muc-input-container muc-password">
              <input
                className={`muc-input ${errors.confirmPassword ? "muc-input-error" : ""}`}
                type={showNewPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="muc-placeholder">Confirm new password</span>
              <span
                className="muc-pass-eye"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <PiEye size={24} /> : <PiEyeClosed size={24} />}
              </span>
              <p className="muc-show-text">Show password</p>
            </div>
            {errors.confirmPassword && (
              <p className="muc-error muc-error-fix">
                <span>
                  <VscError size={16} />
                </span>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="muc-box-btn">
          <button className="muc-btn muc-btn-cancel" onClick={onClose}>
            Cancel changes
          </button>
          <button className="muc-btn muc-btn-save" onClick={handleUpdatePassword}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateCredentials;
