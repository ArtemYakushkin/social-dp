import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Loader/Loader";
import "./ReplyList.css"; // Добавьте стили для ReplyList, если нужно

const ReplyList = ({ commentId }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!commentId) return;

    // Запрос для получения ответов, связанных с конкретным комментарием
    const q = query(
      collection(db, "replys"),
      where("commentId", "==", commentId),
      orderBy("createdAt", "desc") // Сортировка по времени создания
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReplies = [];
      querySnapshot.forEach((doc) => {
        fetchedReplies.push({ id: doc.id, ...doc.data() });
      });
      setReplies(fetchedReplies);
      setLoading(false);
    });

    return () => unsubscribe(); // Отписываемся при размонтировании компонента
  }, [commentId]);

  if (loading) {
    return <Loader />;
  }

  if (replies.length === 0) {
    return <p>No replies yet.</p>; // Сообщение, если нет ответов
  }

  return (
    <div className="reply-list">
      {replies.map((reply) => (
        <div key={reply.id} className="reply-list-item">
          <div className="reply-list-author">
            <div className="reply-list-avatar">
              <img
                src={reply.author.avatar}
                alt="Avatar"
                className="reply-avatar"
              />
            </div>
            <p className="reply-list-nickname">{reply.author.nickname}</p>
            <p className="reply-list-date">
              {reply.createdAt && reply.createdAt.toDate
                ? reply.createdAt.toDate().toLocaleString("ru-RU", {
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
          <p className="reply-list-text">{reply.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReplyList;
