import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { useAuth } from "../../auth/useAuth";
import ExpandedPost from "../ExpandedPost/ExpandedPost";
import CollapsedPost from "../CollapsedPost/CollapsedPost";

const PostCard = ({ post, isExpanded, onExpand }) => {
  const { user } = useAuth(); // Достаем текущего пользователя
  const [liked, setLiked] = useState(post.likes.includes(user?.uid)); // Состояние лайка
  const [likesCount, setLikesCount] = useState(post.likes.length); // Состояние количества лайков
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [viewsCount, setViewsCount] = useState(post.views || 0);

  useEffect(() => {
    setLiked(post.likes.includes(user?.uid));
    setLikesCount(post.likes.length);
  }, [post.likes, user?.uid]);

  const handleLike = async () => {
    if (!user || !user.uid) {
      alert("You need to be logged in to like a post.");
      return;
    }

    const postRef = doc(db, "posts", post.id);
    const userRef = doc(db, "users", user.uid);

    try {
      // Получаем текущие данные поста
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) {
        throw new Error("Post not found.");
      }

      const postData = postSnap.data();
      const isLiked = postData.likes.includes(user.uid);

      // Обновляем пост
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      // Обновляем пользователя
      await updateDoc(userRef, {
        likedPosts: isLiked ? arrayRemove(post.id) : arrayUnion(post.id),
      });

      // Обновляем локальное состояние
      setLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleView = async () => {
    const postRef = doc(db, "posts", post.id);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Проверяем, авторизован ли пользователь
    if (!currentUser) {
      return; // Если пользователь не авторизован, выходим из функции
    }

    try {
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const currentViews = postSnapshot.data().views || 0;

        // Обновляем только если новое значение больше текущего
        await updateDoc(postRef, {
          views: currentViews + 1,
        });
        setViewsCount(currentViews + 1);
      } else {
        console.error("Post not found");
      }
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  const toggleCommentsVisibility = () => {
    setCommentsVisible((prevState) => !prevState);
  };

  // const handleSlideChange = (swiper) => {
  //   setIsBeginning(swiper.isBeginning);
  //   setIsEnd(swiper.isEnd);
  // };

  const handleExpand = () => {
    handleView(); // Увеличить просмотры при разворачивании
    onExpand(); // Вызвать переданную функцию onExpand
  };

  return isExpanded ? (
    <ExpandedPost
      user={user}
      post={post}
      liked={liked}
      likesCount={likesCount}
      viewsCount={viewsCount}
      commentsVisible={commentsVisible}
      toggleCommentsVisibility={toggleCommentsVisibility}
      handleLike={handleLike}
      onExpand={onExpand}
    />
  ) : (
    <CollapsedPost
      post={post}
      liked={liked}
      likesCount={likesCount}
      viewsCount={viewsCount}
      handleLike={handleLike}
      handleExpand={handleExpand}
    />
  );
};

export default PostCard;
