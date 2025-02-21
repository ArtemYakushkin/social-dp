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

import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

import "../styles/HomePage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "grid";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

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

    setCurrentPage(1);
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

    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

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

        {!isLoading && totalPages > 1 && (
          <div className="home-pagination">
            <button
              className="home-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <HiArrowLongLeft size={34} />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
                className={currentPage === index + 1 ? "home-btn-number-active" : "home-btn-number"}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="home-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <HiArrowLongRight size={34} />
            </button>
          </div>
        )}
      </div>

      <AboutProject />

      <ShareBlok />

      <Footer />
    </div>
  );
};

export default HomePage;
