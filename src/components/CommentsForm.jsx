import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import { IoSend } from "react-icons/io5";

import "../styles/CommentsForm.css";

const CommentsForm = ({ postId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
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

  const isValidComment = (text) => {
    const englishTextPattern = "^[A-Za-z0-9 .,!?\"'()\\-]+$";
    return validator.matches(text, new RegExp(englishTextPattern));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!commentText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (!isValidComment(commentText)) {
      setError("Comment must contain only English letters.");
      return;
    }

    try {
      const commentData = {
        postId: postId,
        text: commentText,
        createdAt: serverTimestamp(),
        likes: [],
        author: {
          id: user.uid,
        },
        replies: [],
      };

      const commentRef = await addDoc(collection(db, "comments"), commentData);

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef.id),
      });

      setCommentText("");
      toast.success("Comment added successfully!");

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error sending comment");
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
    <div className="comments-section">
      {isMobile ? (
        <div className="container">
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comments-form">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add your comment here"
                className="comments-input"
              />
              {error && <p className="comments-error">{error}</p>}
              <button type="submit" className="comments-submit-btn">
                <IoSend size={24} />
              </button>
            </form>
          ) : (
            <p className="comments-not-register" onClick={handleRegisterClick}>
              Login to leave a comment
            </p>
          )}
        </div>
      ) : (
        <>
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comments-form">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add your comment here"
                className="comments-input"
              />
              {error && <p className="comments-error">{error}</p>}
              <button type="submit" className="comments-submit-btn">
                <IoSend size={isTablet ? "24" : "36"} />
              </button>
            </form>
          ) : (
            <p className="comments-not-register" onClick={handleRegisterClick}>
              Login to leave a comment
            </p>
          )}
        </>
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
    </div>
  );
};

export default CommentsForm;
