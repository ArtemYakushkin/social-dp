import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { db } from '../firebase';
import { useAuth } from '../auth/useAuth';
import { fetchSavedStatus, savePost } from '../utils/postUtils';

export const usePostDetails = () => {
  const { postId } = useParams();
  const auth = getAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1259px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) throw new Error('Invalid post ID.');

        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          setPost(postData);

          setLikesCount(postData.likes?.length || 0);
          setLiked(postData.likes?.includes(user?.uid) || false);

          if (user?.uid) {
            await updateDoc(postRef, { views: (postData.views || 0) + 1 });
          }

          const authorRef = doc(db, 'users', postData.author.uid);
          const authorSnap = await getDoc(authorRef);

          if (authorSnap.exists()) {
            setAuthor(authorSnap.data());
          } else {
            console.warn('Author not found.');
          }
        } else {
          throw new Error('Post not found.');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
      }
    };

    fetchPost();
  }, [postId, user?.uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'posts', postId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedPost = docSnapshot.data();
        setCommentsCount(updatedPost.comments?.length || 0);
      }
    });

    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    const checkSaved = async () => {
      const user = auth.currentUser;
      const result = await fetchSavedStatus(user, postId);
      setIsSaved(result);
    };

    checkSaved();
  }, [postId, auth.currentUser]);

  const handleLike = async () => {
    if (!user?.uid) {
      setIsModalOpen(true);
      return;
    }

    const postRef = doc(db, 'posts', postId);
    try {
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) throw new Error('Post not found.');

      const postData = postSnap.data();
      const isLiked = postData.likes?.includes(user.uid);

      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      setLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleSavePost = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.info('You must be registered to save posts.');
      return;
    }

    if (isSaved) return;
    savePost(currentUser, postId, setIsSaved);
  };

  const handleBack = () => {
    navigate('/', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => navigate(-1);

  const handleAvatarClick = () => {
    if (post?.author?.uid) navigate(`/author/${post.author.uid}`);
  };

  const toggleCommentsVisibility = () => setCommentsVisible((prev) => !prev);

  const handleCommentAdded = () => setCommentsCount((prev) => prev + 1);

  const handleCommentDeleted = () => setCommentsCount((prev) => Math.max(prev - 1, 0));

  const handleEditPost = () => {
    navigate(`/edit-post/${postId}`);
  };

  return {
    auth,
    post,
    author,
    error,
    commentsVisible,
    commentsCount,
    isModalOpen,
    setIsModalOpen,
    liked,
    likesCount,
    isSaved,
    isTablet,
    isMobile,
    handleLike,
    handleSavePost,
    handleBack,
    handleGoBack,
    handleAvatarClick,
    toggleCommentsVisibility,
    handleCommentAdded,
    handleCommentDeleted,
    handleEditPost,
    user,
    postId,
  };
};
