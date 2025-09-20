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

const FlexPost = ({ post, liked, likesCount, viewsCount, handleLike, author }) => {
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
    <div className="flex">
      <div className="flex-left">
        {post.media.length > 1 ? (
          <MediaCarousel media={post.media} />
        ) : post.media[0].includes(".mp4") ? (
          <video autoPlay loop muted playsInline>
            <source src={post.media[0]} type="video/mp4" />
            Your browser does not support video.
          </video>
        ) : (
          <img src={post.media[0]} alt="Post media" />
        )}
      </div>

      <div className="flex-right">
        <div className="flex-header">
          <div className="flex-avatar avatarSmall" onClick={handleAvatarClick}>
            {author?.avatar ? (
              <img src={author.avatar} alt="Post author" />
            ) : (
              <div className="flex-avatar-placeholder">
                {author?.nickname ? author.nickname.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <p className="flex-author nicknameText" onClick={handleAvatarClick}>
            {author?.nickname || "Unknown Author"}
          </p>
          <p className="dateText">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex-center" onClick={handleExpandClick}>
          <p className="flex-title postTitle">{post.title}</p>
          <p className="flex-text nicknameText">{post.text}</p>
        </div>

        <div className="flex-bottom">
          <div className="flex-icons">
            <button className="flex-icon" onClick={handleLike}>
              {liked ? (
                <FaHeart size={24} style={{ color: "var(--text-error)" }} />
              ) : (
                <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
              )}
              <span>{likesCount}</span>
            </button>
            <div className="flex-icon">
              <FiEye size={24} style={{ color: "var(--text-black)" }} />
              <span>{viewsCount}</span>
            </div>
            <div className="flex-icon">
              <BiComment size={24} style={{ color: "var(--text-black)" }} />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
          <div className="flex-bottom-right">
            <button
              className="flex-btn-saved"
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

            <button className="btnSmallFill" onClick={handleExpandClick}>
              Read more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlexPost;
