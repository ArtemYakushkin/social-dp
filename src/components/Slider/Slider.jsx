import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

import { useAuthModals } from "../../hooks/useAuthModals";
import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";

import SliderDesk from "./SliderDesk";
import SliderTablet from "./SliderTablet";
import SliderMobile from "./SliderMobile";

import slide1 from "../../assets/slide1.png";
import slide2 from "../../assets/slide2.png";
import slide3 from "../../assets/slide3.png";
import slide4 from "../../assets/slide4.png";
import avatar1 from "../../assets/avatar1.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import star from "../../assets/stars.png";
import stars from "../../assets/tablet/stars.png";
import slideMob1 from "../../assets/mobile/slide1.png";
import slideMob2 from "../../assets/mobile/slide2.png";
import slideMob3 from "../../assets/mobile/slide3.png";
import slideMob4 from "../../assets/mobile/slide4.png";
import starsMobile from "../../assets/mobile/stars.png";

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

const Slider = () => {
  const {
    isRegisterModalOpen,
    isLoginModalOpen,
    setIsRegisterModalOpen,
    setIsLoginModalOpen,
    openLogin,
    openRegister,
    handleRegisterClick,
  } = useAuthModals();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX && touchEndX) {
      const deltaX = touchStartX - touchEndX;
      if (deltaX > 50) {
        handleNext();
      } else if (deltaX < -50) {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const SlidesComponent = isMobile ? SliderMobile : isTablet ? SliderTablet : SliderDesk;

  const slideCount = SlidesComponent.count;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="slider"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container slider-container">
        <div className="slider-wrapper">
          <div className="slider-slides">
            {isMobile ? (
              <SliderMobile
                currentSlide={currentSlide}
                handleRegisterClick={handleRegisterClick}
                avatar1={avatar1}
                avatar2={avatar2}
                avatar3={avatar3}
                slideMob1={slideMob1}
                slideMob2={slideMob2}
                slideMob3={slideMob3}
                slideMob4={slideMob4}
                starsMobile={starsMobile}
              />
            ) : isTablet ? (
              <SliderTablet
                currentSlide={currentSlide}
                handleRegisterClick={handleRegisterClick}
                avatar1={avatar1}
                avatar2={avatar2}
                avatar3={avatar3}
                stars={stars}
              />
            ) : (
              <SliderDesk
                currentSlide={currentSlide}
                handleRegisterClick={handleRegisterClick}
                avatar1={avatar1}
                avatar2={avatar2}
                avatar3={avatar3}
                slide1={slide1}
                slide2={slide2}
                slide3={slide3}
                slide4={slide4}
                star={star}
              />
            )}
          </div>

          {!(isMobile || isTablet) && (
            <>
              <button
                className="slider-prev"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                style={{
                  opacity: currentSlide === 0 ? 0.5 : 1,
                  cursor: currentSlide === 0 ? "default" : "pointer",
                }}
              >
                <MdOutlineArrowBackIos size={22} style={{ color: "var(--text-white)" }} />
              </button>
              <button
                className="slider-next"
                onClick={handleNext}
                disabled={currentSlide === slideCount - 1}
                style={{
                  opacity: currentSlide === slideCount - 1 ? 0.5 : 1,
                  cursor: currentSlide === slideCount - 1 ? "default" : "pointer",
                }}
              >
                <MdOutlineArrowForwardIos size={22} style={{ color: "var(--text-white)" }} />
              </button>
            </>
          )}

          <div className="slider-pagination">
            {Array.from({ length: slideCount }).map((_, index) => (
              <span
                key={index}
                className={`slider-dot ${currentSlide === index ? "slider-dot-active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
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

export default Slider;
