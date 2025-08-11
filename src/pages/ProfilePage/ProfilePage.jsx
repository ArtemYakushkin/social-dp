import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

import {
  fetchUserProfileData,
  getUserPostCount,
  subscribeToMessages,
  publishAboutMe,
} from "../../utils/profileUtils";
import { useAuth } from "../../auth/useAuth";

import PopularPosts from "../../components/PopularPosts/PopularPosts";
import ModalProfileEdit from "../../components/ModalProfileEdit";
import ProfilePosts from "../../components/ProfilePosts/ProfilePosts";
import SavedPosts from "../../components/SavedPosts/SavedPosts";
import ModalUpdateCredentials from "../../components/ModalUpdateCredentials";
import MessagesList from "../../components/MessagesList/MessagesList";
import AboutMe from "../../components/AboutMe/AboutMe";
import Tabs from "../../components/Tabs/Tabs";
import CardProfile from "../../components/CardProfile/CardProfile";
import InfoBoard from "../../components/InfoBoard/InfoBoard";

import avatarPlaceholder from "../../assets/avatar.png";

import "react-quill/dist/quill.snow.css";

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
      fetchUserProfileData(user.uid, (data) => {
        setCountry(data.country || "");
        setProfession(data.profession || "");
        setCover(data.cover || "");
        setAboutMe(data.aboutMe || "");
        setFacebookLink(data.facebook || "");
        setInstagramLink(data.instagram || "");
        setTelegramLink(data.telegram || "");
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getUserPostCount(user.uid, setPostCount);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToMessages(user.uid, setMessages);
    return () => unsubscribe();
  }, [user]);

  const isAllowed = author && allowedEmails.includes(author.email);

  const handlePublishAboutMe = () => {
    publishAboutMe(user.uid, tempAboutMe, setAboutMe, setErrors, setIsEditingAbout);
  };

  return (
    <>
      <div className="profile">
        <CardProfile
          avatar={avatar}
          nickname={nickname}
          cover={cover}
          facebookLink={facebookLink}
          instagramLink={instagramLink}
          telegramLink={telegramLink}
          country={country}
          profession={profession}
          setIsModalOpen={setIsModalOpen}
          setIsModalSetting={setIsModalSetting}
          isAllowed={isAllowed}
        />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} postCount={postCount} />

        <>
          {activeTab === "about" && (
            <AboutMe
              aboutMe={aboutMe}
              tempAboutMe={tempAboutMe}
              setTempAboutMe={setTempAboutMe}
              isEditingAbout={isEditingAbout}
              setIsEditingAbout={setIsEditingAbout}
              errors={errors}
              handlePublishAboutMe={handlePublishAboutMe}
            />
          )}

          {activeTab === "message" && (
            <>
              {messages.length > 0 ? (
                <MessagesList authorId={user.uid} showReplyForm={true} isOwnerPage={true} />
              ) : (
                <InfoBoard message={"No messages."} />
              )}
            </>
          )}

          {activeTab === "posts" && <ProfilePosts />}

          {activeTab === "saved" && <SavedPosts />}
        </>

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
