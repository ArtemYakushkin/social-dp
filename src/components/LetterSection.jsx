import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";

import brackets from "../assets/brackets.png";
import anna from "../assets/anna-avatar.png";
import letter from "../assets/letter.png";
import letterTab from "../assets/tablet/letter-letter-tablet.png";
import letterMob from "../assets/mobile/letter-letter-mobile.png";

import { FiAlertTriangle } from "react-icons/fi";

import "../styles/LetterSection.css";

const LetterSection = () => {
  const [firstPostId, setFirstPostId] = useState(null);
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  useEffect(() => {
    const fetchFirstPost = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "asc"), limit(1)); // Берем самый первый пост
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setFirstPostId(querySnapshot.docs[0].id); // Сохраняем ID первого поста
        }
      } catch (error) {
        console.error("Ошибка при получении первого поста:", error);
      }
    };

    fetchFirstPost();
  }, []);

  const handleClick = () => {
    if (firstPostId) {
      navigate(`/post/${firstPostId}`);
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="letter">
          <div className="container">
            <div className="letter-author">
              <div className="letter-avatar">
                <img src={anna} alt="" />
              </div>
              <div className="letter-nickname">
                <p>Anna Yakushkina</p>
                <span>Startup author</span>
              </div>
            </div>

            <div className="letter-text-box">
              <p>
                So register and go on a journey of friendship, support, manifestation of your
                talents and the English atmosphere.
              </p>
              <p>And I am ready to become your first penfriend:</p>
            </div>

            <div className="letter-frame">
              <h3 className="letter-title">
                "Dear penfriend,
                <br /> Hi. My name is Anna.
                <br /> What is your name?"
              </h3>
              <span className="letter-attention">
                Your letter will be published as a comment and visible to all site users
              </span>
              <img className="letter-img" src={letterMob} alt="letter" />
            </div>

            <button className="letter-btn" onClick={handleClick}>
              Reply to the author
            </button>
          </div>
        </div>
      ) : isTablet ? (
        <div className="letter">
          <div className="container">
            <div className="letter-author">
              <div className="letter-avatar">
                <img src={anna} alt="" />
              </div>
              <div className="letter-nickname">
                <p>Anna Yakushkina</p>
                <span>Startup author</span>
              </div>
            </div>

            <div className="letter-text-box">
              <p>
                So register and go on a journey of friendship, support, manifestation of your
                talents and the English atmosphere.
              </p>
              <p>And I am ready to become your first penfriend:</p>
            </div>

            <div className="letter-frame">
              <h3 className="letter-title">
                "Dear penfriend,
                <br /> Hi. My name is Anna. What is your name?"
              </h3>
              <button className="letter-btn" onClick={handleClick}>
                Reply to the author
              </button>
              <span className="letter-attention">
                Your letter will be published as a comment and visible to all site users
              </span>
              <img className="letter-img" src={letterTab} alt="letter" />
            </div>
          </div>
        </div>
      ) : (
        <div className="letter">
          <div className="container">
            <div className="letter-wrapper">
              <div className="letter-img-brackets">
                <img src={brackets} alt="brackets" />
              </div>

              <div className="letter-content">
                <div className="letter-author">
                  <div className="letter-avatar">
                    <img src={anna} alt="" />
                  </div>
                  <div className="letter-nickname">
                    <p>Anna Yakushkina</p>
                    <span>Startup author</span>
                  </div>
                </div>

                <div className="letter-text-box">
                  <p>
                    So register and go on a journey of friendship, support, manifestation of your
                    talents and the English atmosphere.
                  </p>
                  <p>And I am ready to become your first penfriend:</p>
                </div>

                <div className="letter-frame">
                  <h3 className="letter-title">
                    "Dear penfriend,
                    <br /> Hi. My name is Anna. What is your name"?
                  </h3>
                  <button className="letter-btn" onClick={handleClick}>
                    Reply to the author
                  </button>
                  <span className="letter-attention">
                    <FiAlertTriangle size={16} />
                    Your letter will be published as a comment and visible to all site users
                  </span>
                  <img className="letter-img" src={letter} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LetterSection;
