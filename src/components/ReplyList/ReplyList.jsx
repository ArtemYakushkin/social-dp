import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Loader/Loader";
import ModalEditReply from "../ModalEditReply/ModalEditReply";
import ModalDeleteReply from "../ModalDeleteReply/ModalDeleteReply";
import "./ReplyList.css";

const ReplyList = ({ commentId, user, onReplyDeleted }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    if (!commentId) return;

    const q = query(
      collection(db, "replys"),
      where("commentId", "==", commentId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReplies = [];
      querySnapshot.forEach((doc) => {
        fetchedReplies.push({ id: doc.id, ...doc.data() });
      });
      setReplies(fetchedReplies);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [commentId]);

  const handleEditReply = async () => {
    if (!selectedReply || !editedText.trim()) return;

    const replyDocRef = doc(db, "replys", selectedReply.id);
    try {
      await updateDoc(replyDocRef, { text: editedText });
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.id === selectedReply.id ? { ...reply, text: editedText } : reply
        )
      );
      setIsEditing(false);
      setSelectedReply(null);
    } catch (error) {
      console.error("Error editing reply:", error.message);
    }
  };

  // const handleDeleteReply = async (replyId) => {
  //   try {
  //     await deleteDoc(doc(db, "replys", replyId));
  //     setReplies((prevReplies) =>
  //       prevReplies.filter((reply) => reply.id !== replyId)
  //     );
  //     if (onReplyDeleted) {
  //       onReplyDeleted(replyId);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting reply:", error.message);
  //   }
  // };

  const handleDeleteReply = async (replyId) => {
    try {
      // Получаем ссылку на документ ответа
      const replyRef = doc(db, "replys", replyId);

      // Получаем данные ответа, чтобы узнать, к какому комментарию он привязан
      const replySnapshot = await getDoc(replyRef); // Используем getDoc
      const replyData = replySnapshot.data();

      if (!replyData || !replyData.commentId) {
        console.error("Ответ или commentId не найден.");
        return;
      }

      const commentId = replyData.commentId; // Идентификатор комментария, к которому привязан ответ

      // Удаляем сам ответ из коллекции replys
      await deleteDoc(replyRef);

      // Получаем ссылку на документ комментария
      const commentRef = doc(db, "comments", commentId);
      const commentSnapshot = await getDoc(commentRef); // Используем getDoc
      const commentData = commentSnapshot.data();

      if (commentData && commentData.replies) {
        // Удаляем ID ответа из массива replies
        const updatedReplies = commentData.replies.filter(
          (id) => id !== replyId
        );

        // Обновляем комментарий в Firestore с новым массивом replies
        await updateDoc(commentRef, {
          replies: updatedReplies,
          replyCount: updatedReplies.length, // Обновляем количество ответов
        });
      }

      // Обновляем локальный state для удаления ответа из UI
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.id !== replyId)
      );

      // Если передан колбек onReplyDeleted, вызываем его
      if (onReplyDeleted) {
        onReplyDeleted(replyId);
      }
    } catch (error) {
      console.error("Ошибка при удалении ответа:", error.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (replies.length === 0) {
    return <p className="reply-no-replys">No replies yet.</p>;
  }

  return (
    <div className="reply-list">
      {replies.map((reply) => (
        <div key={reply.id} className="reply-list-item">
          <div className="reply-list-top">
            <div className="reply-list-avatar">
              <img src={reply.author.avatar} alt="Avatar" />
            </div>
            <div className="reply-list-right">
              <div className="reply-list-content">
                <div className="reply-list-author">
                  <p className="reply-list-nikname">{reply.author.nickname}</p>
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
            </div>
          </div>
          {user?.uid === reply.author.uid && (
            <div className="reply-list-bottom">
              <button
                className="reply-list-options-btn"
                onClick={() => {
                  setSelectedReply(reply);
                  setEditedText(reply.text);
                  setIsEditing(true);
                }}
              >
                Edit reply
              </button>
              <button
                className="reply-list-options-btn"
                onClick={() => {
                  setSelectedReply(reply);
                  setIsDeleting(true);
                }}
              >
                Delete reply
              </button>
            </div>
          )}
        </div>
      ))}

      {isEditing && (
        <ModalEditReply
          text={editedText}
          onTextChange={setEditedText}
          onSave={handleEditReply}
          onCancel={() => {
            setIsEditing(false);
            setSelectedReply(null);
          }}
        />
      )}

      {isDeleting && (
        <ModalDeleteReply
          onConfirm={() => handleDeleteReply(selectedReply.id)}
          onCancel={() => {
            setIsDeleting(false);
            setSelectedReply(null);
          }}
        />
      )}
    </div>
  );
};

export default ReplyList;
