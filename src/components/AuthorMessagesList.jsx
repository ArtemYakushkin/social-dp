import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";
import { useAuth } from "../auth/useAuth";

import ModalImageBig from "../components/ModalImageBig";
import ModalEdit from "./ModalEdit";
import ModalDelete from "./ModalDelete";
import AuthorMessReplyList from "../components/AuthorMessReplyList";
import AuthorMessReplyForm from "../components/AuthorMessReplyForm";

import { FaPlus, FaMinus } from "react-icons/fa6";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import "../styles/AuthorMessagesList.css";

const AuthorMessagesList = ({ authorId, showReplyForm = false, isOwnerPage = false }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isModalImage, setIsModalImage] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  useEffect(() => {
    if (!authorId) return;

    const q = query(
      collection(db, "authorMessages"),
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [authorId]);

  const toggleReplyList = (messageId) => {
    setActiveMessageId((prevActiveId) => (prevActiveId === messageId ? null : messageId));
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, "authorMessages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleUpdate = async (messageId) => {
    if (!editedText.trim()) return;
    try {
      await updateDoc(doc(db, "authorMessages", messageId), {
        message: editedText.trim(),
      });
      setIsEditing(false);
      setSelectedMessage(null);
      setEditedText("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  return (
    <>
      {user && messages.length > 0 ? (
        <>
          {isMobile || isTablet ? (
            <div className="message-box">
              <div className="message-list">
                {messages.map((msg) => (
                  <li className="message-wrapp" key={msg.id}>
                    <div className="message-top-section">
                      <div
                        className="message-avatar"
                        onClick={() => navigate(`/author/${msg.senderId}`)}
                      >
                        {msg.senderAvatar ? (
                          <img src={msg.senderAvatar} alt="Avatar" />
                        ) : (
                          <div className="message-avatar-initial">
                            {msg.senderNickname ? msg.senderNickname.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>
                      <div className="message-context-box">
                        <div className="message-content">
                          <div className="message-info">
                            <p className="message-author">{msg.senderNickname}</p>
                            {msg.senderId === user.uid && (
                              <div className="message-btn-box">
                                <button
                                  className="message-btn"
                                  onClick={() => {
                                    setIsEditing(true);
                                    setSelectedMessage(msg);
                                    setEditedText(msg.message);
                                  }}
                                >
                                  <AiOutlineEdit size={20} />
                                </button>
                                <button
                                  className="message-btn"
                                  onClick={() => {
                                    setIsDeleting(true);
                                    setSelectedMessage(msg);
                                  }}
                                >
                                  <AiOutlineDelete size={20} />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="message-date">
                            {msg.createdAt && msg.createdAt.toDate
                              ? msg.createdAt.toDate().toLocaleString("ru-RU", {
                                  timeZone: "Europe/Moscow",
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Date not available"}
                          </p>

                          <p className="message-text">{msg.message}</p>

                          {msg.gif && (
                            <div
                              className="message-media"
                              onClick={() => {
                                setModalImageUrl(msg.gif);
                                setIsModalImage(true);
                              }}
                            >
                              <img src={msg.gif} alt="gif" />
                            </div>
                          )}

                          {msg.image && (
                            <div
                              className="message-media"
                              onClick={() => {
                                setModalImageUrl(msg.image);
                                setIsModalImage(true);
                              }}
                            >
                              <img src={msg.image} alt="message" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {isOwnerPage && (
                      <div className="message-center-section">
                        <button
                          className="message-options-btn"
                          onClick={() => toggleReplyList(msg.id)}
                        >
                          {activeMessageId === msg.id ? "Cancel reply" : "Reply to message"}
                        </button>
                      </div>
                    )}

                    {activeMessageId === msg.id && (
                      <div className="message-reply-container">
                        {showReplyForm && (
                          <AuthorMessReplyForm
                            replyToMessage={msg}
                            currentUser={{
                              uid: user.uid,
                              nickname: user.displayName,
                              avatar: user.photoURL,
                            }}
                          />
                        )}
                        <AuthorMessReplyList messageId={msg.id} />
                      </div>
                    )}

                    <div className="message-bottom-section">
                      <span></span>
                      <button className="message-list-btn" onClick={() => toggleReplyList(msg.id)}>
                        {activeMessageId === msg.id ? (
                          <>
                            <div className="message-list-frame-icon">
                              <FaMinus size={14} />
                            </div>
                            <p className="message-list-btn-text">hide replies</p>
                          </>
                        ) : (
                          <>
                            <div className="message-list-frame-icon">
                              <FaPlus size={14} />
                            </div>
                            <p className="message-list-btn-text">more replies</p>
                          </>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-box">
              <div className="message-scroll">
                <div className="message-list">
                  {messages.map((msg) => (
                    <li className="message-wrapp" key={msg.id}>
                      <div className="message-top-section">
                        <div
                          className="message-avatar"
                          onClick={() => navigate(`/author/${msg.senderId}`)}
                        >
                          {msg.senderAvatar ? (
                            <img src={msg.senderAvatar} alt="Avatar" />
                          ) : (
                            <div className="message-avatar-initial">
                              {msg.senderNickname
                                ? msg.senderNickname.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                          )}
                        </div>

                        <div className="message-context-box">
                          <div className="message-content">
                            <div className="message-info">
                              <p className="message-author">{msg.senderNickname}</p>
                              <p className="message-date">
                                {msg.createdAt && msg.createdAt.toDate
                                  ? msg.createdAt.toDate().toLocaleString("ru-RU", {
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

                            <p className="message-text">{msg.message}</p>

                            {msg.gif && (
                              <div
                                className="message-media"
                                onClick={() => {
                                  setModalImageUrl(msg.gif);
                                  setIsModalImage(true);
                                }}
                              >
                                <img src={msg.gif} alt="gif" />
                              </div>
                            )}

                            {msg.image && (
                              <div
                                className="message-media"
                                onClick={() => {
                                  setModalImageUrl(msg.image);
                                  setIsModalImage(true);
                                }}
                              >
                                <img src={msg.image} alt="message" />
                              </div>
                            )}
                          </div>

                          {msg.senderId === user.uid && (
                            <div className="message-btn-box">
                              <button
                                className="message-btn"
                                onClick={() => {
                                  setIsEditing(true);
                                  setSelectedMessage(msg);
                                  setEditedText(msg.message);
                                }}
                              >
                                Edit message
                              </button>
                              <button
                                className="message-btn"
                                onClick={() => {
                                  setIsDeleting(true);
                                  setSelectedMessage(msg);
                                }}
                              >
                                Delete message
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isOwnerPage && (
                        <div className="message-center-section">
                          <button
                            className="message-options-btn"
                            onClick={() => toggleReplyList(msg.id)}
                          >
                            {activeMessageId === msg.id ? "Cancel reply" : "Reply to message"}
                          </button>
                        </div>
                      )}

                      {activeMessageId === msg.id && (
                        <div className="message-reply-container">
                          {showReplyForm && (
                            <AuthorMessReplyForm
                              replyToMessage={msg}
                              currentUser={{
                                uid: user.uid,
                                nickname: user.displayName,
                                avatar: user.photoURL,
                              }}
                            />
                          )}
                          <AuthorMessReplyList messageId={msg.id} />
                        </div>
                      )}

                      <div className="message-bottom-section">
                        <span></span>
                        <button
                          className="message-list-btn"
                          onClick={() => toggleReplyList(msg.id)}
                        >
                          {activeMessageId === msg.id ? (
                            <>
                              <div className="message-list-frame-icon">
                                <FaMinus size={14} />
                              </div>
                              <p className="message-list-btn-text">hide replies</p>
                            </>
                          ) : (
                            <>
                              <div className="message-list-frame-icon">
                                <FaPlus size={14} />
                              </div>
                              <p className="message-list-btn-text">more replies</p>
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <ModalEdit
              text={editedText}
              onTextChange={setEditedText}
              onSave={() => handleUpdate(selectedMessage.id)}
              onCancel={() => {
                setIsEditing(false);
                setSelectedMessage(null);
                setEditedText("");
              }}
            />
          )}

          {isDeleting && (
            <ModalDelete
              onConfirm={() => {
                handleDelete(selectedMessage.id);
                setIsDeleting(false);
                setSelectedMessage(null);
              }}
              onCancel={() => {
                setIsDeleting(false);
                setSelectedMessage(null);
              }}
            />
          )}

          {isModalImage && (
            <ModalImageBig
              imageUrl={modalImageUrl}
              onClose={() => setIsModalImage(false)}
              isOpen={isModalImage}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AuthorMessagesList;
