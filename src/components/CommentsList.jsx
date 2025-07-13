import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  doc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";

import Loader from "./Loader";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import UnregisteredModal from "./UnregisteredModal";
import ModalEdit from "./ModalEdit";
import ModalDelete from "./ModalDelete";

import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import "../styles/CommentsList.css";

const CommentsList = ({ postId, user, usersData, onCommentDeleted }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedComments = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const authorRef = doc(db, "users", data.author.id);
        const authorSnap = await getDoc(authorRef);
        const authorData = authorSnap.exists()
          ? authorSnap.data()
          : { avatar: null, nickname: "Unknown Author" };

        fetchedComments.push({
          id: docSnap.id,
          ...data,
          author: { ...authorData, id: data.author.id },
        });
      }

      setComments(fetchedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleLike = async (commentId, likes) => {
    if (!user || !user.uid) {
      setIsModalOpen(true);
      return;
    }

    const commentRef = doc(db, "comments", commentId);
    const userLiked = likes.includes(user.uid);

    try {
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

  const handleSaveEdit = async () => {
    if (!selectedComment) return;

    try {
      const commentRef = doc(db, "comments", selectedComment.id);
      await updateDoc(commentRef, { text: editedText });

      setComments((prev) =>
        prev.map((c) => (c.id === selectedComment.id ? { ...c, text: editedText } : c))
      );
    } catch (error) {
      console.error("Error editing comment:", error);
    } finally {
      setIsEditing(false);
      setSelectedComment(null);
      setEditedText("");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedComment) return;

    try {
      await deleteDoc(doc(db, "comments", selectedComment.id));
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayRemove(selectedComment.id),
      });

      setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
      if (onCommentDeleted) onCommentDeleted(selectedComment.id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
      setSelectedComment(null);
    }
  };

  const toggleReplyList = (commentId) => {
    setActiveCommentId((prev) => (prev === commentId ? null : commentId));
  };

  if (loading) return <Loader />;

  if (comments.length === 0) {
    return (
      <div className="container">
        <p className="comment-notcomment-text">There are no comments yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id}>
            {isMobile ? (
              <div className="container">
                <div className="comment-total-wrapp">
                  <div className="comment-top-section">
                    <div
                      className="comment-avatar"
                      onClick={() => navigate(`/author/${comment.author.id}`)}
                    >
                      {comment.author.avatar ? (
                        <img src={comment.author.avatar} alt="Avatar" />
                      ) : (
                        <div className="comment-avatar-initial">
                          {comment.author.nickname
                            ? comment.author.nickname.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      )}
                    </div>
                    <div className="comment-right">
                      <div className="comment-content">
                        <div className="comment-author">
                          <p className="comment-nikname">{comment.author.nickname}</p>
                          {comment.author.id === user?.uid && (
                            <div className="comment-options-btn-box">
                              <button
                                className="comment-options-btn"
                                onClick={() => {
                                  setIsEditing(true);
                                  setSelectedComment(comment);
                                  setEditedText(comment.text);
                                }}
                              >
                                <AiOutlineEdit size={20} />
                              </button>
                              <button
                                className="comment-options-btn"
                                onClick={() => {
                                  setIsDeleting(true);
                                  setSelectedComment(comment);
                                }}
                              >
                                <AiOutlineDelete size={20} />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="comment-date">
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
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                  <div className="comment-center-section">
                    <div className="comment-center-options">
                      <button
                        className="comment-options-btn"
                        onClick={() => toggleReplyList(comment.id)}
                      >
                        {activeCommentId === comment.id ? "Cancel reply" : "Reply to comment"}
                      </button>
                    </div>
                    <button
                      className="comment-btn-like"
                      onClick={() => handleLike(comment.id, comment.likes)}
                    >
                      {comment.likes.includes(user?.uid) ? (
                        <FaHeart size={20} style={{ color: "var(--text-error)" }} />
                      ) : (
                        <FaRegHeart size={20} style={{ color: "var(--text-black)" }} />
                      )}
                      <span>{comment.likes.length}</span>
                    </button>
                  </div>
                  {activeCommentId === comment.id && (
                    <div className="comment-list-reply-container">
                      <ReplyForm commentId={comment.id} postId={postId} user={user} />
                      <ReplyList commentId={comment.id} currentUser={user} />
                    </div>
                  )}
                  <div className="comment-bottom-section">
                    <span></span>
                    <button
                      className="comment-list-btn"
                      onClick={() => toggleReplyList(comment.id)}
                    >
                      {activeCommentId === comment.id ? (
                        <>
                          <div className="comment-list-frame-icon">
                            <FaMinus size={14} />
                          </div>
                          <p className="comment-list-btn-text">hide replies</p>
                        </>
                      ) : (
                        <>
                          <div className="comment-list-frame-icon">
                            <FaPlus size={14} />
                          </div>
                          <p className="comment-list-btn-text">more replies</p>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="comment-total-wrapp">
                <div className="comment-top-section">
                  <div
                    className="comment-avatar"
                    onClick={() => navigate(`/author/${comment.author.id}`)}
                  >
                    {comment.author.avatar ? (
                      <img src={comment.author.avatar} alt="Avatar" />
                    ) : (
                      <div className="comment-avatar-initial">
                        {comment.author.nickname
                          ? comment.author.nickname.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>
                  <div className="comment-right">
                    <div className="comment-content">
                      <div className="comment-author">
                        <p className="comment-nikname">{comment.author.nickname}</p>
                        <p className="comment-date">
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
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                </div>

                <div className="comment-center-section">
                  <div className="comment-center-options">
                    <button
                      className="comment-options-btn"
                      onClick={() => toggleReplyList(comment.id)}
                    >
                      {activeCommentId === comment.id ? "Cancel reply" : "Reply to comment"}
                    </button>
                    {comment.author.id === user?.uid && (
                      <>
                        <button
                          className="comment-options-btn"
                          onClick={() => {
                            setIsEditing(true);
                            setSelectedComment(comment);
                            setEditedText(comment.text);
                          }}
                        >
                          Edit comment
                        </button>
                        <button
                          className="comment-options-btn"
                          onClick={() => {
                            setIsDeleting(true);
                            setSelectedComment(comment);
                          }}
                        >
                          Delete comment
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    className="comment-btn-like"
                    onClick={() => handleLike(comment.id, comment.likes)}
                  >
                    {comment.likes.includes(user?.uid) ? (
                      <FaHeart size={24} style={{ color: "var(--text-error)" }} />
                    ) : (
                      <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
                    )}
                    <span>{comment.likes.length}</span>
                  </button>
                </div>
                {activeCommentId === comment.id && (
                  <div className="comment-list-reply-container">
                    <ReplyForm commentId={comment.id} postId={postId} user={user} />
                    <ReplyList commentId={comment.id} currentUser={user} />
                  </div>
                )}
                <div className="comment-bottom-section">
                  <span></span>
                  <button className="comment-list-btn" onClick={() => toggleReplyList(comment.id)}>
                    {activeCommentId === comment.id ? (
                      <>
                        <div className="comment-list-frame-icon">
                          <FaMinus size={14} />
                        </div>
                        <p className="comment-list-btn-text">hide replies</p>
                      </>
                    ) : (
                      <>
                        <div className="comment-list-frame-icon">
                          <FaPlus size={14} />
                        </div>
                        <p className="comment-list-btn-text">more replies</p>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isEditing && selectedComment && (
          <ModalEdit
            text={editedText}
            onTextChange={setEditedText}
            onSave={handleSaveEdit}
            onCancel={() => {
              setIsEditing(false);
              setSelectedComment(null);
            }}
          />
        )}

        {isDeleting && selectedComment && (
          <ModalDelete
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleting(false);
              setSelectedComment(null);
            }}
          />
        )}
      </div>

      <UnregisteredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CommentsList;
