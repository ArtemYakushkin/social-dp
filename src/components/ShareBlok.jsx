import React from "react";

import { FaInstagram } from "react-icons/fa";
import { SlSocialFacebook } from "react-icons/sl";
import { LiaTelegramPlane } from "react-icons/lia";

import "../styles/ShareBlok.css";

const ShareBlok = () => {
  return (
    <div className="share">
      <div className="container">
        <div className="share-wrapp">
          <div>
            <h2 className="share-title">
              Do you know anyone who would also like to chat with us on Dear Penfriend?
            </h2>
            <h2 className="share-title">Tell them about it...</h2>
          </div>
          <div className="share-social">
            <FaInstagram size={24} style={{ cursor: "pointer" }} />
            <SlSocialFacebook size={24} style={{ cursor: "pointer" }} />
            <LiaTelegramPlane size={24} style={{ cursor: "pointer" }} />
          </div>
          <p className="share-text">
            You can use the hashtag{" "}
            <span>
              <a href="#">#dear_penfriend</a>
            </span>{" "}
            to talk about this course on social media
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareBlok;
