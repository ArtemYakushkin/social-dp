import React, { useEffect, useState, useMemo } from "react";
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
import ModalDeleteComment from "./ModalDeleteComment";
import ModalEditComment from "./ModalEditComment";
import UnregisteredModal from "./UnregisteredModal";

import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import "../styles/CommentsList.css";

const CommentsList = ({ postId, user, usersData, onCommentDeleted }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [repliesCounts, setRepliesCounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const deletedComments = useMemo(() => new Set(), []);

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
      const newRepliesCounts = {};

      for (const docSnap of querySnapshot.docs) {
        if (!deletedComments.has(docSnap.id)) {
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

          newRepliesCounts[docSnap.id] = data.replies?.length || 0;
        }
      }

      setComments(fetchedComments);
      setRepliesCounts(newRepliesCounts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId, deletedComments]);

  const handleReplyAdded = (commentId) => {
    setRepliesCounts((prevCounts) => ({
      ...prevCounts,
      [commentId]: (prevCounts[commentId] || 0) + 1,
    }));
  };

  const handleReplyDeleted = (commentId) => {
    setRepliesCounts((prevCounts) => ({
      ...prevCounts,
      [commentId]: Math.max((prevCounts[commentId] || 0) - 1, 0),
    }));
  };

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

  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "comments", commentToDelete));

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayRemove(commentToDelete),
      });

      setComments((prevComments) => prevComments.filter((c) => c.id !== commentToDelete));

      if (onCommentDeleted) {
        onCommentDeleted(commentToDelete);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditComment = (commentId, newText) => {
    setCommentToEdit({ id: commentId, text: newText });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (newText) => {
    try {
      const commentRef = doc(db, "comments", commentToEdit.id);
      await updateDoc(commentRef, {
        text: newText,
      });
      setComments((prevComments) =>
        prevComments.map((c) => (c.id === commentToEdit.id ? { ...c, text: newText } : c))
      );
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const toggleReplyList = (commentId) => {
    setActiveCommentId((prevActiveId) => (prevActiveId === commentId ? null : commentId));
  };

  if (loading) {
    return <Loader />;
  }

  if (comments.length === 0) {
    return <p className="comment-notcomment-text">There are no comments yet.</p>;
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
                                onClick={() => handleEditComment(comment.id, comment.text)}
                              >
                                <AiOutlineEdit size={20} />
                              </button>
                              <button
                                className="comment-options-btn"
                                onClick={() => handleDeleteComment(comment.id)}
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
                      <ReplyForm
                        commentId={comment.id}
                        postId={postId}
                        user={user}
                        onReplyAdded={() => handleReplyAdded(comment.id)}
                      />
                      <ReplyList
                        commentId={comment.id}
                        currentUser={user}
                        onReplyDeleted={() => handleReplyDeleted(comment.id)}
                      />
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
                          <p className="comment-list-btn-text">
                            hide {repliesCounts[comment.id] || 0} replies
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="comment-list-frame-icon">
                            <FaPlus size={14} />
                          </div>
                          <p className="comment-list-btn-text">
                            {repliesCounts[comment.id] || 0} more replies
                          </p>
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
                          onClick={() => handleEditComment(comment.id, comment.text)}
                        >
                          Edit comment
                        </button>
                        <button
                          className="comment-options-btn"
                          onClick={() => handleDeleteComment(comment.id)}
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
                    <ReplyForm
                      commentId={comment.id}
                      postId={postId}
                      user={user}
                      onReplyAdded={() => handleReplyAdded(comment.id)}
                    />
                    <ReplyList
                      commentId={comment.id}
                      currentUser={user}
                      onReplyDeleted={() => handleReplyDeleted(comment.id)}
                    />
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
                        <p className="comment-list-btn-text">
                          hide {repliesCounts[comment.id] || 0} replies
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="comment-list-frame-icon">
                          <FaPlus size={14} />
                        </div>
                        <p className="comment-list-btn-text">
                          {repliesCounts[comment.id] || 0} more replies
                        </p>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <ModalDeleteComment
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        <ModalEditComment
          isOpen={isEditModalOpen}
          currentText={commentToEdit?.text || ""}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      </div>

      <UnregisteredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CommentsList;
