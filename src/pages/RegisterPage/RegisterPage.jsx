import React, { useState, useRef } from "react";
import { ReactComponent as Error } from "../../assets/icons/error.svg";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as EyeClose } from "../../assets/icons/eye-close.svg";
import { ReactComponent as EyeOpen } from "../../assets/icons/eye-open.svg";
import { ReactComponent as Upload } from "../../assets/icons/upload.svg";
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

const RegisterPage = ({ onClose, isVisible, openLogin }) => {
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const countries = countryList().getData();
  const professions = ["Teacher", "Student"];
  const dropdownHeaderRef = useRef(null);

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    setShowDropdown(false);

    if (dropdownHeaderRef.current) {
      dropdownHeaderRef.current.blur();
    }
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
      errors.nickname = "Please write your nickname in English";
    }
    if (!validator.isEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!validator.isLength(password, { min: 6 })) {
      errors.password = "Your password must be more than 6 characters long";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "The entered passwords are not the same";
    }
    if (!selectedProfession) {
      errors.profession = "Please choose one of the options";
    }
    if (!countries.find((c) => c.label === country)) {
      errors.country = "Please write your сountry in English";
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
      // Закрыть модальное окно после успешной регистрации
      if (onClose) {
        onClose();
      }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`register ${isVisible ? "register-active" : ""}`}
      onClick={handleCloseModal}
    >
      {loading ? (
        <Loader />
      ) : (
        <form
          className="register-form"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="register-form-scroll">
            <h3 className="register-title">Register</h3>
            <div className="register-fields">
              <div className="register-fields-basic">
                <div className="register-input-group">
                  <div className="register-input-container">
                    <input
                      className={`register-input ${
                        errorMessage.nickname ? "register-input-error" : ""
                      }`}
                      type="text"
                      placeholder="Nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <span className="register-placeholder">Nickname</span>
                  </div>
                  {errorMessage.nickname && (
                    <p className="register-error">
                      <span>
                        <Error />
                      </span>
                      {errorMessage.nickname}
                    </p>
                  )}
                </div>

                <div className="register-input-group">
                  <div className="register-input-container">
                    <input
                      className={`register-input ${
                        errorMessage.country ? "register-input-error" : ""
                      }`}
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                    <span className="register-placeholder">Country</span>
                  </div>
                  {errorMessage.country && (
                    <p className="register-error">
                      <span>
                        <Error />
                      </span>
                      {errorMessage.country}
                    </p>
                  )}
                </div>

                <div className="register-input-group">
                  <div className="register-input-container">
                    <div
                      ref={dropdownHeaderRef}
                      className={`register-dropdown-header ${
                        errorMessage.profession ? "register-input-error" : ""
                      } ${
                        showDropdown || selectedProfession ? "is-focused" : ""
                      }`}
                      tabIndex="0"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="dropdown-placeholder">Your status</span>
                      <span className="dropdown-text">
                        {selectedProfession || ""}
                      </span>
                      <span className="dropdown-icon-arrow">
                        {showDropdown ? <ArrowUp /> : <ArrowDown />}
                      </span>
                    </div>
                    {showDropdown && (
                      <div className="register-dropdown-list">
                        {professions.map((profession) => (
                          <div
                            key={profession}
                            className="register-dropdown-item"
                            onClick={() => handleProfessionChange(profession)}
                          >
                            {profession}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errorMessage.profession && (
                    <p className="register-error">
                      <span>
                        <Error />
                      </span>
                      {errorMessage.profession}
                    </p>
                  )}
                </div>

                <div className="register-input-group">
                  <div className="register-input-container">
                    <input
                      className={`register-input ${
                        errorMessage.email ? "register-input-error" : ""
                      }`}
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="register-placeholder">Email</span>
                  </div>
                  {errorMessage.email && (
                    <p className="register-error">
                      <span>
                        <Error />
                      </span>
                      {errorMessage.email}
                    </p>
                  )}
                </div>

                <div className="register-input-group ">
                  <div className="register-input-container register-password">
                    <input
                      className={`register-input ${
                        errorMessage.password ? "register-input-error" : ""
                      }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="register-placeholder">
                      Password (min. 6 characters)
                    </span>
                    <span
                      className="register-pass-eye"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOpen /> : <EyeClose />}
                    </span>
                    <p className="register-show-text">Show password</p>
                  </div>
                  {errorMessage.password && (
                    <p className="register-error register-error-fix">
                      <span>
                        <Error />
                      </span>
                      {errorMessage.password}
                    </p>
                  )}
                </div>

                <div className="register-input-group ">
                  <div className="register-input-container register-password">
                    <input
                      className={`register-input ${
                        errorMessage.confirmPassword
                          ? "register-input-error"
                          : ""
                      }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span className="register-placeholder">
                      Confirm password
                    </span>
                    <span
                      className="register-pass-eye"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOpen /> : <EyeClose />}
                    </span>
                    <p className="register-show-text">Show password</p>
                  </div>
                  {errorMessage.confirmPassword && (
                    <p className="register-error register-error-fix">
                      <span>
                        <Error />
                      </span>
                      {errorMessage.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="register-fields-secondary">
                <div className="register-upload-container">
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  {imagePreview ? (
                    <div className="register-image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <label htmlFor="imageInput">
                        <div className="register-change-box">
                          <span className="register-change-text">
                            Change Photo
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="imageInput"
                      className="register-upload-screen"
                    >
                      <div className="register-upload">
                        <span>
                          <Upload />
                        </span>
                        <p>Select file</p>
                      </div>
                    </label>
                  )}
                </div>

                <p className="register-upload-text">Your avatar</p>
                <p className="register-upload-subtext">
                  *optional (you can add an avatar later)
                </p>
              </div>
            </div>
            <button className="register-btn" type="submit">
              Register
            </button>
            <div className="register-link-box">
              <p className="register-link-text">Already have an account?</p>
              <p className="register-link" onClick={openLogin}>
                Sign in
              </p>
            </div>
            <p className="register-privacy-text">
              Cookies are used for the operation of the service. By clicking
              register, I agree to <span>Privacy Policy</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
