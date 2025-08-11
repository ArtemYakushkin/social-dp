import React from "react";

const LetterMobile = ({ handleClick, anna, letterMob }) => {
  return (
    <div className="letMob">
      <div className="container">
        <div className="letMob-author">
          <div className="letMob-avatar">
            <img src={anna} alt="" />
          </div>
          <div className="letMob-nickname">
            <p className="letterNick">Anna Yakushkina</p>
            <span className="letterInspirer">Project Author</span>
          </div>
        </div>

        <div className="letMob-text-box letterSubtitle">
          <p>
            Here you can begin your journey of friendship, support, and English fun. You can show
            your talents and enjoy learning together.
          </p>
          <p>And I will be your first penfriend!</p>
        </div>

        <div className="letMob-frame">
          <h3 className="letMob-title letterSubtitle">
            "Dear penfriend,
            <br /> Hi. My name is Anna.
            <br /> What is your name?"
          </h3>
          <span className="letMob-attention attentionText">
            Your message will be shown as a comment. Everyone on the site will see it — and may
            answer it.
          </span>
          <img className="letMob-img" src={letterMob} alt="letter" />
        </div>

        <button className="letMob-btn btnModerateFill" onClick={handleClick}>
          Reply to the author
        </button>
      </div>
    </div>
  );
};

export default LetterMobile;
