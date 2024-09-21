import React, { useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import { useAuth } from "../../auth/useAuth";
import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./CommentsForm.css";

const CommentsForm = ({ postId }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  // Функция для проверки комментария на содержание только разрешенных символов
  const isValidComment = (text) => {
    const englishTextPattern = /^[A-Za-z0-9 .,!?'"()-]+$/;
    return validator.matches(text, englishTextPattern);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Сбрасываем ошибку перед проверкой

    if (!commentText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    // Проверка на то, что текст содержит только английские буквы, цифры, пробелы и знаки препинания
    if (!isValidComment(commentText)) {
      setError("Comment must contain only English letters.");
      return;
    }

    try {
      // Создаем данные комментария
      const commentData = {
        postId: postId,
        text: commentText,
        createdAt: serverTimestamp(),
        likes: [],
        author: {
          avatar: user?.photoURL || "",
          nickname: user?.displayName || "",
        },
      };

      // Добавляем комментарий в коллекцию "comments"
      const commentRef = await addDoc(collection(db, "comments"), commentData);

      // Сохраняем ID комментария в массиве comments внутри поста
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef.id),
      });

      setCommentText(""); // Очищаем поле после отправки
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      setError("Error sending comment");
    }
  };

  return (
    <div className="comments-section">
      {user ? (
        <form onSubmit={handleCommentSubmit} className="comments-form">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Leave a comment..."
            className="comments-textarea"
          />
          {error && <p className="comments-error">{error}</p>}
          <button type="submit" className="comments-submit-btn">
            Add
          </button>
        </form>
      ) : (
        <p>Log in to leave a comment.</p>
      )}
      {/* {error && <p className="comments-error">{error}</p>} */}
    </div>
  );
};

export default CommentsForm;
