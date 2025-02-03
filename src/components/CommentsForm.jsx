import React, { useState } from "react";
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

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import { IoSend } from "react-icons/io5";

import "../styles/CommentsForm.css";

const CommentsForm = ({ postId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  // const isValidComment = (text) => {
  //   const englishTextPattern = /^[A-Za-z0-9 .,!?'"()-]+$/;
  //   return validator.matches(text, englishTextPattern);
  // };
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

  return (
    <div className="comments-section">
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
            <IoSend size={36} />
          </button>
        </form>
      ) : (
        <p className="comments-not-register">Login to leave a comment.</p>
      )}
    </div>
  );
};

export default CommentsForm;
