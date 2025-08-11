import React from "react";

import { FiAlertTriangle } from "react-icons/fi";

const LetterDesk = ({ handleClick, brackets, anna, letter }) => {
  return (
    <div className="letDesk">
      <div className="container">
        <div className="letDesk-wrapper">
          <div className="letDesk-img-brackets">
            <img src={brackets} alt="brackets" />
          </div>

          <div className="letDesk-content">
            <div className="letDesk-author">
              <div className="letDesk-avatar">
                <img src={anna} alt="author" />
              </div>
              <div className="letDesk-nickname">
                <p className="letterNick">Anna Yakushkina</p>
                <span className="letterInspirer">Project Author</span>
              </div>
            </div>

            <div className="letDesk-text-box letterSubtitle">
              <p>
                Here you can begin your journey of friendship, support, and English fun. You can
                show your talents and enjoy learning together.
              </p>
              <p>And I will be your first penfriend!</p>
            </div>

            <div className="letDesk-frame">
              <h3 className="letDesk-title postTitle">
                "Dear penfriend,
                <br /> Hi. My name is Anna. What is your name"?
              </h3>
              <button className="letDesk-btn btnModerateFill" onClick={handleClick}>
                Reply to the author
              </button>
              <span className="letDesk-attention attentionText">
                <FiAlertTriangle size={16} />
                Your message will be shown as a comment. Everyone on the site will see it — and may
                answer it.
              </span>
              <img className="letDesk-img" src={letter} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterDesk;
