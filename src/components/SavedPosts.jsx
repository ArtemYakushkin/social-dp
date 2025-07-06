import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { toast } from "react-toastify";

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import { RiInformationLine } from "react-icons/ri";

import OptionsSavedPosts from "./OptionsSavedPosts";
import Loader from "./Loader";

import "../styles/SavedPosts.css";

const SavedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSavedPosts = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          let postObjects = userData.savedPosts || [];
          const postIds = postObjects.filter(Boolean);

          if (postIds.length === 0) {
            setPosts([]);
            setLoading(false);
            return;
          }

          const postPromises = postIds.map(async (postId) => {
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
              const postData = postSnap.data();

              const authorRef = doc(db, "users", postData.author.uid);
              const authorSnap = await getDoc(authorRef);
              const authorData = authorSnap.exists() ? authorSnap.data() : null;

              return {
                id: postSnap.id,
                ...postData,
                author: authorData,
              };
            }

            return null;
          });

          const postResults = await Promise.all(postPromises);
          setPosts(postResults.filter((post) => post !== null));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [user]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [posts, searchQuery, sortOrder]);

  const handleRemoveSavedPost = async (postId) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        savedPosts: arrayRemove(postId),
      });

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Post removed from saved items.");
    } catch (error) {
      console.error("Error removing saved post:", error);
      toast.error("Failed to remove the post.");
    }
  };

  return (
    <>
      <OptionsSavedPosts
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="saved">
        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <div className="saved-no-posts-box">
            <RiInformationLine size={24} />
            <p className="saved-no-posts">You haven't added anything to your Saved items yet.</p>
          </div>
        ) : (
          <ul className="saved-list">
            {filteredAndSortedPosts.reverse().map((post) => (
              <li className="saved-item" key={post.id}>
                <Link to={`/post/${post.id}`} className="saved-link">
                  <div className="saved-left">
                    {post.media && post.media.length > 0 && <img src={post.media[0]} alt="Post" />}
                  </div>

                  <div className="saved-right">
                    <div className="saved-header">
                      <div className="saved-avatar">
                        {post.author.avatar && <img src={post.author.avatar} alt="Author" />}
                      </div>
                      <div className="saved-author-info">
                        <p className="saved-nickname">{post.author.nickname}</p>
                        <p className="saved-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="saved-bottom">
                      <p className="saved-title">{post.title}</p>
                      <p className="saved-text">{post.text}</p>
                    </div>
                  </div>
                </Link>

                <div className="saved-remove-box">
                  <button
                    className="saved-remove-btn"
                    onClick={() => handleRemoveSavedPost(post.id)}
                    title="Remove from saved"
                  >
                    Delete post
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SavedPosts;
