import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useMediaQuery } from "react-responsive";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";

import "../styles/CommentsForm.css";

const notifyNewComment = async (postId, commentId, sender) => {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const post = postSnap.data();

    if (post.author.uid !== sender.id) {
      await addDoc(collection(db, "notifications"), {
        recipientId: post.author.uid,
        type: "new_comment",
        postId,
        postTitle: post.title,
        commentId,
        sender,
        message: `${sender.nickname} commented on your post "${post.title}"`,
        createdAt: serverTimestamp(),
        read: false,
      });
    }
  }
};

const CommentsForm = ({ postId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const emojiPickerRef = useRef(null);
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

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
    const regex = /^[\p{Emoji}\p{L}\p{N}\p{P}\p{Zs}\r\n]+$/u;
    const englishOnly = /^[\p{Emoji}A-Za-z0-9 .,!?'"()\-\n\r]+$/u;
    return regex.test(text.trim()) && englishOnly.test(text.trim());
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!commentText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (!isValidComment(commentText)) {
      setError("Comment must contain only English letters and emojis.");
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

      await notifyNewComment(postId, commentRef.id, {
        id: user.uid,
        nickname: user.displayName,
        photoURL: user.photoURL,
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

  const addEmoji = (emoji) => {
    setCommentText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="comments-section">
      <div className="comments-author">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Post author" />
        ) : (
          <div className="comments-author-avatar-placeholder">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>

      {isMobile ? (
        <div className="container">
          <div className="comments-wrapp-mobile">
            <div className="comments-author-mobile">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Post author" />
              ) : (
                <div className="comments-author-mobile-avatar-placeholder">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            {user ? (
              <form onSubmit={handleCommentSubmit} className="comments-form">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your comment here"
                  className="comments-input"
                />
                <div className="comments-options">
                  <div className="comments-emoji-wrapper">
                    <button
                      type="button"
                      className="comments-emoji-btn"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <BsEmojiSmile size={24} />
                    </button>
                    {showEmojiPicker && (
                      <div className="comments-emoji-picker" ref={emojiPickerRef}>
                        <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
                      </div>
                    )}
                  </div>
                  <button type="submit" className="comments-submit-btn">
                    <IoSend size={24} />
                  </button>
                </div>
                {error && <p className="comments-error">{error}</p>}
              </form>
            ) : (
              <p className="comments-not-register" onClick={handleRegisterClick}>
                Login to leave a comment
              </p>
            )}
          </div>
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
              <div className="comments-options">
                <div className="comments-emoji-wrapper">
                  <button
                    type="button"
                    className="comments-emoji-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile size={24} />
                  </button>
                  {showEmojiPicker && (
                    <div className="comments-emoji-picker" ref={emojiPickerRef}>
                      <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
                    </div>
                  )}
                </div>
                <button type="submit" className="comments-submit-btn">
                  <IoSend size={isTablet ? "24" : "36"} />
                </button>
              </div>
              {error && <p className="comments-error">{error}</p>}
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
