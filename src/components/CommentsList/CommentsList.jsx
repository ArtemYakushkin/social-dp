import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { IoHeartSharp } from "react-icons/io5";
import Loader from "../Loader/Loader";
import ReplyForm from "../ReplyForm/ReplyForm";
import ReplyList from "../ReplyList/ReplyList";
import "./CommentsList.css";

const CommentsList = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(fetchedComments);
      setLoading(false);
    });

    return () => unsubscribe(); // Отписка от реального времени при размонтировании
  }, [postId]);

  const handleLike = async (commentId, likes) => {
    if (!user || !user.uid) {
      alert("You need to be logged in to like a comment.");
      return;
    }

    const commentRef = doc(db, "comments", commentId);
    const userLiked = likes.includes(user.uid);

    try {
      // Обновляем документ комментария, добавляя или убирая UID пользователя
      if (userLiked) {
        await updateDoc(commentRef, {
          likes: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(commentRef, {
          likes: arrayUnion(user.uid),
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const toggleReplyForm = (commentId) => {
    // Если текущий комментарий уже активен, сбрасываем состояние, иначе устанавливаем новый активный комментарий
    setActiveCommentId((prevActiveId) =>
      prevActiveId === commentId ? null : commentId
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (comments.length === 0) {
    return <p>There are no comments yet.</p>;
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-list-wrapp">
          <div className="comment-list-author">
            <div className="comment-list-avatar">
              <img src={comment.author.avatar} alt="Avatar" />
            </div>
            <p className="comment-list-nikname">{comment.author.nickname}</p>
            <p className="comment-list-date">
              {comment.createdAt && comment.createdAt.toDate
                ? comment.createdAt.toDate().toLocaleString("ru-RU", {
                    timeZone: "Europe/Moscow",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Date not available"}
            </p>
          </div>
          <p className="comment-list-text">{comment.text}</p>
          <div className="comment-list-bottom-section">
            <div
              className="comment-list-icon"
              onClick={() => handleLike(comment.id, comment.likes)}
            >
              <IoHeartSharp
                size={16}
                color={comment.likes.includes(user?.uid) ? "red" : "black"}
              />
              <span>{comment.likes.length}</span>
            </div>
            <button
              className="comment-list-reply"
              onClick={() => toggleReplyForm(comment.id)} // Открытие и закрытие формы ответа
            >
              Add reply / Reply ({comment.replies ? comment.replies.length : 0})
            </button>
          </div>
          {activeCommentId === comment.id && (
            <div className="comment-list-reply-container">
              <ReplyForm commentId={comment.id} postId={postId} user={user} />
              <ReplyList commentId={comment.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
