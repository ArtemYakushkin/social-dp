import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { useMediaQuery } from 'react-responsive';

import { db } from '../../firebase';
import { useAuth } from '../../auth/useAuth';
import { editReply, deleteReply } from '../../utils/messageReplyListUtils';

import MessageReplyItem from './MessageReplyItem';
import ModalEdit from '../ModalEdit';
import ModalDelete from '../ModalDelete';
import ModalImageBig from '../ModalImageBig';

const MessageReplyList = ({ messageId }) => {
  const { user: currentUser } = useAuth();

  const [replies, setReplies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isModalImage, setIsModalImage] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    if (!messageId) return;

    const q = query(
      collection(db, 'authorMessageReplies'),
      where('replyToMessageId', '==', messageId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReplies(items);
    });

    return () => unsubscribe();
  }, [messageId]);

  const handleEditReply = async () => {
    if (!selectedReply || !editedText.trim()) return;
    await editReply(selectedReply.id, editedText);
    setIsEditing(false);
    setSelectedReply(null);
    setEditedText('');
  };

  const handleDeleteReply = async (id) => {
    await deleteReply(id);
  };

  return (
    <>
      {replies.length === 0 ? (
        <p className="notRegText">There is no responses to the message.</p>
      ) : (
        <div className="reply-list">
          {replies.map((reply) => (
            <MessageReplyItem
              key={reply.id}
              reply={reply}
              isMobile={isMobile}
              currentUser={currentUser}
              setIsEditing={setIsEditing}
              setSelectedReply={setSelectedReply}
              setEditedText={setEditedText}
              setIsDeleting={setIsDeleting}
              setModalImageUrl={setModalImageUrl}
              setIsModalImage={setIsModalImage}
            />
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
            setEditedText('');
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

export default MessageReplyList;
