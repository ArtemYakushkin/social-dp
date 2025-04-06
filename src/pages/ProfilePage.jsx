import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";
import PopularPosts from "../components/PopularPosts";
import ModalProfileEdit from "../components/ModalProfileEdit";
import ProfilePosts from "../components/ProfilePosts";
import SavedPosts from "../components/SavedPosts";
import ModalUpdateCredentials from "../components/ModalUpdateCredentials";

import avatarPlaceholder from "../assets/avatar.png";
import coverPlaceholder from "../assets/cover-img.jpg";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import telegram from "../assets/telegram.png";

import { FiSettings } from "react-icons/fi";
import { LuBookmark } from "react-icons/lu";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LiaIdCardSolid } from "react-icons/lia";

import "react-quill/dist/quill.snow.css";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState(user?.displayName || "");
  const [country, setCountry] = useState("");
  const [profession, setProfession] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || avatarPlaceholder);
  const [cover, setCover] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSetting, setIsModalSetting] = useState(false);
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "about");
  const [postCount, setPostCount] = useState(0);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      setNickname(user.displayName); // Update nickname from user object
      setAvatar(user.photoURL || avatarPlaceholder); // Update avatar from user object

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
            setFacebookLink(data.facebook || "");
            setInstagramLink(data.instagram || "");
            setTelegramLink(data.telegram || "");
          }
        } catch (error) {
          console.error("Ошибка загрузки данных пользователя:", error);
        }
      };

      loadUserProfileData();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setPostCount(userData.createdPosts?.length || 0);
        }
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
      }
    };

    fetchUserPosts();
  }, [user]);

  return (
    <>
      <div className="profile">
        {isMobile ? (
          <>
            <div className="profile-info">
              <div className="profile-avatar-img">
                <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
              </div>

              <div className="profile-settings">
                <button className="profile-btn-set" onClick={() => setIsModalSetting(true)}>
                  <FiSettings size={28} />
                </button>
              </div>

              <img className="profile-cover" src={cover || coverPlaceholder} alt="Profile Cover" />

              <div className="container profile-social-container">
                <div className="profile-social">
                  {(facebookLink || instagramLink || telegramLink) && (
                    <p className="profile-contacts">Contacts:</p>
                  )}
                  {facebookLink && (
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                      <img src={facebook} alt="facebook" />
                    </a>
                  )}
                  {instagramLink && (
                    <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                      <img src={instagram} alt="instagram" />
                    </a>
                  )}
                  {telegramLink && (
                    <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                      <img src={telegram} alt="telegram" />
                    </a>
                  )}
                </div>
                <h1 className="profile-nickname">{nickname}</h1>

                <div className="profile-line-box">
                  <div></div>
                </div>

                <ul className="profile-status">
                  <li className="profile-item">
                    <p>
                      Country: <span>{country}</span>
                    </p>
                  </li>
                  <li className="profile-item">
                    <p>
                      Status: <span>{profession}</span>
                    </p>
                  </li>
                </ul>

                <button className="profile-btn-edit" onClick={() => setIsModalOpen(true)}>
                  Edit profile information
                </button>
              </div>
            </div>

            <div className="container">
              <div className="profile-tabs">
                <button
                  className={`profile-tabs-btn ${
                    activeTab === "about" ? "profile-tabs-btn-active" : ""
                  }`}
                  onClick={() => setActiveTab("about")}
                >
                  <LiaIdCardSolid size={24} /> About
                </button>
                {postCount === 0 ? (
                  <></>
                ) : (
                  <button
                    className={`profile-tabs-btn ${
                      activeTab === "posts" ? "profile-tabs-btn-active" : ""
                    }`}
                    onClick={() => setActiveTab("posts")}
                  >
                    <HiOutlineClipboardDocumentList size={24} /> ({postCount})
                  </button>
                )}
                <button
                  className={`profile-tabs-btn ${
                    activeTab === "saved" ? "profile-tabs-btn-active" : ""
                  }`}
                  onClick={() => setActiveTab("saved")}
                >
                  <LuBookmark size={24} />
                </button>
              </div>

              <div className="profile-tabs-content">
                {activeTab === "about" && (
                  <div className="profile-about">
                    <h2>About Me</h2>
                    <p
                      className="profile-about-text"
                      dangerouslySetInnerHTML={{
                        __html: aboutMe,
                      }}
                    ></p>
                  </div>
                )}

                {activeTab === "posts" && (
                  <div className="profile-posts">
                    <ProfilePosts />
                  </div>
                )}

                {activeTab === "saved" && (
                  <div className="profile-saved">
                    <SavedPosts />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : isTablet ? (
          <div className="container">
            <div className="profile-info">
              <div className="profile-avatar-img">
                <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
              </div>

              <img className="profile-cover" src={cover || coverPlaceholder} alt="Profile Cover" />

              <div className="profile-personal">
                <h1 className="profile-nickname">{nickname}</h1>
                <div className="profile-social">
                  {(facebookLink || instagramLink || telegramLink) && (
                    <p className="profile-contacts">Contacts:</p>
                  )}
                  {facebookLink && (
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                      <img src={facebook} alt="facebook" />
                    </a>
                  )}
                  {instagramLink && (
                    <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                      <img src={instagram} alt="instagram" />
                    </a>
                  )}
                  {telegramLink && (
                    <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                      <img src={telegram} alt="telegram" />
                    </a>
                  )}
                </div>
              </div>

              <div className="profile-line-box">
                <div></div>
              </div>

              <div className="profile-options">
                <ul className="profile-status">
                  <li className="profile-item">
                    <p>
                      Country: <span>{country}</span>
                    </p>
                  </li>
                  <li className="profile-item">
                    <p>
                      Status: <span>{profession}</span>
                    </p>
                  </li>
                </ul>
                <div className="profile-settings">
                  <button className="profile-btn-set" onClick={() => setIsModalSetting(true)}>
                    <FiSettings size={28} />
                  </button>
                </div>
              </div>
              <button className="profile-btn-edit" onClick={() => setIsModalOpen(true)}>
                Edit profile information
              </button>
            </div>

            <div className="profile-tabs">
              <button
                className={`profile-tabs-btn ${
                  activeTab === "about" ? "profile-tabs-btn-active" : ""
                }`}
                onClick={() => setActiveTab("about")}
              >
                <LiaIdCardSolid size={24} /> About
              </button>
              {postCount === 0 ? (
                <></>
              ) : (
                <button
                  className={`profile-tabs-btn ${
                    activeTab === "posts" ? "profile-tabs-btn-active" : ""
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  <HiOutlineClipboardDocumentList size={24} /> Posts ({postCount})
                </button>
              )}
              <button
                className={`profile-tabs-btn ${
                  activeTab === "saved" ? "profile-tabs-btn-active" : ""
                }`}
                onClick={() => setActiveTab("saved")}
              >
                <LuBookmark size={24} /> My Saved
              </button>
            </div>

            <div className="profile-tabs-content">
              {activeTab === "about" && (
                <div className="profile-about">
                  <h2>About Me</h2>
                  <p
                    className="profile-about-text"
                    dangerouslySetInnerHTML={{
                      __html: aboutMe,
                    }}
                  ></p>
                </div>
              )}

              {activeTab === "posts" && (
                <div className="profile-posts">
                  <ProfilePosts />
                </div>
              )}

              {activeTab === "saved" && (
                <div className="profile-saved">
                  <SavedPosts />
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="profile-container">
              <div className="profile-info">
                <div className="profile-avatar-img">
                  <img src={avatar || avatarPlaceholder} alt={`${nickname}'s avatar`} />
                </div>

                <img
                  className="profile-cover"
                  src={cover || coverPlaceholder}
                  alt="Profile Cover"
                />

                <div className="profile-personal">
                  <h1 className="profile-nickname">{nickname}</h1>
                  <div className="profile-social">
                    {(facebookLink || instagramLink || telegramLink) && (
                      <p className="profile-contacts">Contacts:</p>
                    )}
                    {facebookLink && (
                      <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                        <img src={facebook} alt="facebook" />
                      </a>
                    )}
                    {instagramLink && (
                      <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                        <img src={instagram} alt="instagram" />
                      </a>
                    )}
                    {telegramLink && (
                      <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                        <img src={telegram} alt="telegram" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="profile-line-box">
                  <div></div>
                </div>

                <div className="profile-options">
                  <ul className="profile-status">
                    <li className="profile-item">
                      <p>
                        Country: <span>{country}</span>
                      </p>
                    </li>
                    <li className="profile-item">
                      <p>
                        Status: <span>{profession}</span>
                      </p>
                    </li>
                  </ul>
                  <div className="profile-settings">
                    <button className="profile-btn-edit" onClick={() => setIsModalOpen(true)}>
                      Edit profile information
                    </button>
                    <button className="profile-btn-set" onClick={() => setIsModalSetting(true)}>
                      <FiSettings size={28} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="profile-tabs">
                <button
                  className={`profile-tabs-btn ${
                    activeTab === "about" ? "profile-tabs-btn-active" : ""
                  }`}
                  onClick={() => setActiveTab("about")}
                >
                  <LiaIdCardSolid size={24} /> About
                </button>
                {postCount === 0 ? (
                  <></>
                ) : (
                  <button
                    className={`profile-tabs-btn ${
                      activeTab === "posts" ? "profile-tabs-btn-active" : ""
                    }`}
                    onClick={() => setActiveTab("posts")}
                  >
                    <HiOutlineClipboardDocumentList size={24} /> Posts ({postCount})
                  </button>
                )}
                <button
                  className={`profile-tabs-btn ${
                    activeTab === "saved" ? "profile-tabs-btn-active" : ""
                  }`}
                  onClick={() => setActiveTab("saved")}
                >
                  <LuBookmark size={24} /> My Saved
                </button>
              </div>

              <div className="profile-tabs-content">
                {activeTab === "about" && (
                  <div className="profile-about">
                    <h2>About Me</h2>
                    <p
                      className="profile-about-text"
                      dangerouslySetInnerHTML={{
                        __html: aboutMe,
                      }}
                    ></p>
                  </div>
                )}

                {activeTab === "posts" && (
                  <div className="profile-posts">
                    <ProfilePosts />
                  </div>
                )}

                {activeTab === "saved" && (
                  <div className="profile-saved">
                    <SavedPosts />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {isModalOpen && (
          <ModalProfileEdit
            nickname={nickname}
            setNickname={setNickname}
            country={country}
            setCountry={setCountry}
            profession={profession}
            setProfession={setProfession}
            avatar={avatar}
            setAvatar={setAvatar}
            cover={cover}
            setCover={setCover}
            aboutMe={aboutMe}
            setAboutMe={setAboutMe}
            user={user}
            setIsModalOpen={setIsModalOpen}
            facebookLink={facebookLink}
            setFacebookLink={setFacebookLink}
            instagramLink={instagramLink}
            setInstagramLink={setInstagramLink}
            telegramLink={telegramLink}
            setTelegramLink={setTelegramLink}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {isModalSetting && <ModalUpdateCredentials onClose={() => setIsModalSetting(false)} />}
      </div>
      <PopularPosts />
    </>
  );
};

export default ProfilePage;
