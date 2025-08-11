import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../auth/useAuth";
import { deleteMessageById, updateMessageText } from "../../utils/messageUtils";

import MessageItem from "./MessageItem";
import ModalImageBig from "../ModalImageBig";
import ModalEdit from "../ModalEdit";
import ModalDelete from "../ModalDelete";

const MessagesList = ({ authorId, showReplyForm = false, isOwnerPage = false }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isModalImage, setIsModalImage] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

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
    await deleteMessageById(messageId);
  };

  const handleUpdate = async (messageId) => {
    if (!editedText.trim()) return;
    await updateMessageText(messageId, editedText);
    setIsEditing(false);
    setSelectedMessage(null);
    setEditedText("");
  };

  return (
    <>
      {user && messages.length > 0 ? (
        <div className="container">
          <div className="entry">
            <div className="entry-scroll">
              <div className="entry-list">
                {messages.map((msg) => (
                  <MessageItem
                    key={msg.id}
                    msg={msg}
                    user={user}
                    isOwnerPage={isOwnerPage}
                    activeMessageId={activeMessageId}
                    toggleReplyList={toggleReplyList}
                    setModalImageUrl={setModalImageUrl}
                    setIsModalImage={setIsModalImage}
                    showReplyForm={showReplyForm}
                    onEdit={(message) => {
                      setIsEditing(true);
                      setSelectedMessage(message);
                      setEditedText(message.message);
                    }}
                    onDelete={(message) => {
                      setIsDeleting(true);
                      setSelectedMessage(message);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

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
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MessagesList;
