import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import validator from "validator";
import countryList from "react-select-country-list";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import "./RegisterPage.css";

const RegisterPage = ({ onClose }) => {
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const countries = countryList().getData();

  const handleProfessionChange = (event) => {
    setSelectedProfession(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!nickname.trim()) {
      errors.nickname = "Nickname cannot be empty";
    } else if (!/^[a-zA-Z0-9\s.,'-]+$/.test(nickname)) {
      errors.nickname = "Nickname must be in English";
    }
    if (!validator.isEmail(email)) {
      errors.email = "The email address entered is incorrect";
    }
    if (!validator.isLength(password, { min: 6 })) {
      errors.password = "Password must be more than 6 characters long";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Password not confirmed";
    }
    if (!selectedProfession) {
      errors.profession = "Profession not chosen";
    }
    if (!countries.find((c) => c.label === country)) {
      errors.country = "Enter your country in English";
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let avatarURL = "";
      if (avatarFile) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, avatarFile);
        avatarURL = await getDownloadURL(avatarRef);
      }

      await updateProfile(user, {
        displayName: nickname,
        photoURL: avatarURL,
      });

      const userData = {
        nickname,
        avatar: avatarURL || "",
        country,
        profession: selectedProfession,
        createdPosts: [],
        createdComments: [],
        createdReplys: [],
        likedPosts: [],
        likedComments: [],
      };

      // Сохранение данных пользователя в Firestore
      const userRef = doc(collection(db, "users"), user.uid);
      await setDoc(userRef, userData, { merge: true });

      // Успешное сохранение данных
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("User with this email already exists.");
      } else {
        toast.error("Error during registration.");
      }

      // Если произошла ошибка при сохранении данных
      if (error.message.includes("Error saving user data")) {
        toast.error("Failed to save user data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (onClose) onClose();
  };

  return (
    <div className="register" onClick={handleCloseModal}>
      {loading ? (
        <Loader />
      ) : (
        <form
          className="register-form"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="register-title">Register</h2>
          <div className="register-block">
            <div className="register-left">
              <div className="register-group">
                <label className="register-label">
                  Nickname
                  <input
                    className="register-input"
                    type="text"
                    placeholder="Enter your nickname..."
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  {errorMessage.nickname && (
                    <p className="register-error">{errorMessage.nickname}</p>
                  )}
                </label>
              </div>

              <div className="register-group">
                <label className="register-label">
                  Country
                  <input
                    className="register-input"
                    type="text"
                    placeholder="Enter your country..."
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  {errorMessage.country && (
                    <p className="register-error">{errorMessage.country}</p>
                  )}
                </label>
              </div>

              <div className="register-group">
                <label className="register-label">
                  Email
                  <input
                    className="register-input"
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errorMessage.email && (
                    <p className="register-error">{errorMessage.email}</p>
                  )}
                </label>
              </div>

              <div className="register-group">
                <label className="register-label">
                  Password
                  <input
                    className="register-input"
                    type="password"
                    placeholder="Enter your password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errorMessage.password && (
                    <p className="register-error">{errorMessage.password}</p>
                  )}
                </label>
              </div>

              <div className="register-group">
                <label className="register-label">
                  Confirm password
                  <input
                    className="register-input"
                    type="password"
                    placeholder="Confirm your password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errorMessage.confirmPassword && (
                    <p className="register-error">
                      {errorMessage.confirmPassword}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <div className="register-right">
              <div className="register-group">
                <p className="checkbox-title">Profession</p>
                <div className="checkbox-container">
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="profession"
                      value="teacher"
                      checked={selectedProfession === "teacher"}
                      onChange={handleProfessionChange}
                      className="checkbox-input"
                    />
                    <span className="custom-checkbox"></span>
                    Teacher
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="profession"
                      value="student"
                      checked={selectedProfession === "student"}
                      onChange={handleProfessionChange}
                      className="checkbox-input"
                    />
                    <span className="custom-checkbox"></span>
                    Student
                  </label>
                </div>
                {errorMessage.profession && (
                  <p className="register-error">{errorMessage.profession}</p>
                )}
              </div>

              <div className="register-group">
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  <label htmlFor="imageInput" className="upload-button">
                    Add avatar
                  </label>
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  ) : (
                    <div className="preview-container">
                      <p>Your avatar</p>
                    </div>
                  )}
                </div>
              </div>

              <button className="register-btn" type="submit">
                Register
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
