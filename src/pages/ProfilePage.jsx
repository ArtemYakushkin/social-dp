import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useAuth } from "../auth/useAuth";
import { db, storage } from "../firebase";

import avatarPlaceholder from "../assets/avatar.png";

import { IoAddCircleSharp } from "react-icons/io5";

import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const [selector, setSelector] = useState(true);
  const [nickname, setNickname] = useState(user?.displayName || "");
  const [country, setCountry] = useState("");
  const [profession, setProfession] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || avatarPlaceholder);
  const [newAvatar, setNewAvatar] = useState(null);

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

  const handleSave = async () => {
    try {
      if (user) {
        let avatar;

        if (newAvatar) {
          const storageRef = ref(storage, `avatars/${user.uid}`);
          await uploadBytes(storageRef, newAvatar);
          avatar = await getDownloadURL(storageRef);
        }

        await updateProfile(user, { displayName: nickname, avatar });

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          nickname,
          country,
          profession,
          avatar,
        });

        setAvatar(avatar);
        setNewAvatar(null);
        toast.success("Profile updated successfully!");
        setSelector(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-wrapp">
          <div className="profile-left">
            <img src={avatar} alt="User avatar" />
          </div>
          {selector ? (
            <div className="profile-right">
              <div className="profile-user">
                <h1>{nickname}</h1>
                <p>
                  Country: <span>{country}</span>
                </p>
                <p>
                  Profession: <span>{profession}</span>
                </p>
              </div>
              <button className="profile-edit-btn" onClick={() => setSelector(false)}>
                Edit
              </button>
            </div>
          ) : (
            <div className="profile-right">
              <div className="profile-inputs">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nickname"
                />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
                <label htmlFor="profession">Choose a profession</label>
                <select
                  id="profession"
                  name="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="image-input"
                  id="imageInput"
                />
                <label htmlFor="imageInput" className="profile-upload-button">
                  Add avatar <IoAddCircleSharp size={20} />
                </label>
              </div>
              <div className="profile-buttons">
                <button className="profile-btn-save" onClick={handleSave}>
                  Save
                </button>
                <button className="profile-btn-cancel" onClick={() => setSelector(true)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
