import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { db } from "../../firebase";

import LetterDesk from "./LetterDesk";
import LetterTablet from "./LetterTablet";
import LetterMobile from "./LetterMobile";

import brackets from "../../assets/brackets.png";
import anna from "../../assets/anna-avatar.png";
import letter from "../../assets/letter.png";
import letterTab from "../../assets/tablet/letter-letter-tablet.png";
import letterMob from "../../assets/mobile/letter-letter-mobile.png";

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
        <LetterMobile handleClick={handleClick} anna={anna} letterMob={letterMob} />
      ) : isTablet ? (
        <LetterTablet handleClick={handleClick} anna={anna} letterTab={letterTab} />
      ) : (
        <LetterDesk handleClick={handleClick} brackets={brackets} anna={anna} letter={letter} />
      )}
    </>
  );
};

export default LetterSection;
