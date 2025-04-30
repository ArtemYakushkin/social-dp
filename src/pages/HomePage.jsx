import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { db } from "../firebase";

import Hero from "../components/Hero";
import Options from "../components/Options";
import PostCard from "../components/PostCard";
import AboutProject from "../components/AboutProject";
import ShareBlok from "../components/ShareBlok";
import Loader from "../components/Loader";

import "../styles/HomePage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "grid";
  });
  const [visibleCount, setVisibleCount] = useState(() => {
    const savedCount = localStorage.getItem("visibleCount");
    return savedCount ? parseInt(savedCount, 10) : 6;
  });

  const postsPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
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
    setVisibleCount(6);
  };

  const handleSort = (sortOption) => {
    const sortedPosts = [...filteredPosts];
    if (sortOption === "Comment") {
      sortedPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    } else if (sortOption === "Like") {
      sortedPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (sortOption === "New") {
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
    setVisibleCount(6);
  };

  const currentPosts = filteredPosts.slice(0, visibleCount);

  const handleSeeMore = () => {
    const newCount = visibleCount + postsPerPage;
    setVisibleCount(newCount);
  };

  useEffect(() => {
    localStorage.setItem("visibleCount", visibleCount);
  }, [visibleCount]);

  return (
    <div className="home">
      <div className="container">
        <Hero />

        <Options
          onSearch={handleSearch}
          onSort={handleSort}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className={viewMode === "grid" ? "home-list-grid" : "home-list-list"}>
          {isLoading ? (
            <Loader />
          ) : currentPosts.length > 0 ? (
            currentPosts.map((post) => <PostCard key={post.id} post={post} viewMode={viewMode} />)
          ) : (
            <h3 className="home-no-post-text">No posts found</h3>
          )}
        </div>

        {!isLoading && visibleCount < filteredPosts.length && (
          <div className="home-see-more-container">
            <button className="home-btn-see-more" onClick={handleSeeMore}>
              See more
            </button>
          </div>
        )}
      </div>

      <AboutProject />
      <ShareBlok />
    </div>
  );
};

export default HomePage;
