import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  // addDoc,
  // collection,
  // serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../auth/useAuth";
import { IoHeartSharp, IoEye, IoChatboxEllipsesSharp } from "react-icons/io5";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// import { toast } from "react-toastify";
import Quiz from "../Quiz/Quiz";
import Poll from "../Poll/Poll";
import CommentsForm from "../CommentsForm/CommentsForm";
import CommentsList from "../CommentsList/CommentsList";
import "swiper/css";
import "swiper/css/pagination";
import "./PostCard.css";

const PostCard = ({ post, isExpanded, onExpand }) => {
  const { user } = useAuth(); // Достаем текущего пользователя
  const [liked, setLiked] = useState(post.likes.includes(user?.uid)); // Состояние лайка
  const [likesCount, setLikesCount] = useState(post.likes.length); // Состояние количества лайков
  // const [isExpanded, setIsExpanded] = useState(false); // Состояние раскрытия поста
  const [commentsVisible, setCommentsVisible] = useState(false);

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

  const toggleCommentsVisibility = () => {
    setCommentsVisible((prevState) => !prevState);
  };

  return (
    <>
      {isExpanded ? (
        <div className="postExp transition-post">
          <div className="postExp-top">
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
          <div className="postExp-center">
            <div className="postExp-title-box">
              <p className="postExp-title">{post.title}</p>
            </div>
            <div className="postExp-img">
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
            <div className="postExp-text-box">
              <p className="postExp-text">{post.text}</p>
            </div>
            <div className="postExp-exam-box">
              {post.quiz && post.quiz.question && post.quiz.answers && (
                <div className="postExp-quiz">
                  <Quiz quizData={post.quiz} />
                </div>
              )}

              {post.poll && (
                <div className="post-poll">
                  <Poll pollData={post.poll} postId={post.id} />
                </div>
              )}
            </div>
          </div>
          <div className="postExp-btn-viewComm-box">
            <button
              className="postExp-btn-viewComm"
              onClick={toggleCommentsVisibility}
            >
              {commentsVisible ? "Hide comments" : "View all comments..."}
            </button>
          </div>
          {commentsVisible && (
            <div className="postExp-comments-box">
              <div className="postExp-comments-scroll">
                <CommentsForm postId={post.id} />
                <CommentsList postId={post.id} user={user} />
              </div>
            </div>
          )}
          <div className="postExp-bottom">
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
            <button className="post-more-btn" onClick={onExpand}>
              <BsArrowsAngleContract size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="post transition-post">
          <div className="post-left">
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
                      <video autoPlay loop>
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
              <video autoPlay loop>
                <source src={post.media[0]} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            ) : (
              <img src={post.media[0]} alt="Post media" />
            )}
          </div>
          <div className="post-right">
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
            </div>
            <div className="post-bottom">
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
              <button className="post-more-btn" onClick={onExpand}>
                <BsArrowsAngleExpand size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
