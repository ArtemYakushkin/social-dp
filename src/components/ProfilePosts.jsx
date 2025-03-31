import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import Loader from "./Loader";

import "../styles/ProfilePosts.css";

const ProfilePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          let postObjects = userData.createdPosts || [];

          const postIds = postObjects.map((post) => post.id).filter(Boolean);

          if (postIds.length === 0) {
            setPosts([]);
            setLoading(false);
            return;
          }

          const postPromises = postIds.map(async (postId) => {
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);
            return postSnap.exists() ? { id: postSnap.id, ...postSnap.data() } : null;
          });

          const postResults = await Promise.all(postPromises);
          setPosts(postResults.filter((post) => post !== null));
        }
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  return (
    <div className="pp">
      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className="pp-no-posts">No posts yet.</p>
      ) : (
        <ul className="pp-list">
          {posts.reverse().map((post) => (
            <li key={post.id} className="pp-item">
              <Link to={`/post/${post.id}`} className="pp-link">
                <div className="pp-image">
                  {post.media && post.media.length > 0 && <img src={post.media[0]} alt="Post" />}
                </div>
                <div className="pp-content">
                  <p className="pp-date">{new Date(post.createdAt).toLocaleDateString()}</p>
                  <h3 className="pp-title">{post.title}</h3>
                  <p className="pp-text">{post.text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfilePosts;
