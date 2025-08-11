import React, { useState, useEffect } from "react";

import { db } from "../../firebase";

import { fetchAllPosts, searchPosts, sortPosts, seeMorePosts } from "../../utils/postUtils";

import Hero from "../../components/Hero/Hero";
import Options from "../../components/Options/Options";
import PostsList from "../../components/PostsList/PostsList";
import AboutProject from "../../components/AboutProject/AboutProject";
import ShareBlok from "../../components/ShareBlok/ShareBlok";

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
    fetchAllPosts(db, setPosts, setFilteredPosts, setIsLoading);
  }, []);

  useEffect(() => {
    localStorage.setItem("visibleCount", visibleCount);
  }, [visibleCount]);

  const currentPosts = filteredPosts.slice(0, visibleCount);

  return (
    <>
      <Hero />

      <Options
        onSearch={(query) => searchPosts(query, posts, setFilteredPosts, setVisibleCount)}
        onSort={(option) => sortPosts(option, filteredPosts, setFilteredPosts, setVisibleCount)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <PostsList
        posts={currentPosts}
        isLoading={isLoading}
        viewMode={viewMode}
        onSeeMore={() => seeMorePosts(visibleCount, setVisibleCount, postsPerPage)}
        showSeeMore={visibleCount < filteredPosts.length}
      />

      <AboutProject />

      <ShareBlok />
    </>
  );
};

export default HomePage;
