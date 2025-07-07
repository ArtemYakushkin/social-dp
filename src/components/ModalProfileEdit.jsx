import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "../firebase";

import { IoIosArrowDown, IoIosArrowUp, IoIosClose } from "react-icons/io";

import coverPlaceholder from "../assets/cover-img.png";
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
  const [tempNickname, setTempNickname] = useState("");
  const [tempCountry, setTempCountry] = useState("");
  const [tempProfession, setTempProfession] = useState("");
  const [tempAvatar, setTempAvatar] = useState(avatar);
  const [tempCover, setTempCover] = useState(cover);
  const [tempAboutMe, setTempAboutMe] = useState("");
  const [tempFacebookLink, setTempFacebookLink] = useState("");
  const [tempInstagramLink, setTempInstagramLink] = useState("");
  const [tempTelegramLink, setTempTelegramLink] = useState("");

  const [newAvatar, setNewAvatar] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [errors, setErrors] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const professions = ["Teacher", "Student"];
  const dropdownHeaderRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      setTempNickname(nickname);
      setTempCountry(country);
      setTempProfession(profession);
      setTempAvatar(avatar);
      setTempCover(cover);
      setTempAboutMe(aboutMe);
      setTempFacebookLink(facebookLink);
      setTempInstagramLink(instagramLink);
      setTempTelegramLink(telegramLink);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    isOpen,
    nickname,
    country,
    profession,
    avatar,
    cover,
    aboutMe,
    facebookLink,
    instagramLink,
    telegramLink,
  ]);

  if (!isOpen) return null;

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]+/;
    const instaRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+\/?$/;
    const tgRegex = /^(https?:\/\/)?t\.me\/[a-zA-Z0-9_]+\/?$/;
    const englishRegex = /^[\x20-\x7E]*$/;

    if (!englishRegex.test(tempNickname)) {
      newErrors.nickname = "Nickname must contain only English letters.";
      isValid = false;
    }

    if (!englishRegex.test(tempCountry)) {
      newErrors.country = "Country must contain only English letters.";
      isValid = false;
    }

    const plainTextAboutMe = tempAboutMe.replace(/<[^>]*>?/gm, "");
    if (!englishRegex.test(plainTextAboutMe)) {
      newErrors.aboutMe = "About Me must contain only English text, numbers, and symbols.";
      isValid = false;
    }

    if (tempFacebookLink && !fbRegex.test(tempFacebookLink)) {
      newErrors.facebookLink = "Invalid Facebook URL";
      isValid = false;
    }

    if (tempInstagramLink && !instaRegex.test(tempInstagramLink)) {
      newErrors.instagramLink = "Invalid Instagram URL";
      isValid = false;
    }

    if (tempTelegramLink && !tgRegex.test(tempTelegramLink)) {
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
    setTempTelegramLink(value);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewAvatar(file);
      setTempAvatar(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewCover(file);
      setTempCover(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      if (user) {
        let avatarURL = avatar; // из пропсов — URL из Firebase или placeholder
        let coverURL = cover; // из пропсов — URL из Firebase или placeholder

        // Загружаем новую аватарку, если выбрана
        if (newAvatar) {
          const avatarRef = ref(storage, `avatars/${user.uid}`);
          await uploadBytes(avatarRef, newAvatar);
          avatarURL = await getDownloadURL(avatarRef);
        }

        // Загружаем новую обложку, если выбрана
        if (newCover) {
          const coverRef = ref(storage, `covers/${user.uid}`);
          await uploadBytes(coverRef, newCover);
          coverURL = await getDownloadURL(coverRef);
        }

        // Обновляем только displayName и photoURL, если действительно новая аватарка
        if (newAvatar) {
          await updateProfile(user, {
            displayName: tempNickname,
            photoURL: avatarURL,
          });
        } else {
          await updateProfile(user, {
            displayName: tempNickname,
          });
        }

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          nickname: tempNickname,
          country: tempCountry,
          profession: tempProfession,
          avatar: avatarURL || avatarPlaceholder,
          cover: coverURL || coverPlaceholder,
          aboutMe: tempAboutMe,
          facebook: tempFacebookLink || "",
          instagram: tempInstagramLink || "",
          telegram: tempTelegramLink || "",
        });

        // Обновляем локальное состояние
        setNickname(tempNickname);
        setCountry(tempCountry);
        setProfession(tempProfession);
        setAvatar(avatarURL);
        setCover(coverURL);
        setAboutMe(tempAboutMe);
        setFacebookLink(tempFacebookLink);
        setInstagramLink(tempInstagramLink);
        setTelegramLink(tempTelegramLink);

        toast.success("Profile updated successfully!");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Profile update error", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleProfessionChange = (profession) => {
    setTempProfession(profession);
    setShowDropdown(false);

    if (dropdownHeaderRef.current) {
      dropdownHeaderRef.current.blur();
    }
  };

  return (
    <div className="modal-overlay mpe-overlay" id="modal-overlay">
      <div className="modal mpe-modal">
        <button className="modal-btn-close" onClick={onClose}>
          <IoIosClose size={30} color="var(--text-grey-dark)" />
        </button>

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
              {tempCover && <img src={tempCover} alt="Profile Cover" />}
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
                <img src={tempAvatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
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
                      value={tempNickname}
                      onChange={(e) => setTempNickname(e.target.value)}
                    />
                    <span className="mpe-placeholder">Nickname</span>
                    {errors.nickname && <span className="mpe-input-error">{errors.nickname}</span>}
                  </div>

                  <div className="mpe-input-container">
                    <input
                      className="mpe-input"
                      type="text"
                      value={tempCountry}
                      onChange={(e) => setTempCountry(e.target.value)}
                    />
                    <span className="mpe-placeholder">Country</span>
                    {errors.country && <span className="mpe-input-error">{errors.country}</span>}
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
                      value={tempTelegramLink}
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
                      value={tempInstagramLink}
                      onChange={(e) => setTempInstagramLink(e.target.value)}
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
                      value={tempFacebookLink}
                      onChange={(e) => setTempFacebookLink(e.target.value)}
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

          <div className="mpe-btn-box">
            <button className="mpe-btn mpe-btn-cancel" onClick={handleCancel}>
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
