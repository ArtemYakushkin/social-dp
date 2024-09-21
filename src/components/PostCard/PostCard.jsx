import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../auth/useAuth";
import { IoHeartSharp, IoEye, IoChatboxEllipsesSharp } from "react-icons/io5";
import { BsArrowsFullscreen } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./PostCard.css";

const PostCard = ({ post }) => {
  const { user } = useAuth(); // Достаем текущего пользователя
  const [liked, setLiked] = useState(post.likes.includes(user?.uid)); // Состояние лайка
  const [likesCount, setLikesCount] = useState(post.likes.length); // Состояние количества лайков

  useEffect(() => {
    setLiked(post.likes.includes(user?.uid));
    setLikesCount(post.likes.length);
  }, [post.likes, user?.uid]);

  const handleLike = async () => {
    if (!user || !user.uid) {
      alert("You need to be logged in to like a post.");
      return;
    }

    const postRef = doc(db, "posts", post.id);
    const userRef = doc(db, "users", user.uid);

    try {
      // Получаем текущие данные поста
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) {
        throw new Error("Post not found.");
      }

      const postData = postSnap.data();
      const isLiked = postData.likes.includes(user.uid);

      // Обновляем пост
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      // Обновляем пользователя
      await updateDoc(userRef, {
        likedPosts: isLiked ? arrayRemove(post.id) : arrayUnion(post.id),
      });

      // Обновляем локальное состояние
      setLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-avarar">
          <img src={post.author.avatar} alt="Post author" />
        </div>
        <p className="post-author">
          {post.author.nickname}
          <span className="post-date">
            | {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>
      <div className="post-center">
        <p className="post-title">{post.title}</p>
        <p className="post-text">{post.text}</p>
        <div className="post-img">
          {post.media.length > 1 ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }} // Активируем пагинацию
              modules={[Pagination]} // Добавляем модуль Pagination
              className="swiper-container"
            >
              {post.media.map((url, index) => (
                <SwiperSlide key={index}>
                  {url.includes(".mp4") ? (
                    <video controls>
                      <source src={url} type="video/mp4" />
                      Ваш браузер не поддерживает видео.
                    </video>
                  ) : (
                    <img src={url} alt={`Post media ${index}`} />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : post.media[0].includes(".mp4") ? (
            <video controls>
              <source src={post.media[0]} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          ) : (
            <img src={post.media[0]} alt="Post media" />
          )}
        </div>
      </div>
      <div className="post-footer">
        <div className="post-icons">
          <button className="post-icon" onClick={handleLike}>
            <IoHeartSharp size={20} color={liked ? "red" : "black"} />
            <span>{likesCount}</span>
          </button>
          <div className="post-icon">
            <IoEye size={20} />
            <span>{post.views}</span>
          </div>
          <div className="post-icon">
            <IoChatboxEllipsesSharp size={20} />
            <span>{post.comments?.length || 0}</span>
          </div>
        </div>
        <Link to={`/posts/${post.id}`} className="post-more-btn">
          <BsArrowsFullscreen size={18} />
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
