import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import Loader from "./Loader";
import OptionsProfilePosts from "./OptionsProfilePosts";

import { FaRegHeart } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { BiComment } from "react-icons/bi";
import { RiInformationLine } from "react-icons/ri";

import "../styles/ProfilePosts.css";

const ProfilePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("New");

  const handleSearchChange = (query) => setSearchQuery(query);

  const handleSortChange = (option) => setSortOption(option);

  const filteredPosts = useMemo(() => {
    return posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === "New") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOption === "Comment") {
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        } else if (sortOption === "Like") {
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        } else {
          return 0;
        }
      });
  }, [posts, searchQuery, sortOption]);

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
    <>
      <OptionsProfilePosts
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedOption={sortOption}
        onSortChange={handleSortChange}
      />

      <div className="pp">
        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <div className="pp-no-posts-box">
            <RiInformationLine size={24} />
            <p className="pp-no-posts">You don't have any posts yet.</p>
          </div>
        ) : (
          <ul className="pp-list">
            {filteredPosts.map((post) => (
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

                  <div className="pp-line">
                    <div></div>
                  </div>

                  <div className="pp-icon-box">
                    <div className="pp-icon">
                      <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="pp-icon">
                      <FiEye size={24} style={{ color: "var(--text-black)" }} />
                      <span>{post.views}</span>
                    </div>
                    <div className="pp-icon">
                      <BiComment size={24} style={{ color: "var(--text-black)" }} />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProfilePosts;
