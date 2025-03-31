import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "../firebase";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import coverPlaceholder from "../assets/cover-img.jpg";
import avatarPlaceholder from "../assets/avatar.png";
import telegram from "../assets/telegram.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";

import "../styles/ModalProfileEdit.css";

const ModalProfileEdit = ({
  nickname,
  setNickname,
  country,
  setCountry,
  profession,
  setProfession,
  avatar,
  setAvatar,
  cover,
  setCover,
  aboutMe,
  setAboutMe,
  facebookLink,
  setFacebookLink,
  instagramLink,
  setInstagramLink,
  telegramLink,
  setTelegramLink,
  user,
  setIsModalOpen,
  isOpen,
  onClose,
}) => {
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [errors, setErrors] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const professions = ["Teacher", "Student"];
  const dropdownHeaderRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const validateLinks = () => {
    let isValid = true;
    let newErrors = {};

    const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]+/;
    const instaRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+\/?$/;
    const tgRegex = /^(https?:\/\/)?t\.me\/[a-zA-Z0-9_]+\/?$/;

    if (facebookLink && !fbRegex.test(facebookLink)) {
      newErrors.facebookLink = "Invalid Facebook URL";
      isValid = false;
    }

    if (instagramLink && !instaRegex.test(instagramLink)) {
      newErrors.instagramLink = "Invalid Instagram URL";
      isValid = false;
    }

    if (telegramLink && !tgRegex.test(telegramLink)) {
      newErrors.telegramLink = "Invalid Telegram URL";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleTelegramChange = (e) => {
    let value = e.target.value.trim();
    if (value.startsWith("@")) {
      value = `https://t.me/${value.substring(1)}`;
    }
    setTelegramLink(value);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewAvatar(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewCover(file);
      setCover(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!validateLinks()) {
      toast.error("Please correct the invalid links.");
      return;
    }

    try {
      if (user) {
        let avatarURL = avatar;
        let coverURL = cover;

        if (newAvatar) {
          const storageRef = ref(storage, `avatars/${user.uid}`);
          await uploadBytes(storageRef, newAvatar);
          avatarURL = await getDownloadURL(storageRef);
        }

        if (newCover) {
          const coverRef = ref(storage, `covers/${user.uid}`);
          await uploadBytes(coverRef, newCover);
          coverURL = await getDownloadURL(coverRef);
        }

        await updateProfile(user, { displayName: nickname, photoURL: avatarURL });

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          nickname,
          country,
          profession,
          avatar: avatarURL,
          aboutMe,
          cover: coverURL,
          facebook: facebookLink || "",
          instagram: instagramLink || "",
          telegram: telegramLink || "",
        });

        setAvatar(avatarURL);
        setCover(coverURL);
        toast.success("Profile updated successfully!");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Profile update error", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleProfessionChange = (profession) => {
    setProfession(profession);
    setShowDropdown(false);

    if (dropdownHeaderRef.current) {
      dropdownHeaderRef.current.blur();
    }
  };

  return (
    <div className="modal-overlay mpe-overlay" id="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal mpe-modal">
        <div className="mpe-scroll">
          <div className="mpe-description">
            <h2 className="mpe-title">Edit Profile</h2>
            <p className="mpe-subtitle">
              Manage your personal information to keep it accurate and up to date
            </p>
          </div>

          <div className="mpe-cover-box">
            <div className="mpe-cover-info">
              <h4 className="mpe-cover-title">Cover image</h4>
              <div className="mpe-cover-change">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="image-input"
                  id="coverInput"
                />
                <label htmlFor="coverInput" className="mpe-cover-change">
                  Change
                </label>
              </div>
            </div>
            <div className="mpe-cover-img">
              <img src={cover || coverPlaceholder} alt="Profile Cover" />
            </div>
          </div>

          <div className="mpe-main">
            <div className="mpe-avatar-box">
              <div className="mpe-avatar-info">
                <h4 className="mpe-avatar-title">Avatar</h4>
                <div className="mpe-avatar-change">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="image-input"
                    id="avatarInput"
                  />
                  <label htmlFor="avatarInput" className="mpe-avatar-change">
                    Change
                  </label>
                </div>
              </div>
              <div className="mpe-avatar-img">
                <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
              </div>
            </div>

            <div className="mpe-information-box">
              <div className="mpe-form-box">
                <h4 className="mpe-information-title">Information</h4>
                <div className="mpe-information-input-box">
                  <div className="mpe-input-container">
                    <input
                      className="mpe-input"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <span className="mpe-placeholder">Nickname</span>
                  </div>

                  <div className="mpe-input-container">
                    <input
                      className="mpe-input"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                    <span className="mpe-placeholder">Country</span>
                  </div>

                  <div className="mpe-input-container">
                    <div
                      ref={dropdownHeaderRef}
                      className="mpe-input mpe-input-dropdown"
                      tabIndex="0"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="mpe-placeholder">Your status</span>
                      <span>{profession || ""}</span>
                      <span className="mpe-input-icon">
                        {showDropdown ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
                      </span>
                    </div>
                    {showDropdown && (
                      <div className="mpe-dropdown-list">
                        {professions.map((profession) => (
                          <div
                            key={profession}
                            className="mpe-dropdown-item"
                            onClick={() => handleProfessionChange(profession)}
                          >
                            {profession}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mpe-social-box">
                <h4 className="mpe-information-title">Сontacts:</h4>
                <div className="mpe-social-content">
                  <label className="mpe-social-label">
                    <img src={telegram} alt="telegram" />
                    <p>Telegram</p>
                    <input
                      className="mpe-social-input"
                      type="text"
                      value={telegramLink}
                      onChange={handleTelegramChange}
                      placeholder="@Dear Penfriend"
                    />
                    {errors.telegramLink && (
                      <span className="mpe-social-error">{errors.telegramLink}</span>
                    )}
                  </label>

                  <label className="mpe-social-label">
                    <img src={instagram} alt="instagram" />
                    <p>Instagram</p>
                    <input
                      className="mpe-social-input"
                      type="text"
                      value={instagramLink}
                      onChange={(e) => setInstagramLink(e.target.value)}
                      placeholder="https://www.instagram.com/a..."
                    />
                    {errors.instagramLink && (
                      <span className="mpe-social-error">{errors.instagramLink}</span>
                    )}
                  </label>

                  <label className="mpe-social-label">
                    <img src={facebook} alt="facebook" />
                    <p>Facebook</p>
                    <input
                      className="mpe-social-input"
                      type="text"
                      value={facebookLink}
                      onChange={(e) => setFacebookLink(e.target.value)}
                      placeholder="https://www.facebook.com/an..."
                    />
                    {errors.facebookLink && (
                      <span className="mpe-social-error">{errors.facebookLink}</span>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mpe-about-box">
            <ReactQuill value={aboutMe} onChange={setAboutMe} theme="snow" />
          </div>

          <div className="mpe-btn-box">
            <button className="mpe-btn mpe-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel changes
            </button>
            <button className="mpe-btn mpe-btn-save" onClick={handleSave}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProfileEdit;
