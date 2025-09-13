import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { isEnglishOnly } from './validation';

export const notifyNewComment = async (postId, commentId, sender) => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const post = postSnap.data();

    if (post.author.uid !== sender.id) {
      await addDoc(collection(db, 'notifications'), {
        recipientId: post.author.uid,
        type: 'new_comment',
        postId,
        postTitle: post.title,
        commentId,
        sender,
        message: `${sender.nickname} commented on your post "${post.title}"`,
        createdAt: serverTimestamp(),
        read: false,
      });
    }
  }
};

export const handleCommentSubmit = async ({
  e,
  commentText,
  setError,
  user,
  postId,
  setCommentText,
  onCommentAdded,
}) => {
  e.preventDefault();
  setError('');

  if (!commentText.trim()) {
    setError('Comment cannot be empty.');
    return;
  }

  if (!isEnglishOnly(commentText)) {
    setError('Comment must contain only English letters and emojis.');
    return;
  }

  try {
    const commentData = {
      postId,
      text: commentText,
      createdAt: serverTimestamp(),
      likes: [],
      author: {
        id: user.uid,
      },
      replies: [],
    };

    const commentRef = await addDoc(collection(db, 'comments'), commentData);

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(commentRef.id),
    });

    await notifyNewComment(postId, commentRef.id, {
      id: user.uid,
      nickname: user.displayName,
      photoURL: user.photoURL,
    });

    setCommentText('');
    toast.success('Comment added successfully!');

    if (onCommentAdded) {
      onCommentAdded();
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    setError('Error sending comment');
  }
};

export const addEmoji = (emoji, setCommentText, setShowEmojiPicker) => {
  setCommentText((prev) => prev + emoji.native);
  setShowEmojiPicker(false);
};

export const handleRegisterClick = (user, setIsRegisterModalOpen, toast) => {
  if (user) {
    toast.info('You are already registered', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else {
    setIsRegisterModalOpen(true);
  }
};
