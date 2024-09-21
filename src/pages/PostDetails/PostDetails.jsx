import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../auth/useAuth";
import { IoHeartSharp, IoEye, IoChatboxEllipsesSharp } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { toast } from "react-toastify";
import Quiz from "../../components/Quiz/Quiz";
import Poll from "../../components/Poll/Poll";
import Loader from "../../components/Loader/Loader";
import CommentsForm from "../../components/CommentsForm/CommentsForm";
import CommentsList from "../../components/CommentsList/CommentsList";
import "./PostDetails.css";

// Компонент для отображения викторины

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Достаем текущего пользователя
  const [liked, setLiked] = useState(false); // Состояние лайка
  const [likesCount, setLikesCount] = useState(0); // Состояние количества лайков
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("You need to register before opening a post.");
      navigate("/login"); // Redirect to login page
      return; // Stop further execution
    }

    const fetchPost = async () => {
      try {
        if (!postId) {
          throw new Error("Invalid post ID.");
        }

        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          setPost(postData);

          // Обновляем количество просмотров
          await updateDoc(postRef, { views: (postData.views || 0) + 1 });
        } else {
          throw new Error("Post not found.");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      }
    };

    fetchPost();
  }, [postId, navigate, user]);

  useEffect(() => {
    if (post) {
      setLiked(post.likes?.includes(user?.uid)); // Проверяем, если массив likes существует
      setLikesCount(post.likes?.length || 0); // Проверяем длину массива likes
    }
  }, [post, user?.uid]);

  const handleLike = async () => {
    if (!user || !user.uid) {
      alert("You need to be logged in to like a post.");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      const userRef = doc(db, "users", user.uid);

      // Проверяем, лайкнул ли пользователь пост ранее
      const isLiked = post.likes.includes(user.uid);

      // Обновляем пост в Firestore
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      // Обновляем данные пользователя
      await updateDoc(userRef, {
        likedPosts: isLiked ? arrayRemove(postId) : arrayUnion(postId),
      });

      // Обновляем локальное состояние поста
      setPost((prevPost) => ({
        ...prevPost,
        likes: isLiked
          ? prevPost.likes.filter((uid) => uid !== user.uid) // Убираем UID
          : [...prevPost.likes, user.uid], // Добавляем UID
      }));

      // Обновляем состояние счетчика лайков
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      setLiked(!isLiked); // Инвертируем состояние лайка
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handlePollVote = async (answer) => {
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }

    try {
      // Создаем объект комментария
      const commentData = {
        postId,
        text: `Voted: ${answer}`, // Текст комментария
        createdAt: serverTimestamp(),
        likes: [],
        author: {
          avatar: user?.photoURL || "",
          nickname: user?.displayName || "",
        },
      };

      // Сохраняем комментарий в коллекции "comments"
      const commentRef = await addDoc(collection(db, "comments"), commentData);

      // Обновляем пост в Firestore, добавляя ссылку на комментарий
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef.id), // Добавляем ID комментария в пост
      });

      // Дополнительно можно обновить состояние комментариев локально, чтобы сразу отобразить их в интерфейсе
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, commentRef.id],
      }));

      toast.success("Your vote has been recorded and comment added!");
    } catch (error) {
      console.error("Error saving vote as comment:", error);
      toast.error("Failed to save vote as comment.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <Loader />;
  }

  const handleBack = () => {
    // Переход назад
    navigate(-1);
  };

  return (
    <div className="details">
      <div className="container">
        <div className="details-wrapp">
          <button onClick={handleBack}>Back</button>
          {post ? (
            <>
              <div className="details-header">
                <div className="details-avatar">
                  <img src={post.author.avatar} alt="Author" />
                </div>
                <p className="details-nickname">{post.author.nickname}</p>
                <p className="details-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="details-content">
                <div className="details-img">
                  {post.media.length > 1 ? (
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      pagination={{ clickable: true }}
                      modules={[Pagination]}
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
                  ) : post.media[0]?.includes(".mp4") ? (
                    <video controls>
                      <source src={post.media[0]} type="video/mp4" />
                      Ваш браузер не поддерживает видео.
                    </video>
                  ) : (
                    <img src={post.media[0]} alt="Post media" />
                  )}
                </div>
                <h1 className="details-title">{post.title}</h1>
                <p className="details-text">{post.text}</p>
              </div>

              {post.quiz && post.quiz.question && post.quiz.answers && (
                <div className="details-quiz">
                  <Quiz quizData={post.quiz} />
                </div>
              )}

              {post.poll && (
                <div className="post-poll">
                  <Poll pollData={post.poll} onVote={handlePollVote} />
                </div>
              )}

              <div className="details-icons">
                <button className="details-icon" onClick={handleLike}>
                  <IoHeartSharp size={20} color={liked ? "red" : "black"} />
                  <span>{likesCount}</span>
                </button>
                <div className="details-icon">
                  <IoEye size={20} />
                  <span>{post.views}</span>
                </div>
                <div className="details-icon">
                  <IoChatboxEllipsesSharp size={20} />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>

              <CommentsForm postId={postId} />
              <CommentsList postId={postId} user={user} />
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
