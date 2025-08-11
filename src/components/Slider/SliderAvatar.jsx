import React from "react";

import { GoPlus } from "react-icons/go";

const SliderAvatar = ({ avatar1, avatar2, avatar3, currentSlide }) => {
  return (
    <div className={`sliderAvatars ${currentSlide === 0 ? "sliderAvatars-slide1" : ""} `}>
      <div className="sliderAvatars-add">
        <GoPlus size={32} color="var(--text-white)" />
      </div>
      <div className="sliderAvatars-photo">
        <img src={avatar1} alt="" />
      </div>
      <div className="sliderAvatars-photo">
        <img src={avatar2} alt="" />
      </div>
      <div className="sliderAvatars-photo">
        <img src={avatar3} alt="" />
      </div>
    </div>
  );
};

export default SliderAvatar;
