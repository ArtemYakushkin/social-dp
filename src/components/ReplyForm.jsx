import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import validator from "validator";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import { db } from "../firebase";

import { IoSend } from "react-icons/io5";

import "../styles/ReplyForm.css";

const ReplyForm = ({ commentId, postId, user, onReplyAdded }) => {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    if (isRegisterModalOpen || isLoginModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRegisterModalOpen, isLoginModalOpen]);

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const isValidReply = (text) => {
    const englishTextPattern = /^[A-Za-z0-9 .,!?'"()-]+$/;
    return validator.matches(text, englishTextPattern);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!replyText.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    if (!isValidReply(replyText)) {
      setError("Reply must contain only English letters.");
      return;
    }

    try {
      const replyRef = await addDoc(collection(db, "replys"), {
        postId,
        commentId,
        text: replyText,
        author: {
          uid: user.uid,
        },
        createdAt: serverTimestamp(),
      });

      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        replies: arrayUnion(replyRef.id),
      });

      setReplyText("");
      toast.success("Reply added successfully!");

      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (error) {
      console.error("Error adding reply: ", error);
      setError("Error sending reply");
    }
  };

  const handleRegisterClick = () => {
    if (user) {
      toast.info("You are already registered", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      setIsRegisterModalOpen(true);
    }
  };

  return (
    <>
      {user ? (
        <form className="reply-form" onSubmit={handleReplySubmit}>
          <input
            className="reply-input"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add your reply here"
            rows={3}
          />
          {error && <p className="reply-error">{error}</p>}
          <button className="reply-form-btn" type="submit">
            <IoSend size={isTablet || isMobile ? "24" : "30"} color="var(--accent-blue-color)" />
          </button>
        </form>
      ) : (
        <p className="reply-not-register" onClick={handleRegisterClick}>
          Log in to leave a reply
        </p>
      )}

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
    </>
  );
};

export default ReplyForm;
