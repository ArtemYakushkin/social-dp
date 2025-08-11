import React from "react";

const LetterTablet = ({ handleClick, anna, letterTab }) => {
  return (
    <div className="letTab">
      <div className="container">
        <div className="letTab-author">
          <div className="letTab-avatar">
            <img src={anna} alt="" />
          </div>
          <div className="letTab-nickname">
            <p className="letterNick">Anna Yakushkina</p>
            <span className="letterInspirer">Project Author</span>
          </div>
        </div>

        <div className="letTab-text-box letterSubtitle">
          <p>
            Here you can begin your journey of friendship, support, and English fun. You can show
            your talents and enjoy learning together.
          </p>
          <p>And I will be your first penfriend!</p>
        </div>

        <div className="letTab-frame">
          <h3 className="letTab-title postTitle">
            "Dear penfriend,
            <br /> Hi. My name is Anna. What is your name?"
          </h3>
          <button className="letTab-btn btnModerateFill" onClick={handleClick}>
            Reply to the author
          </button>
          <span className="letTab-attention attentionText">
            Your message will be shown as a comment. Everyone on the site will see it — and may
            answer it.
          </span>
          <img className="letTab-img" src={letterTab} alt="letter" />
        </div>
      </div>
    </div>
  );
};

export default LetterTablet;
