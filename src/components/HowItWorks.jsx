import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import step4 from "../assets/step4.png";
import vector2 from "../assets/vector2.png";
import vector3 from "../assets/vector3.png";

import "../styles/HowItWorks.css";

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (isRegisterModalOpen || isLoginModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRegisterModalOpen, isLoginModalOpen]);

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleRegisterClick = () => {
    if (user) {
      toast.info("You are already registered", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      setIsRegisterModalOpen(true);
    }
  };

  const stepImages = {
    1: step1,
    2: step2,
    3: step3,
    4: step4,
  };

  return (
    <div className="how">
      <div className="container container-how">
        <h2 className="how-title">How it works</h2>
        <div className="how-content">
          <div className="how-img">
            <img src={stepImages[currentStep]} alt={`Step ${currentStep}`} />
          </div>
          <div className="how-steps">
            <div
              className={`how-step ${currentStep === 1 ? "how-step-active" : ""}`}
              onClick={() => setCurrentStep(1)}
            >
              <h4 className="how-step-title">Step 1</h4>
              <p className="how-step-text">Complete a short and simple registration</p>
            </div>
            <div
              className={`how-step ${currentStep === 2 ? "how-step-active" : ""}`}
              onClick={() => setCurrentStep(2)}
            >
              <h4 className="how-step-title">Step 2</h4>
              <p className="how-step-text">Read educational posts and watch interesting videos</p>
            </div>
            <div
              className={`how-step ${currentStep === 4 ? "how-step-active" : ""}`}
              onClick={() => setCurrentStep(4)}
            >
              <h4 className="how-step-title">Step 4</h4>
              <p className="how-step-text">
                You receive bonuses and incentives, increase your level on the site and simply enjoy
                communicating with like-minded people
              </p>
            </div>
            <div
              className={`how-step ${currentStep === 3 ? "how-step-active" : ""}`}
              onClick={() => setCurrentStep(3)}
            >
              <h4 className="how-step-title">Step 3</h4>
              <p className="how-step-text">
                You participate in interactive activities, like, actively comment and communicate
                with children from different countries of the world
              </p>
            </div>
          </div>
        </div>
        <div className="how-btn-box">
          <button className="how-btn" onClick={handleRegisterClick}>
            Register and start chatting
          </button>
        </div>

        <img className="how-vector-2" src={vector2} alt="" />
        <img className="how-vector-3" src={vector3} alt="" />

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
