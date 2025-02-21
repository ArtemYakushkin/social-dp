import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../auth/useAuth";

import ExpandedPost from "./ExpandedPost";
import CollapsedPost from "./CollapsedPost";
import UnregisteredModal from "./UnregisteredModal";

const PostCard = ({ post, isExpanded, onExpand, viewMode }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?.uid));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [viewsCount, setViewsCount] = useState(post.views || 0);
  const [author, setAuthor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(true);
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

  return (
    <>
      {viewMode === "grid" ? (
        <ExpandedPost
          post={post}
          author={author}
          liked={liked}
          likesCount={likesCount}
          viewsCount={viewsCount}
          handleLike={handleLike}
        />
      ) : (
        <CollapsedPost
          post={post}
          author={author}
          liked={liked}
          likesCount={likesCount}
          viewsCount={viewsCount}
          handleLike={handleLike}
        />
      )}

      <UnregisteredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default PostCard;
