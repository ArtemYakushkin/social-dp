import React from "react";
import { useMediaQuery } from "react-responsive";

import { useAuthModals } from "../../hooks/useAuthModals";
import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";

const HowItWorks = () => {
  const {
    isRegisterModalOpen,
    isLoginModalOpen,
    setIsRegisterModalOpen,
    setIsLoginModalOpen,
    openLogin,
    openRegister,
    handleRegisterClick,
  } = useAuthModals();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className="how">
      <div className="container how-container">
        <h2 className="how-title sectionTitle">How it works</h2>

        <ul className="how-list">
          <li className="how-item-1 nicknameText">
            <span className="how-item-1-step">Step 1</span>
            Sign up — it's quick and easy. Read fun posts and watch interesting videos.
          </li>

          <li className="how-item-2 nicknameText">
            <span className="how-item-2-step">Step 2</span>
            Like, comment, and chat with children from other countries. Share your ideas and learn
            new words.
          </li>

          <li className="how-item-3 nicknameText">
            <span className="how-item-3-step">Step 3</span>
            Get support from others, grow your confidence, enjoy learning and making friends.
          </li>
        </ul>

        <div className="how-btn-box">
          <button className={isMobile ? "btnBigFill" : "btnMain"} onClick={handleRegisterClick}>
            Register
          </button>
        </div>

        {isRegisterModalOpen && (
          <RegisterPage
            isVisible={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            openLogin={openLogin}
          />
        )}
        {isLoginModalOpen && (
          <LoginPage
            isVisible={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            openRegister={openRegister}
          />
        )}
      </div>
    </div>
  );
};

export default HowItWorks;
