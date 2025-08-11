import React from "react";
import { useMediaQuery } from "react-responsive";

import { SlSocialFacebook } from "react-icons/sl";
import { LiaTelegramPlane } from "react-icons/lia";
import { CiLinkedin } from "react-icons/ci";

const ShareBlok = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const appUrl = encodeURIComponent("https://dear-penfriend-5d0fd.firebaseapp.com/");
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
            {isMobile ? (
              <h2 className="share-title sectionTitle">
                Do you know someone who wants to chat with us <br /> on Dear Penfriend?
              </h2>
            ) : (
              <h2 className="share-title sectionTitle">
                Do you know someone who wants to chat with us on Dear Penfriend?
              </h2>
            )}
            <h2 className="share-title sectionTitle">Share it with them!</h2>
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
          {isMobile ? (
            <p className="share-text textMain">
              You can use
              <br /> hashtag <span>#dear_penfriend</span> to share it on social media
            </p>
          ) : (
            <p className="share-text textMain">
              You can use hashtag <span>#dear_penfriend</span> to share it on social media
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareBlok;
