import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { db } from "../firebase";
import { useAuth } from "../auth/useAuth";
import Loader from "../components/Loader";
import CommentsForm from "../components/CommentsForm";
import CommentsList from "../components/CommentsList";
import Quiz from "../components/Quiz";
import Poll from "../components/Poll";
import PopularPosts from "../components/PopularPosts";
import ShareBlock from "../components/ShareBlok";
import UnregisteredModal from "../components/UnregisteredModal";

import avatar from "../assets/avatar.png";

import { HiArrowLongLeft } from "react-icons/hi2";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { BiComment } from "react-icons/bi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/PostDetailsPage.css";

const PostDetailsPage = () => {
  const auth = getAuth();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post?.comments?.length || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const swiperRef = useRef(null);
  const paginationRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevButtonRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

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

          setLikesCount(postData.likes?.length || 0);
          setLiked(postData.likes?.includes(user?.uid) || false);

          if (user?.uid) {
            await updateDoc(postRef, { views: (postData.views || 0) + 1 });
          }

          const authorRef = doc(db, "users", postData.author.uid);
          const authorSnap = await getDoc(authorRef);

          if (authorSnap.exists()) {
            setAuthor(authorSnap.data());
          } else {
            console.warn("Author not found.");
          }
        } else {
          throw new Error("Post not found.");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      }
    };

    fetchPost();
  }, [postId, user?.uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "posts", postId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const updatedPost = docSnapshot.data();
          setCommentsCount(updatedPost.comments?.length || 0);
        }
      },
      (error) => {
        console.error("Ошибка при получении данных из Firestore:", error);
      }
    );

    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.pagination.el = paginationRef.current;
      swiperRef.current.params.navigation.nextEl = nextButtonRef.current;
      swiperRef.current.params.navigation.prevEl = prevButtonRef.current;
      swiperRef.current.pagination.init();
      swiperRef.current.pagination.update();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  useEffect(() => {
    const checkIfSaved = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const savedPosts = userSnap.data().savedPosts || [];

        if (savedPosts.includes(postId)) {
          setIsSaved(true);
        }
      }
    };

    checkIfSaved();
  }, [postId, auth.currentUser]);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActiveIndex(swiper.activeIndex);
  };

  const handleLike = async () => {
    if (!user || !user.uid) {
      setIsModalOpen(true);
      return;
    }

    const postRef = doc(db, "posts", postId);

    try {
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) {
        throw new Error("Post not found.");
      }

      const postData = postSnap.data();
      const isLiked = postData.likes?.includes(user.uid);

      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      setLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleBack = () => {
    navigate("/", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAvatarClick = () => {
    navigate(`/author/${post.author.uid}`);
  };

  const toggleCommentsVisibility = () => {
    setCommentsVisible((prevState) => !prevState);
  };

  const handleCommentAdded = () => {
    setCommentsCount((prevCount) => prevCount + 1);
  };

  const handleCommentDeleted = () => {
    setCommentsCount((prevCount) => Math.max(prevCount - 1, 0));
  };

  const handleSavePost = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.info("You must be registered to save posts.");
      return;
    }

    if (isSaved) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        savedPosts: arrayUnion(postId),
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Ошибка при сохранении поста: ", error);
      toast.error(error);
    }
  };

  const handleEditPost = () => {
    navigate(`/edit-post/${postId}`);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="details">
        {isMobile ? (
          <>
            {post ? (
              <>
                <div className="details-wrapper">
                  <div className="container">
                    <div className="details-author-post-options">
                      <button className="details-back" onClick={handleGoBack}>
                        <HiArrowLongLeft size={18} />
                        Go back
                      </button>
                      {user?.uid === post?.author?.uid && (
                        <button className="details-edit-post-btn" onClick={handleEditPost}>
                          Edit post
                        </button>
                      )}
                    </div>
                    <div className="details-author-box">
                      <div className="details-author-info">
                        <div className="details-author-img" onClick={handleAvatarClick}>
                          <img src={author?.avatar || avatar} alt="" />
                        </div>
                        <div className="details-author-nickname-box">
                          <p className="details-author-nickname" onClick={handleAvatarClick}>
                            {author?.nickname || "Unknown Author"}
                          </p>
                          <p className="details-author-date">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <h2 className="details-title">{post.title}</h2>
                  </div>

                  <div className="details-post-img">
                    {post.media.length > 1 ? (
                      <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={(swiper) => handleSlideChange(swiper)}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{
                          clickable: true,
                          el: paginationRef.current,
                          bulletClass: "expanded-bullet",
                          bulletActiveClass: "expanded-bullet-active",
                        }}
                        navigation={{
                          nextEl: nextButtonRef.current,
                          prevEl: prevButtonRef.current,
                        }}
                        modules={[Pagination, Navigation]}
                        className="swiper-container"
                        onInit={(swiper) => {
                          swiper.params.navigation.nextEl = nextButtonRef.current;
                          swiper.params.navigation.prevEl = prevButtonRef.current;
                          swiper.params.pagination.el = paginationRef.current;
                          swiper.navigation.init();
                          swiper.navigation.update();
                          swiper.pagination.init();
                          swiper.pagination.update();
                        }}
                      >
                        {post.media.map((url, index) => (
                          <SwiperSlide key={index}>
                            {url.includes(".mp4") ? (
                              <video controls>
                                <source src={url} type="video/mp4" />
                                Your browser does not support video.
                              </video>
                            ) : (
                              <img src={url} alt={`Post media ${index}`} />
                            )}
                          </SwiperSlide>
                        ))}
                        <button
                          ref={prevButtonRef}
                          className={`${
                            isBeginning
                              ? "expanded-swiper-button in-activ"
                              : "expanded-swiper-button"
                          } expanded-swiper-button-prev ${
                            isBeginning ? "expanded-button-disabled" : ""
                          }`}
                          disabled={isBeginning}
                        >
                          {isBeginning ? (
                            <MdOutlineArrowBackIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)", opacity: "0.3" }}
                            />
                          ) : (
                            <MdOutlineArrowBackIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)" }}
                            />
                          )}
                        </button>
                        <button
                          ref={nextButtonRef}
                          className={`${
                            isEnd ? "expanded-swiper-button in-activ" : "expanded-swiper-button"
                          } expanded-swiper-button-next ${isEnd ? "expanded-button-disabled" : ""}`}
                          disabled={isEnd}
                        >
                          {isEnd ? (
                            <MdOutlineArrowForwardIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)", opacity: "0.3" }}
                            />
                          ) : (
                            <MdOutlineArrowForwardIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)" }}
                            />
                          )}
                        </button>
                      </Swiper>
                    ) : post.media[0].includes(".mp4") ? (
                      <video controls>
                        <source src={post.media[0]} type="video/mp4" />
                        Your browser does not support video.
                      </video>
                    ) : (
                      <img src={post.media[0]} alt="Post media" />
                    )}

                    {post.media.length > 1 && (
                      <div ref={paginationRef} className="expanded-swiper-pagination">
                        {post.media.map((_, index) => (
                          <div
                            key={index}
                            className={`expanded-bullet ${
                              activeIndex === index ? "expanded-bullet-active" : ""
                            }`}
                            onClick={() => swiperRef.current?.slideTo(index)}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="container">
                    <p className="details-text">{post.text}</p>
                  </div>

                  <div className="details-exam-box">
                    <div className="container">
                      {post.quiz && post.quiz.question && post.quiz.answers && (
                        <Quiz quizData={post.quiz} user={user} postId={postId} />
                      )}
                      {post.poll && <Poll pollData={post.poll} postId={postId} />}
                    </div>
                  </div>

                  <div className="container">
                    <div className="details-border">
                      <div></div>
                    </div>
                  </div>

                  <div className="container">
                    <div className="details-options">
                      <div className="details-icons">
                        <button className="details-icon" onClick={handleLike}>
                          {liked ? (
                            <FaHeart size={24} style={{ color: "var(--text-error)" }} />
                          ) : (
                            <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
                          )}
                          <span>{likesCount}</span>
                        </button>
                        <div className="details-icon">
                          <FiEye size={24} style={{ color: "var(--text-black)" }} />
                          <span>{post.views}</span>
                        </div>
                        <div className="details-icon">
                          <BiComment size={24} style={{ color: "var(--text-black)" }} />
                          <span>{commentsCount}</span>
                        </div>
                        <button className="details-btn-saved" onClick={handleSavePost}>
                          {!auth.currentUser || isSaved ? (
                            <FaBookmark size={24} />
                          ) : (
                            <FaRegBookmark size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="details-comments-box">
                    <CommentsForm postId={postId} onCommentAdded={handleCommentAdded} />
                    <CommentsList
                      postId={postId}
                      user={user}
                      onCommentDeleted={handleCommentDeleted}
                    />
                  </div>
                </div>

                <div className="details-btn-return-box">
                  <button className="details-btn-return" onClick={handleBack}>
                    Return to home page
                  </button>
                </div>
              </>
            ) : (
              <Loader />
            )}
          </>
        ) : (
          <div className="container">
            {post ? (
              <>
                <div className="details-wrapper">
                  <div className="details-author-box">
                    <div className="details-author-info">
                      <div className="details-author-img" onClick={handleAvatarClick}>
                        <img src={author?.avatar || avatar} alt="" />
                      </div>
                      <div className="details-author-nickname-box">
                        <p className="details-author-nickname" onClick={handleAvatarClick}>
                          {author?.nickname || "Unknown Author"}
                        </p>
                        <p className="details-author-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="details-author-post-options">
                      <button className="details-back" onClick={handleGoBack}>
                        {isTablet ? <HiArrowLongLeft size={24} /> : <HiArrowLongLeft size={28} />}
                        Go back
                      </button>
                      {user?.uid === post?.author?.uid && (
                        <button className="details-edit-post-btn" onClick={handleEditPost}>
                          Edit post
                        </button>
                      )}
                    </div>
                  </div>

                  <h2 className="details-title">{post.title}</h2>

                  <div className="details-post-img">
                    {post.media.length > 1 ? (
                      <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={(swiper) => handleSlideChange(swiper)}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{
                          clickable: true,
                          el: paginationRef.current,
                          bulletClass: "expanded-bullet",
                          bulletActiveClass: "expanded-bullet-active",
                        }}
                        navigation={{
                          nextEl: nextButtonRef.current,
                          prevEl: prevButtonRef.current,
                        }}
                        modules={[Pagination, Navigation]}
                        className="swiper-container"
                        onInit={(swiper) => {
                          swiper.params.navigation.nextEl = nextButtonRef.current;
                          swiper.params.navigation.prevEl = prevButtonRef.current;
                          swiper.params.pagination.el = paginationRef.current;
                          swiper.navigation.init();
                          swiper.navigation.update();
                          swiper.pagination.init();
                          swiper.pagination.update();
                        }}
                      >
                        {post.media.map((url, index) => (
                          <SwiperSlide key={index}>
                            {url.includes(".mp4") ? (
                              <video controls>
                                <source src={url} type="video/mp4" />
                                Your browser does not support video.
                              </video>
                            ) : (
                              <img src={url} alt={`Post media ${index}`} />
                            )}
                          </SwiperSlide>
                        ))}
                        <button
                          ref={prevButtonRef}
                          className={`${
                            isBeginning
                              ? "expanded-swiper-button in-activ"
                              : "expanded-swiper-button"
                          } expanded-swiper-button-prev ${
                            isBeginning ? "expanded-button-disabled" : ""
                          }`}
                          disabled={isBeginning}
                        >
                          {isBeginning ? (
                            <MdOutlineArrowBackIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)", opacity: "0.3" }}
                            />
                          ) : (
                            <MdOutlineArrowBackIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)" }}
                            />
                          )}
                        </button>
                        <button
                          ref={nextButtonRef}
                          className={`${
                            isEnd ? "expanded-swiper-button in-activ" : "expanded-swiper-button"
                          } expanded-swiper-button-next ${isEnd ? "expanded-button-disabled" : ""}`}
                          disabled={isEnd}
                        >
                          {isEnd ? (
                            <MdOutlineArrowForwardIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)", opacity: "0.3" }}
                            />
                          ) : (
                            <MdOutlineArrowForwardIos
                              size={isTablet ? "20" : "28"}
                              style={{ color: "var(--text-white)" }}
                            />
                          )}
                        </button>
                      </Swiper>
                    ) : post.media[0].includes(".mp4") ? (
                      <video controls>
                        <source src={post.media[0]} type="video/mp4" />
                        Your browser does not support video.
                      </video>
                    ) : (
                      <img src={post.media[0]} alt="Post media" />
                    )}

                    {post.media.length > 1 && (
                      <div ref={paginationRef} className="expanded-swiper-pagination">
                        {post.media.map((_, index) => (
                          <div
                            key={index}
                            className={`expanded-bullet ${
                              activeIndex === index ? "expanded-bullet-active" : ""
                            }`}
                            onClick={() => swiperRef.current?.slideTo(index)}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="details-text">{post.text}</p>

                  <div className="details-exam-box">
                    {post.quiz && post.quiz.question && post.quiz.answers && (
                      <Quiz quizData={post.quiz} user={user} />
                    )}
                    {post.poll && <Poll pollData={post.poll} postId={postId} />}
                  </div>

                  <div className="details-border">
                    <div></div>
                  </div>

                  <div className="details-options">
                    <div className="details-icons">
                      <button className="details-icon" onClick={handleLike}>
                        {liked ? (
                          <FaHeart size={24} style={{ color: "var(--text-error)" }} />
                        ) : (
                          <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
                        )}
                        <span>{likesCount}</span>
                      </button>
                      <div className="details-icon">
                        <FiEye size={24} style={{ color: "var(--text-black)" }} />
                        <span>{post.views}</span>
                      </div>
                      <div className="details-icon">
                        <BiComment size={24} style={{ color: "var(--text-black)" }} />
                        <span>{commentsCount}</span>
                      </div>
                    </div>

                    <div className="details-btn-viewComm-box">
                      <button className="details-btn-viewComm" onClick={toggleCommentsVisibility}>
                        {commentsVisible ? "Hide comments" : "View comments"}
                        {commentsVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                      </button>
                    </div>

                    <button
                      className="details-btn-saved"
                      onClick={handleSavePost}
                      disabled={!auth.currentUser || isSaved}
                      style={{
                        cursor: !auth.currentUser || isSaved ? "not-allowed" : "pointer",
                      }}
                    >
                      {!auth.currentUser || isSaved ? (
                        <FaBookmark size={24} />
                      ) : (
                        <FaRegBookmark size={24} />
                      )}
                    </button>
                  </div>

                  {isTablet ? (
                    <>
                      {commentsVisible && (
                        <div className="details-comments-box">
                          <CommentsForm postId={postId} onCommentAdded={handleCommentAdded} />
                          <div className="details-comments-scroll">
                            <CommentsList
                              postId={postId}
                              user={user}
                              onCommentDeleted={handleCommentDeleted}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="details-comments-box">
                      <div className="details-comments-scroll">
                        <CommentsList
                          postId={postId}
                          user={user}
                          onCommentDeleted={handleCommentDeleted}
                        />
                      </div>
                      <CommentsForm postId={postId} onCommentAdded={handleCommentAdded} />
                    </div>
                  )}
                </div>

                <div className="details-btn-return-box">
                  <button className="details-btn-return" onClick={handleBack}>
                    Return to home page
                  </button>
                </div>
              </>
            ) : (
              <Loader />
            )}
          </div>
        )}

        <PopularPosts />

        <ShareBlock />
      </div>

      <UnregisteredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default PostDetailsPage;
