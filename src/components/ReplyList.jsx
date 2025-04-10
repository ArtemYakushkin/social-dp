import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";
import ModalEditReply from "./ModalEditReply";
import ModalDeleteReply from "./ModalDeleteReply";
import Loader from "./Loader";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import "../styles/ReplyList.css";

const ReplyList = ({ commentId, currentUser, onReplyDeleted }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);
  const [editedText, setEditedText] = useState("");
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const navigate = useNavigate();

  useEffect(() => {
    const repliesQuery = query(collection(db, "replys"), where("commentId", "==", commentId));
    const unsubscribe = onSnapshot(repliesQuery, async (snapshot) => {
      const repliesData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const reply = docSnap.data();
          const userDocRef = doc(db, "users", reply.author.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : {};
          return {
            id: docSnap.id,
            ...reply,
            author: {
              ...reply.author,
              nickname: userData.nickname || "Unknown User",
              avatar: userData.avatar
                ? userData.avatar
                : userData.nickname
                ? userData.nickname.charAt(0).toUpperCase()
                : "U",
            },
          };
        })
      );
      setReplies(
        repliesData
          .filter((reply) => reply.createdAt) // убедись, что есть createdAt
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()) // сортировка по убыванию
      );
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

  const handleDeleteReply = async (replyId) => {
    try {
      const replyRef = doc(db, "replys", replyId);
      const replySnapshot = await getDoc(replyRef);
      const replyData = replySnapshot.data();

      if (!replyData || !replyData.commentId) {
        console.error("Ответ или commentId не найден.");
        return;
      }

      const commentId = replyData.commentId;

      await deleteDoc(replyRef);

      const commentRef = doc(db, "comments", commentId);
      const commentSnapshot = await getDoc(commentRef);
      const commentData = commentSnapshot.data();

      if (commentData && commentData.replies) {
        const updatedReplies = commentData.replies.filter((id) => id !== replyId);
        await updateDoc(commentRef, {
          replies: updatedReplies,
          replyCount: updatedReplies.length,
        });
      }

      setReplies((prevReplies) => prevReplies.filter((reply) => reply.id !== replyId));

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
        <div key={reply.id}>
          {isMobile ? (
            <div className="reply-list-item">
              <span></span>
              <div className="reply-list-top">
                <div
                  className="reply-list-avatar"
                  onClick={() => navigate(`/author/${reply.author.uid}`)}
                >
                  {reply.author.avatar ||
                  (reply.author.nickname && reply.author.nickname.charAt(0).toUpperCase()) ? (
                    typeof reply.author.avatar === "string" && reply.author.avatar.length > 1 ? (
                      <img src={reply.author.avatar} alt="Avatar" />
                    ) : (
                      <div className="reply-list-avatar-initial">{reply.author.avatar}</div>
                    )
                  ) : (
                    <div className="reply-list-avatar-initial">U</div>
                  )}
                </div>
                <div className="reply-list-right">
                  <div className="reply-list-content">
                    <div className="reply-list-author">
                      <p className="reply-list-nikname">{reply.author.nickname}</p>
                      {reply.author.uid === currentUser?.uid && (
                        <div className="reply-list-bottom">
                          <button
                            className="reply-list-options-btn"
                            onClick={() => {
                              setIsEditing(true);
                              setSelectedReply(reply);
                              setEditedText(reply.text);
                            }}
                          >
                            <AiOutlineEdit size={20} />
                          </button>
                          <button
                            className="reply-list-options-btn"
                            onClick={() => {
                              setIsDeleting(true);
                              setSelectedReply(reply);
                            }}
                          >
                            <AiOutlineDelete size={20} />
                          </button>
                        </div>
                      )}
                    </div>
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
                    <p className="reply-list-text">{reply.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="reply-list-item">
              <span></span>
              <div className="reply-list-top">
                <div
                  className="reply-list-avatar"
                  onClick={() => navigate(`/author/${reply.author.uid}`)}
                >
                  {reply.author.avatar ||
                  (reply.author.nickname && reply.author.nickname.charAt(0).toUpperCase()) ? (
                    typeof reply.author.avatar === "string" && reply.author.avatar.length > 1 ? (
                      <img src={reply.author.avatar} alt="Avatar" />
                    ) : (
                      <div className="reply-list-avatar-initial">{reply.author.avatar}</div>
                    )
                  ) : (
                    <div className="reply-list-avatar-initial">U</div>
                  )}
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
              {reply.author.uid === currentUser?.uid && (
                <div className="reply-list-bottom">
                  <button
                    className="reply-list-options-btn"
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedReply(reply);
                      setEditedText(reply.text);
                    }}
                  >
                    Edit Reply
                  </button>
                  <button
                    className="reply-list-options-btn"
                    onClick={() => {
                      setIsDeleting(true);
                      setSelectedReply(reply);
                    }}
                  >
                    Delete Reply
                  </button>
                </div>
              )}
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
          onConfirm={() => {
            handleDeleteReply(selectedReply.id);
            setIsDeleting(false);
          }}
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
