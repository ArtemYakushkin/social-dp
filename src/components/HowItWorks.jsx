import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../auth/useAuth";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import step4 from "../assets/step4.png";

import "../styles/HowItWorks.css";

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [fade, setFade] = useState(false);

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

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => setFade(false), 2000);
    return () => clearTimeout(timeout);
  }, [currentStep]);

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
            <img
              key={currentStep}
              src={stepImages[currentStep]}
              alt={`Step ${currentStep}`}
              className={fade ? "fade-in" : ""}
            />
          </div>
          <div className="how-steps">
            {[1, 2, 4, 3].map((step) => (
              <div
                key={step}
                className={`how-step ${currentStep === step ? "how-step-active" : ""}`}
                onClick={() => setCurrentStep(step)}
              >
                <h4 className="how-step-title">Step {step}</h4>
                <p className="how-step-text">
                  {step === 1 && "Complete a short and simple registration"}
                  {step === 2 && "Read educational posts and watch interesting videos"}
                  {step === 3 &&
                    "You participate in interactive activities, like, actively comment and communicate with children from different countries of the world"}
                  {step === 4 &&
                    "You receive bonuses and incentives, increase your level on the site and simply enjoy communicating with like-minded people"}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="how-btn-box">
          <button className="how-btn" onClick={handleRegisterClick}>
            Register and start chatting
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
