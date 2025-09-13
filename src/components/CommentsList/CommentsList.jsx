import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { useMediaQuery } from 'react-responsive';

import { db } from '../../firebase';

import Loader from '../Loader';
import UnregisteredModal from '../UnregisteredModal';
import ModalEdit from '../ModalEdit';
import ModalDelete from '../ModalDelete';
import CommentsItem from './CommentsItem';

import {handleLike, handleSaveEdit, handleConfirmDelete} from '../../utils/commentsUtils';

const CommentsList = ({ postId, user, onCommentDeleted }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCommentId, setActiveCommentId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedComments = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const authorRef = doc(db, 'users', data.author.id);
        const authorSnap = await getDoc(authorRef);
        const authorData = authorSnap.exists()
          ? authorSnap.data()
          : { avatar: null, nickname: 'Unknown Author' };

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

  const toggleReplyList = (commentId) => {
    setActiveCommentId((prev) => (prev === commentId ? null : commentId));
  };

  if (loading) return <Loader />;

  if (comments.length === 0) {
    return (
      <div className="container">
        <p className="notRegText">There are no comments yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="entry-list">
        {comments.map((comment) => (
          <CommentsItem
            key={comment.id}
            comment={comment}
            user={user}
            postId={postId}
            activeCommentId={activeCommentId}
            toggleReplyList={toggleReplyList}
            setIsEditing={setIsEditing}
            setIsDeleting={setIsDeleting}
            setSelectedComment={setSelectedComment}
            setEditedText={setEditedText}
            handleLike={(id, likes) => handleLike({ user, commentId: id, likes, setIsModalOpen })}
            isMobile={isMobile}
          />
        ))}

        {isEditing && selectedComment && (
          <ModalEdit
            text={editedText}
            onTextChange={setEditedText}
            onSave={() =>
              handleSaveEdit({
                selectedComment,
                editedText,
                setComments,
                setIsEditing,
                setSelectedComment,
                setEditedText,
              })
            }
            onCancel={() => {
              setIsEditing(false);
              setSelectedComment(null);
            }}
          />
        )}

        {isDeleting && selectedComment && (
          <ModalDelete
            onConfirm={() =>
              handleConfirmDelete({
                selectedComment,
                postId,
                setComments,
                onCommentDeleted,
                setIsDeleting,
                setSelectedComment,
              })
            }
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
