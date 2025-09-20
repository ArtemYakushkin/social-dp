import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../../firebase';
import { handleEditReply, handleDeleteReply } from '../../utils/commentsReplyListUtils';

import CommentsReplyItem from './CommentsReplyItem';
import ModalEdit from '../ModalEdit';
import ModalDelete from '../ModalDelete';
import Loader from '../Loader';

const CommentsReplyList = ({ commentId, currentUser }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    const repliesQuery = query(collection(db, 'replys'), where('commentId', '==', commentId));
    const unsubscribe = onSnapshot(repliesQuery, async (snapshot) => {
      const repliesData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const reply = docSnap.data();
          const userDoc = await getDoc(doc(db, 'users', reply.author.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          return {
            id: docSnap.id,
            ...reply,
            author: {
              ...reply.author,
              nickname: userData.nickname || 'Unknown User',
              avatar: userData.avatar || null,
            },
          };
        })
      );
      setReplies(
        repliesData
          .filter((reply) => reply.createdAt)
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [commentId]);

  if (loading) return <Loader />;

  if (replies.length === 0)
    return (
      <div className="container">
        <p className="notRegText">No replies yet.</p>
      </div>
    );

  return (
    <div className="reply-list">
      {replies.map((reply) => (
        <CommentsReplyItem
          key={reply.id}
          reply={reply}
          currentUser={currentUser}
          setIsEditing={setIsEditing}
          setIsDeleting={setIsDeleting}
          setSelectedReply={setSelectedReply}
          setEditedText={setEditedText}
        />
      ))}

      {isEditing && (
        <ModalEdit
          text={editedText}
          onTextChange={setEditedText}
          onSave={() =>
            handleEditReply({
              selectedReply,
              editedText,
              setReplies,
              setIsEditing,
              setSelectedReply,
            })
          }
          onCancel={() => {
            setIsEditing(false);
            setSelectedReply(null);
          }}
        />
      )}

      {isDeleting && (
        <ModalDelete
          onConfirm={() =>
            handleDeleteReply({
              replyId: selectedReply.id,
              setReplies,
              setIsDeleting,
              setSelectedReply,
            })
          }
          onCancel={() => {
            setIsDeleting(false);
            setSelectedReply(null);
          }}
        />
      )}
    </div>
  );
};

export default CommentsReplyList;
