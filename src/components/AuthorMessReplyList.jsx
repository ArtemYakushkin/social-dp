import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";
import { useAuth } from "../auth/useAuth";

import ModalEdit from "./ModalEdit";
import ModalDelete from "./ModalDelete";
import ModalImageBig from "../components/ModalImageBig";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import "../styles/AuthorMessReplyList.css";

const AuthorMessReplyList = ({ messageId }) => {
  const { user: currentUser } = useAuth();

  const [replies, setReplies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isModalImage, setIsModalImage] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    if (!messageId) return;

    const q = query(
      collection(db, "authorMessageReplies"),
      where("replyToMessageId", "==", messageId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReplies(items);
    });

    return () => unsubscribe();
  }, [messageId]);

  const handleEditReply = async () => {
    if (!selectedReply || !editedText.trim()) return;

    await updateDoc(doc(db, "authorMessageReplies", selectedReply.id), {
      text: editedText.trim(),
    });

    setIsEditing(false);
    setSelectedReply(null);
    setEditedText("");
  };

  const handleDeleteReply = async (id) => {
    await deleteDoc(doc(db, "authorMessageReplies", id));
  };

  return (
    <>
      {replies.length === 0 ? (
        <p className="author-reply-no-response">There is no response to the message.</p>
      ) : (
        <div className="author-reply-list">
          {replies.map((reply) => (
            <>
              {isMobile ? (
                <div key={reply.id} className="author-reply-item">
                  <span></span>

                  <div className="author-reply-list-top">
                    <div className="author-reply-list-avatar">
                      {reply.from.avatar ||
                      (reply.from.nickname && reply.from.nickname.charAt(0).toUpperCase()) ? (
                        typeof reply.from.avatar === "string" && reply.from.avatar.length > 1 ? (
                          <img src={reply.from.avatar} alt="Avatar" />
                        ) : (
                          <div className="author-reply-list-avatar-initial">
                            {reply.from.avatar}
                          </div>
                        )
                      ) : (
                        <div className="author-reply-list-avatar-initial">U</div>
                      )}
                    </div>

                    <div className="author-reply-list-right">
                      <div className="author-reply-list-content">
                        <div className="author-reply-list-author">
                          <p className="author-reply-list-nikname">{reply.from.nickname}</p>
                          {reply.from.uid === currentUser?.uid && (
                            <div className="author-reply-list-bottom">
                              <button
                                className="author-reply-list-options-btn"
                                onClick={() => {
                                  setIsEditing(true);
                                  setSelectedReply(reply);
                                  setEditedText(reply.text);
                                }}
                              >
                                <AiOutlineEdit size={20} />
                              </button>
                              <button
                                className="author-reply-list-options-btn"
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
                        <p className="author-reply-list-date">
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
                        <p className="author-reply-list-text">{reply.text}</p>

                        {reply.gif && (
                          <div className="author-reply-media">
                            <img src={reply.gif} alt="gif" />
                          </div>
                        )}

                        {reply.image && (
                          <div className="author-reply-media">
                            <img src={reply.image} alt="reply" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={reply.id} className="author-reply-item">
                  <span></span>

                  <div className="author-reply-list-top">
                    <div className="author-reply-list-avatar">
                      {reply.from.avatar ||
                      (reply.from.nickname && reply.from.nickname.charAt(0).toUpperCase()) ? (
                        typeof reply.from.avatar === "string" && reply.from.avatar.length > 1 ? (
                          <img src={reply.from.avatar} alt="Avatar" />
                        ) : (
                          <div className="author-reply-list-avatar-initial">
                            {reply.from.avatar}
                          </div>
                        )
                      ) : (
                        <div className="author-reply-list-avatar-initial">U</div>
                      )}
                    </div>

                    <div className="author-reply-list-right">
                      <div className="author-reply-list-content">
                        <div className="author-reply-list-author">
                          <p className="author-reply-list-nikname">{reply.from.nickname}</p>
                          <p className="author-reply-list-date">
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
                        <p className="author-reply-list-text">{reply.text}</p>

                        {reply.gif && (
                          <div
                            className="author-reply-media"
                            onClick={() => {
                              setModalImageUrl(reply.gif);
                              setIsModalImage(true);
                            }}
                          >
                            <img src={reply.gif} alt="gif" />
                          </div>
                        )}

                        {reply.image && (
                          <div
                            className="author-reply-media"
                            onClick={() => {
                              setModalImageUrl(reply.image);
                              setIsModalImage(true);
                            }}
                          >
                            <img src={reply.image} alt="reply" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {reply.from.uid === currentUser?.uid && (
                    <div className="author-reply-list-bottom">
                      <button
                        className="author-reply-list-options-btn"
                        onClick={() => {
                          setIsEditing(true);
                          setSelectedReply(reply);
                          setEditedText(reply.text);
                        }}
                      >
                        Edit Reply
                      </button>
                      <button
                        className="author-reply-list-options-btn"
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
            </>
          ))}
        </div>
      )}

      {isEditing && (
        <ModalEdit
          text={editedText}
          onTextChange={setEditedText}
          onSave={handleEditReply}
          onCancel={() => {
            setIsEditing(false);
            setSelectedReply(null);
            setEditedText("");
          }}
        />
      )}

      {isDeleting && (
        <ModalDelete
          onConfirm={() => {
            handleDeleteReply(selectedReply.id);
            setIsDeleting(false);
            setSelectedReply(null);
          }}
          onCancel={() => {
            setIsDeleting(false);
            setSelectedReply(null);
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
  );
};

export default AuthorMessReplyList;
