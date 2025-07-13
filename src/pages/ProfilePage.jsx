import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useMediaQuery } from "react-responsive";
import { getAuth } from "firebase/auth";
import ReactQuill from "react-quill";

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";
import PopularPosts from "../components/PopularPosts";
import ModalProfileEdit from "../components/ModalProfileEdit";
import ProfilePosts from "../components/ProfilePosts";
import SavedPosts from "../components/SavedPosts";
import ModalUpdateCredentials from "../components/ModalUpdateCredentials";
import AuthorMessagesList from "../components/AuthorMessagesList";

import avatarPlaceholder from "../assets/avatar.png";
import coverPlaceholder from "../assets/cover-img.png";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import telegram from "../assets/telegram.png";

import { FiSettings } from "react-icons/fi";
import { LuBookmark } from "react-icons/lu";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LiaIdCardSolid } from "react-icons/lia";
import { BiMessageRoundedDots } from "react-icons/bi";
import { RiInformationLine } from "react-icons/ri";

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
  const [author, setAuthor] = useState(null);
  const [tempAboutMe, setTempAboutMe] = useState("");
  const [errors, setErrors] = useState({});
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [messages, setMessages] = useState([]);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  const allowedEmails = process.env.REACT_APP_ALLOWED_EMAILS?.split(",") || [];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setAuthor(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, "authorMessages");

    const q = query(messagesRef, where("authorId", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const isAllowed = author && allowedEmails.includes(author.email);

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handlePublishAboutMe = async () => {
    const englishOnlyRegex = /^[\u0020-\u007E]+$/;

    const plainText = stripHtml(tempAboutMe).trim();

    if (plainText && !englishOnlyRegex.test(plainText)) {
      setErrors({ aboutMe: "Please use English characters only." });
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { aboutMe: tempAboutMe });

      setAboutMe(tempAboutMe);
      setIsEditingAbout(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating About Me:", error);
      setErrors({ aboutMe: "Failed to save. Please try again." });
    }
  };

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
                  {/* {(facebookLink || instagramLink || telegramLink) && (
                    <p className="profile-contacts">Contacts:</p>
                  )} */}
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
                {isAllowed && (
                  <Link to="/create-post">
                    <button className="profile-btn-create">Create a post</button>
                  </Link>
                )}
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
                <button
                  className={`profile-tabs-btn ${
                    activeTab === "message" ? "profile-tabs-btn-active" : ""
                  }`}
                  onClick={() => setActiveTab("message")}
                >
                  <BiMessageRoundedDots size={24} />
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
                    <HiOutlineClipboardDocumentList size={24} />
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
                    <div className="profile-about-header">
                      <h2 className="profile-about-title">About Me</h2>
                      <button
                        className="profile-about-btn-edit"
                        onClick={() => {
                          setTempAboutMe(aboutMe);
                          setIsEditingAbout(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    {stripHtml(aboutMe).trim() ? (
                      <p
                        className="profile-about-text"
                        dangerouslySetInnerHTML={{
                          __html: aboutMe,
                        }}
                      ></p>
                    ) : (
                      <p className="profile-about-text-not-yet">
                        You haven't written anything about yourself yet.
                      </p>
                    )}
                    {isEditingAbout && (
                      <div className="profile-about-container">
                        <div className="profile-about-box">
                          <ReactQuill value={tempAboutMe} onChange={setTempAboutMe} theme="snow" />
                        </div>
                        {errors.aboutMe && (
                          <span className="profile-about-error">{errors.aboutMe}</span>
                        )}
                        <div className="profile-about-actions">
                          <button
                            className="profile-about-actions-btn profile-about-actions-btn-close"
                            onClick={() => setIsEditingAbout(false)}
                          >
                            Close
                          </button>
                          <button
                            className="profile-about-actions-btn profile-about-actions-btn-publish"
                            onClick={handlePublishAboutMe}
                          >
                            Publish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "message" && (
                  <>
                    {messages.length > 0 ? (
                      <AuthorMessagesList
                        authorId={user.uid}
                        showReplyForm={true}
                        isOwnerPage={true}
                      />
                    ) : (
                      <div className="profile-message-noyet-box">
                        <RiInformationLine size={24} />
                        <p className="profile-message-noyet">No one has written to you yet.</p>
                      </div>
                    )}
                  </>
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
              {isAllowed && (
                <Link to="/create-post">
                  <button className="profile-btn-create">Create a post</button>
                </Link>
              )}
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
              <button
                className={`profile-tabs-btn ${
                  activeTab === "message" ? "profile-tabs-btn-active" : ""
                }`}
                onClick={() => setActiveTab("message")}
              >
                <BiMessageRoundedDots size={24} /> Messages
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
                  <HiOutlineClipboardDocumentList size={24} /> Posts
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
                  <div className="profile-about-header">
                    <h2 className="profile-about-title">About Me</h2>
                    <button
                      className="profile-about-btn-edit"
                      onClick={() => {
                        setTempAboutMe(aboutMe);
                        setIsEditingAbout(true);
                      }}
                    >
                      Edit information
                    </button>
                  </div>
                  {stripHtml(aboutMe).trim() ? (
                    <p
                      className="profile-about-text"
                      dangerouslySetInnerHTML={{
                        __html: aboutMe,
                      }}
                    ></p>
                  ) : (
                    <p className="profile-about-text-not-yet">
                      You haven't written anything about yourself yet.
                    </p>
                  )}
                  {isEditingAbout && (
                    <div className="profile-about-container">
                      <div className="profile-about-box">
                        <ReactQuill value={tempAboutMe} onChange={setTempAboutMe} theme="snow" />
                      </div>
                      {errors.aboutMe && (
                        <span className="profile-about-error">{errors.aboutMe}</span>
                      )}
                      <div className="profile-about-actions">
                        <button
                          className="profile-about-actions-btn profile-about-actions-btn-close"
                          onClick={() => setIsEditingAbout(false)}
                        >
                          Close
                        </button>
                        <button
                          className="profile-about-actions-btn profile-about-actions-btn-publish"
                          onClick={handlePublishAboutMe}
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "message" && (
                <>
                  {messages.length > 0 ? (
                    <AuthorMessagesList
                      authorId={user.uid}
                      showReplyForm={true}
                      isOwnerPage={true}
                    />
                  ) : (
                    <div className="profile-message-noyet-box">
                      <RiInformationLine size={24} />
                      <p className="profile-message-noyet">No one has written to you yet.</p>
                    </div>
                  )}
                </>
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
                    {isAllowed && (
                      <Link to="/create-post">
                        <button className="profile-btn-create">Create a post</button>
                      </Link>
                    )}
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
                <button
                  className={`profile-tabs-btn ${
                    activeTab === "message" ? "profile-tabs-btn-active" : ""
                  }`}
                  onClick={() => setActiveTab("message")}
                >
                  <BiMessageRoundedDots size={24} /> Messages
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
                    <HiOutlineClipboardDocumentList size={24} /> Posts
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
                    <div className="profile-about-header">
                      <h2 className="profile-about-title">About Me</h2>
                      <button
                        className="profile-about-btn-edit"
                        onClick={() => {
                          setTempAboutMe(aboutMe);
                          setIsEditingAbout(true);
                        }}
                      >
                        Edit information
                      </button>
                    </div>
                    {stripHtml(aboutMe).trim() ? (
                      <p
                        className="profile-about-text"
                        dangerouslySetInnerHTML={{
                          __html: aboutMe,
                        }}
                      ></p>
                    ) : (
                      <p className="profile-about-text-not-yet">
                        You haven't written anything about yourself yet.
                      </p>
                    )}
                    {isEditingAbout && (
                      <div className="profile-about-container">
                        <div className="profile-about-box">
                          <ReactQuill value={tempAboutMe} onChange={setTempAboutMe} theme="snow" />
                        </div>
                        {errors.aboutMe && (
                          <span className="profile-about-error">{errors.aboutMe}</span>
                        )}
                        <div className="profile-about-actions">
                          <button
                            className="profile-about-actions-btn profile-about-actions-btn-close"
                            onClick={() => setIsEditingAbout(false)}
                          >
                            Close
                          </button>
                          <button
                            className="profile-about-actions-btn profile-about-actions-btn-publish"
                            onClick={handlePublishAboutMe}
                          >
                            Publish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "message" && (
                  <>
                    {messages.length > 0 ? (
                      <AuthorMessagesList
                        authorId={user.uid}
                        showReplyForm={true}
                        isOwnerPage={true}
                      />
                    ) : (
                      <div className="profile-message-noyet-box">
                        <RiInformationLine size={24} />
                        <p className="profile-message-noyet">No one has written to you yet.</p>
                      </div>
                    )}
                  </>
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
