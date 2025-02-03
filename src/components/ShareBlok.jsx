import React from "react";

import { FaInstagram } from "react-icons/fa";
import { SlSocialFacebook } from "react-icons/sl";
import { LiaTelegramPlane } from "react-icons/lia";
import { CiLinkedin } from "react-icons/ci";

import "../styles/ShareBlok.css";

const ShareBlok = () => {
  const appUrl = encodeURIComponent("http://localhost:3000/");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}`,
    // instagram: "https://www.instagram.com/",
    telegram: `https://t.me/share/url?url=${appUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}`,
  };

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
            {/* <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a> */}
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <CiLinkedin size={28} />
            </a>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
              <SlSocialFacebook size={24} />
            </a>
            <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer">
              <LiaTelegramPlane size={24} />
            </a>
          </div>
          <p className="share-text">
            You can use the hashtag{" "}
            <span>
              <a href="#" target="_blank" rel="noopener noreferrer">
                #dear_penfriend
              </a>
            </span>{" "}
            to talk about this course on social media
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareBlok;
