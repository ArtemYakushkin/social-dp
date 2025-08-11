import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MediaCarousel from "../MediaCarousel/MediaCarousel";

import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { BiComment } from "react-icons/bi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";

import { fetchSavedStatus, savePost } from "../../utils/postUtils";

const GridPost = ({ post, liked, likesCount, viewsCount, handleLike, author }) => {
  const auth = getAuth();
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSaved = async () => {
      const user = auth.currentUser;
      const result = await fetchSavedStatus(user, post.id);
      setIsSaved(result);
    };

    checkSaved();
  }, [post.id, auth.currentUser]);

  const handleAvatarClick = () => {
    navigate(`/author/${post.author.uid}`);
  };

  const handleExpandClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleSavePost = () => {
    const user = auth.currentUser;
    if (!user) {
      toast.info("You must be registered to save posts.");
      return;
    }

    if (isSaved) return;

    savePost(user, post.id, setIsSaved);
  };

  return (
    <div className="grid">
      <div className="grid-header">
        <div className="grid-avatar avatarLarge" onClick={handleAvatarClick}>
          {author?.avatar ? (
            <img src={author.avatar} alt="Post author" />
          ) : (
            <div className="grid-avatar-placeholder">
              {author?.nickname ? author.nickname.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <div className="grid-info-post">
          <p className="nicknameText" onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
            {author?.nickname || "Unknown Author"}
          </p>
          <p className="dateText">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid-content">
        <div className="grid-image">
          {post.media.length > 1 ? (
            <MediaCarousel media={post.media} />
          ) : Array.isArray(post.media) && post.media[0]?.includes(".mp4") ? (
            <video autoPlay loop>
              <source src={post.media[0]} type="video/mp4" />
              Your browser does not support video.
            </video>
          ) : (
            <img src={post.media[0]} alt="Post media" />
          )}
        </div>
        <div className="grid-box-text" onClick={handleExpandClick}>
          <p className="grid-title postTitle">{post.title}</p>
          <p className="grid-text nicknameText">{post.text}</p>
          <div className="grid-more-box">
            <span className="grid-more">More</span>
          </div>
        </div>
      </div>

      <div className="grid-bottom">
        <div className="grid-line">
          <div></div>
        </div>

        <div className="grid-footer">
          <div className="grid-icon-box">
            <button className="grid-icon" onClick={handleLike}>
              {liked ? (
                <FaHeart size={24} style={{ color: "var(--text-error)" }} />
              ) : (
                <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
              )}
              <span>{likesCount}</span>
            </button>
            <div className="grid-icon">
              <FiEye size={24} style={{ color: "var(--text-black)" }} />
              <span>{viewsCount}</span>
            </div>
            <div className="grid-icon">
              <BiComment size={24} style={{ color: "var(--text-black)" }} />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>

          <button
            className="grid-btn-saved"
            onClick={() => {
              if (!auth.currentUser) {
                toast.info("You must be registered to save posts.");
              } else if (!isSaved) {
                handleSavePost();
              }
            }}
            style={{
              cursor: !auth.currentUser || isSaved ? "not-allowed" : "pointer",
            }}
          >
            {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GridPost;
