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
import { db } from "../../firebase";
import { ReactComponent as Add } from "../../assets/icons/add.svg";
import "./ReplyForm.css";

const ReplyForm = ({ commentId, postId, user, onReplyAdded }) => {
  const [replyText, setReplyText] = useState("");
  // const [loading, setLoading] = useState(false);
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

    // Проверка на то, что текст содержит только английские буквы, цифры, пробелы и знаки препинания
    if (!isValidReply(replyText)) {
      setError("Reply must contain only English letters.");
      return;
    }

    try {
      // Добавляем новый ответ в коллекцию replys
      const replyRef = await addDoc(collection(db, "replys"), {
        postId,
        commentId,
        text: replyText,
        author: {
          uid: user?.uid || "",
          avatar: user?.photoURL || "",
          nickname: user?.displayName || "",
        },
        createdAt: serverTimestamp(),
      });

      // Обновляем комментарий, добавляя ссылку на ответ в поле replies
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        replies: arrayUnion(replyRef.id), // Добавляем ID ответа
      });

      setReplyText(""); // Очищаем текст
      toast.success("Reply added successfully!");

      // Уведомляем родительский компонент
      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (error) {
      console.error("Error adding reply: ", error);
      setError("Error sending reply");
    }
  };

  return (
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
        <Add width={30} height={24} />
      </button>
    </form>
  );
};

export default ReplyForm;
