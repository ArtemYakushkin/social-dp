import React, { useState } from "react";
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

import { db } from "../firebase";

import { IoSend } from "react-icons/io5";

import "../styles/ReplyForm.css";

const ReplyForm = ({ commentId, postId, user, onReplyAdded }) => {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

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
            <IoSend size={30} color="var(--accent-blue-color)" />
          </button>
        </form>
      ) : (
        <p className="reply-not-register">Log in to leave a reply.</p>
      )}
    </>
  );
};

export default ReplyForm;
