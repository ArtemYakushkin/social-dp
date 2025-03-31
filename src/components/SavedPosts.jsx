import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import Loader from "./Loader";

import "../styles/SavedPosts.css";

const SavedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

              // Получаем данные автора
              const authorRef = doc(db, "users", postData.author.uid); // предполагается, что в посте есть поле authorId
              const authorSnap = await getDoc(authorRef);

              const authorData = authorSnap.exists() ? authorSnap.data() : null;

              // Возвращаем пост с данными автора
              return {
                id: postSnap.id,
                ...postData,
                author: authorData, // Добавляем информацию об авторе
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

  return (
    <div className="saved">
      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className="saved-no-posts">No posts yet.</p>
      ) : (
        <ul className="saved-list">
          {posts.reverse().map((post) => (
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
                      <p className="saved-date">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="saved-bottom">
                    <p className="saved-title">{post.title}</p>
                    <p className="saved-text">{post.text}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedPosts;
