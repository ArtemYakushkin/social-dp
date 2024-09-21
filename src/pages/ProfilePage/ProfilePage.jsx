import React, { useState, useEffect } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/useAuth"; // Импортируем хук для аутентификации
import { updateProfile } from "firebase/auth"; // Импортируем функцию для обновления профиля пользователя
import { db, storage } from "../../firebase"; // Импортируем Firestore и Storage из Firebase
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Импортируем функции для обновления данных в Firestore
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Импортируем функции для загрузки файла в Firebase Storage
import avatarPlaceholder from "../../assets/avatar.png"; // Заменяемый аватар по умолчанию
import "./ProfilePage.css"; // Стили для компонента

const ProfilePage = () => {
  const { user } = useAuth(); // Получаем данные текущего пользователя
  const [selector, setSelector] = useState(true); // Для переключения режима редактирования
  const [nickname, setNickname] = useState(user?.displayName || "");
  const [country, setCountry] = useState("");
  const [profession, setProfession] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || avatarPlaceholder);
  const [newAvatar, setNewAvatar] = useState(null); // Хранение нового выбранного аватара

  // Загрузка данных пользователя из Firebase
  useEffect(() => {
    if (user) {
      setNickname(user.displayName);
      setAvatar(user.photoURL || avatarPlaceholder);
      // Псевдокод для загрузки других данных пользователя (например, страна, профессия) из Firestore
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

  // Обработка изменения аватара
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewAvatar(file);
      setAvatar(URL.createObjectURL(file)); // Предварительный просмотр загруженного аватара
    }
  };

  // Сохранение изменений в Firebase
  const handleSave = async () => {
    try {
      if (user) {
        // Обновляем аватар пользователя в Storage, если был загружен новый аватар
        if (newAvatar) {
          const storageRef = ref(storage, `avatars/${user.uid}`);
          await uploadBytes(storageRef, newAvatar);
          const photoURL = await getDownloadURL(storageRef);
          setAvatar(photoURL);

          // Обновляем профиль пользователя в Firebase Authentication
          await updateProfile(user, { displayName: nickname, photoURL });
        } else {
          // Обновляем профиль без изменения аватара
          await updateProfile(user, { displayName: nickname });
        }

        // Обновляем другие данные пользователя в Firestore
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          nickname,
          country,
          profession,
        });

        toast.success("Profile updated successfully!");
        setSelector(true); // Возвращаемся к режиму просмотра
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-wrapp">
          <div className="profile-left">
            <img src={avatar} alt="User avatar" />
            {/* {!selector && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            )} */}
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
              <button
                className="profile-edit-btn"
                onClick={() => setSelector(false)}
              >
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
                <button
                  className="profile-btn-cancel"
                  onClick={() => setSelector(true)}
                >
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
