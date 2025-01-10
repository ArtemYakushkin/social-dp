import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "../firebase";
import { useAuth } from "../auth/useAuth";

import ExpandedPost from "./ExpandedPost";
import CollapsedPost from "./CollapsedPost";

const PostCard = ({ post, isExpanded, onExpand }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?.uid));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [viewsCount, setViewsCount] = useState(post.views || 0);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    setLiked(post.likes.includes(user?.uid));
    setLikesCount(post.likes.length);
  }, [post.likes, user?.uid]);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const authorRef = doc(db, "users", post.author.uid);
        const authorSnap = await getDoc(authorRef);

        if (authorSnap.exists()) {
          const authorData = authorSnap.data();
          setAuthor(authorData);
        } else {
          console.error("Author not found");
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };

    if (post.author?.uid) {
      fetchAuthorData();
    }
  }, [post.author?.uid]);

  const handleLike = async () => {
    if (!user || !user.uid) {
      alert("You need to be logged in to like a post.");
      return;
    }

    const postRef = doc(db, "posts", post.id);
    const userRef = doc(db, "users", user.uid);

    try {
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) {
        throw new Error("Post not found.");
      }

      const postData = postSnap.data();
      const isLiked = postData.likes.includes(user.uid);

      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      await updateDoc(userRef, {
        likedPosts: isLiked ? arrayRemove(post.id) : arrayUnion(post.id),
      });

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

    if (!currentUser) {
      return;
    }

    try {
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const currentViews = postSnapshot.data().views || 0;

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

  const handleExpand = () => {
    handleView();
    onExpand();
  };

  return isExpanded ? (
    <ExpandedPost
      user={user}
      post={post}
      author={author}
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
      author={author}
      liked={liked}
      likesCount={likesCount}
      viewsCount={viewsCount}
      handleLike={handleLike}
      handleExpand={handleExpand}
    />
  );
};

export default PostCard;
