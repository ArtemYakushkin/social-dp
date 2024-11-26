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
import { ReactComponent as TextB } from "../../assets/icons/text-b.svg";
import { ReactComponent as TextI } from "../../assets/icons/text-i.svg";
import { ReactComponent as TextU } from "../../assets/icons/text-u.svg";
import { ReactComponent as TextList } from "../../assets/icons/text-list.svg";
import { ReactComponent as TextImg } from "../../assets/icons/text-img.svg";
import { ReactComponent as TextGif } from "../../assets/icons/text-gif.svg";
import { ReactComponent as TextHeadphones } from "../../assets/icons/text-headphones.svg";
import { ReactComponent as TextLink } from "../../assets/icons/text-link.svg";
import { ReactComponent as TextAdd } from "../../assets/icons/text-add.svg";
import { ReactComponent as TextSmile } from "../../assets/icons/text-smile.svg";
import { ReactComponent as Add } from "../../assets/icons/add.svg";
import "./CommentsForm.css";

const CommentsForm = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  // Функция проверки комментария на содержание разрешенных символов
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

    // Проверка на содержание только английских букв, цифр и знаков препинания
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
          id: user.uid,
        },
        replies: [],
      };

      // Добавляем комментарий в коллекцию "comments"
      const commentRef = await addDoc(collection(db, "comments"), commentData);

      // Сохраняем ID комментария в массиве comments в посте
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef.id),
      });

      setCommentText(""); // Очищаем текстовое поле
      toast.success("Comment added successfully!");

      // Уведомляем родительский компонент
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
          <div className="comments-text-box">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your comment here"
              className="comments-textarea"
            />
            {error && <p className="comments-error">{error}</p>}
          </div>
          <div className="comments-buttons-box">
            <div className="comments-text-icons">
              <TextB />
              <TextI />
              <TextU />
              <TextList />
              <TextImg />
              <TextGif />
              <TextHeadphones />
              <TextLink />
              <TextAdd />
              <TextSmile />
            </div>
            <button type="submit" className="comments-submit-btn">
              <Add width={36} height={30} />
            </button>
          </div>
        </form>
      ) : (
        <p className="comments-not-register">Log in to leave a comment.</p>
      )}
    </div>
  );
};

export default CommentsForm;
