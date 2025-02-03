import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useAuth } from "../auth/useAuth";
import { db, storage } from "../firebase";
import Footer from "../components/Footer";

import avatarPlaceholder from "../assets/avatar.png";
import coverPlaceholder from "../assets/cover-img.jpg";

import { GiBookCover } from "react-icons/gi";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { IoEarth } from "react-icons/io5";
import { BsPersonWorkspace } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import "react-quill/dist/quill.snow.css";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const [selector, setSelector] = useState(true);
  const [nickname, setNickname] = useState(user?.displayName || "");
  const [country, setCountry] = useState("");
  const [profession, setProfession] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatar, setAvatar] = useState(user?.photoURL || avatarPlaceholder);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isEditingProfession, setIsEditingProfession] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [cover, setCover] = useState("");
  const [newCover, setNewCover] = useState(null);
  const [aboutMe, setAboutMe] = useState("");
  const [isEditingBtn, setIsEditingBtn] = useState(false);
  const professions = ["Teacher", "Student"];
  const dropdownHeaderRef = useRef(null);

  useEffect(() => {
    if (user) {
      setNickname(user.displayName);
      setAvatar(user.photoURL || avatarPlaceholder);
      const loadUserProfileData = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setCountry(data.country || "");
            setProfession(data.profession || "");
            setCover(data.cover || "");
            setAboutMe(data.aboutMe || "");
          }
        } catch (error) {
          console.error("Ошибка загрузки данных пользователя:", error);
        }
      };

      loadUserProfileData();
    }
  }, [user]);

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

  const handleProfessionChange = (profession) => {
    setProfession(profession);
    setShowDropdown(false);

    if (dropdownHeaderRef.current) {
      dropdownHeaderRef.current.blur();
    }
  };

  const handleSave = async () => {
    try {
      if (user) {
        let avatar = user.photoURL || "";
        let coverURL = cover || "";

        if (newAvatar) {
          const storageRef = ref(storage, `avatars/${user.uid}`);
          await uploadBytes(storageRef, newAvatar);
          avatar = await getDownloadURL(storageRef);
        }

        if (newCover) {
          const coverRef = ref(storage, `covers/${user.uid}`);
          await uploadBytes(coverRef, newCover);
          coverURL = await getDownloadURL(coverRef);
        }

        await updateProfile(user, { displayName: nickname, photoURL: avatar });

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          nickname,
          country,
          profession,
          avatar,
          aboutMe: aboutMe || "",
          cover: coverURL || "",
        });

        setAvatar(avatar);
        setCover(coverURL);
        setNewAvatar(null);
        setNewCover(null);
        toast.success("Profile updated successfully!");
        setSelector(true);
        setIsEditingNickname(false);
        setIsEditingCountry(false);
        setIsEditingProfession(false);
        setIsEditingAbout(false);
        setIsEditingBtn(false);
      }
    } catch (error) {
      console.error("Profile update error", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditingNickname(false);
    setIsEditingCountry(false);
    setIsEditingProfession(false);
    setIsEditingAbout(false);
    setIsEditingBtn(false);
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-sidebar">
            <ul className="profile-sidebar-list">
              <li className="profile-sidebar-item" onClick={() => setIsEditingBtn(true)}>
                {selector && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="image-input"
                      id="coverInput"
                    />
                    <label htmlFor="coverInput" className="profile-sidebar-btn">
                      <GiBookCover size={24} />
                      Edit cover
                    </label>
                  </>
                )}
              </li>

              <li className="profile-sidebar-item" onClick={() => setIsEditingBtn(true)}>
                {selector && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="image-input"
                      id="imageInput"
                    />
                    <label htmlFor="imageInput" className="profile-sidebar-btn">
                      <MdOutlinePhotoSizeSelectActual size={24} />
                      Edit avatar
                    </label>
                  </>
                )}
              </li>

              <li className="profile-sidebar-item">
                <button
                  className="profile-sidebar-btn"
                  onClick={() => {
                    setIsEditingNickname(true);
                    setIsEditingBtn(true);
                  }}
                >
                  <GrUserManager size={24} />
                  Edit nickname
                </button>
              </li>

              <li className="profile-sidebar-item">
                <button
                  className="profile-sidebar-btn"
                  onClick={() => {
                    setIsEditingCountry(true);
                    setIsEditingBtn(true);
                  }}
                >
                  <IoEarth size={24} />
                  Edit country
                </button>
              </li>

              <li className="profile-sidebar-item">
                <button
                  className="profile-sidebar-btn"
                  onClick={() => {
                    setIsEditingProfession(true);
                    setIsEditingBtn(true);
                  }}
                >
                  <BsPersonWorkspace size={24} />
                  Edit status
                </button>
              </li>

              <li className="profile-sidebar-item">
                <button
                  className="profile-sidebar-btn"
                  onClick={() => {
                    setIsEditingAbout(true);
                    setIsEditingBtn(true);
                  }}
                >
                  <CgProfile size={24} />
                  Edit about me
                </button>
              </li>
            </ul>

            <div className="profile-sidebar-line-box">
              <div></div>
            </div>

            {isEditingBtn && (
              <div className="profile-sidebar-option-buttons">
                <button
                  className="profile-sidebar-option-btn profile-sidebar-option-btn-save"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="profile-sidebar-option-btn profile-sidebar-option-btn-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-info">
            <h2 className="profile-info-title">Profile</h2>

            <div className="profile-info-content">
              <div className="profile-avatar-img">
                <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
              </div>

              <img
                className="profile-info-cover"
                src={cover || coverPlaceholder}
                alt="Profile Cover"
              />

              <div className="profile-nickname">
                {isEditingNickname ? (
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Nickname"
                    onBlur={() => setIsEditingNickname(false)}
                  />
                ) : (
                  <h1>{nickname}</h1>
                )}
              </div>

              <div className="profile-line-box">
                <div></div>
              </div>

              <ul className="profile-status">
                <li className="profile-status-item-input">
                  <h4>Country:</h4>
                  {isEditingCountry ? (
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                    />
                  ) : (
                    <span>{country}</span>
                  )}
                </li>
                <li className="profile-status-item-select">
                  <h4>Status on the site:</h4>
                  {isEditingProfession ? (
                    <div className="dropdown-container">
                      <div
                        ref={dropdownHeaderRef}
                        className="dropdown-header"
                        tabIndex="0"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <span className="dropdown-placeholder">Your status - </span>
                        <span className="dropdown-text">{profession || ""}</span>
                        <span className="dropdown-icon">
                          {showDropdown ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
                        </span>
                      </div>
                      {showDropdown && (
                        <div className="dropdown-list">
                          {professions.map((profession) => (
                            <div
                              key={profession}
                              className="dropdown-item"
                              onClick={() => handleProfessionChange(profession)}
                            >
                              {profession}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="profession">{profession}</span>
                  )}
                </li>
              </ul>
            </div>

            <div className="profile-about">
              <div className="profile-about-text-box">
                <h2 className="profile-about-title">About me</h2>
                <p className="profile-about-subtext">(Write something about yourself.)</p>
              </div>

              <div className="profile-about-line-box">
                <div></div>
              </div>

              {isEditingAbout ? (
                <div className="profile-about-write">
                  <ReactQuill
                    value={aboutMe}
                    onChange={setAboutMe}
                    theme="snow"
                    // placeholder="Create text..."
                    style={{ height: "165px" }}
                  />
                </div>
              ) : (
                <div
                  className="profile-about-text"
                  dangerouslySetInnerHTML={{
                    __html: aboutMe,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
