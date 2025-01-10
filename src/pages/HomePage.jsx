import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { db } from "../firebase";

import Hero from "../components/Hero";
import Options from "../components/Options";
import PostCard from "../components/PostCard";
import AboutProject from "../components/AboutProject";
import ShareBlok from "../components/ShareBlok";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import "../styles/HomePage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAllPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));
        const postSnapshot = await getDocs(postsQuery);
        const allPosts = postSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(allPosts);
        setFilteredPosts(allPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при получении постов:", error);
      }
    };

    fetchAllPosts();
  }, []);

  const handleSearch = (searchQuery) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => post.title?.toLowerCase().includes(lowerCaseQuery));
    setFilteredPosts(filtered);
  };

  const handleSort = (sortOption) => {
    const sortedPosts = [...filteredPosts];
    if (sortOption === "Most commented") {
      sortedPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    } else if (sortOption === "Most liked") {
      sortedPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (sortOption === "Newest") {
      sortedPosts.sort((a, b) => {
        const dateA =
          a.createdAt instanceof Date
            ? a.createdAt.getTime()
            : a.createdAt?.toMillis?.() || Date.parse(a.createdAt) || 0;
        const dateB =
          b.createdAt instanceof Date
            ? b.createdAt.getTime()
            : b.createdAt?.toMillis?.() || Date.parse(b.createdAt) || 0;
        return dateB - dateA;
      });
    }
    setFilteredPosts(sortedPosts);
  };

  const handleExpand = (postId) => {
    setExpandedPostId(postId === expandedPostId ? null : postId);
  };

  return (
    <div className="home">
      <div className="container">
        <Hero />

        <Options onSearch={handleSearch} onSort={handleSort} />

        <div className="home-list">
          {isLoading ? (
            <Loader />
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isExpanded={expandedPostId === post.id}
                onExpand={() => handleExpand(post.id)}
              />
            ))
          ) : (
            <h3 className="home-no-post-text">No posts found</h3>
          )}
        </div>
      </div>

      <AboutProject />

      <ShareBlok />

      <Footer />
    </div>
  );
};

export default HomePage;
