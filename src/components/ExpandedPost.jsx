import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { db } from "../firebase";
import Quiz from "./Quiz";
import Poll from "./Poll";
import CommentsForm from "./CommentsForm";
import CommentsList from "./CommentsList";

import avatar from "../assets/avatar.png";

import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { TbArrowsDiagonalMinimize2 } from "react-icons/tb";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { SlEye } from "react-icons/sl";
import { BiComment } from "react-icons/bi";

import "../styles/ExpandedPost.css";

const ExpandedPost = ({
  user,
  post,
  author,
  liked,
  likesCount,
  viewsCount,
  commentsVisible,
  toggleCommentsVisibility,
  handleLike,
  onExpand,
}) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);

  const swiperRef = useRef(null);
  const paginationRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevButtonRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "posts", post.id),
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
  }, [post.id]);

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

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActiveIndex(swiper.activeIndex);
  };

  const handleCommentAdded = () => {
    setCommentsCount((prevCount) => prevCount + 1);
  };

  const handleCommentDeleted = () => {
    setCommentsCount((prevCount) => Math.max(prevCount - 1, 0));
  };

  const handleAvatarClick = () => {
    navigate(`/author/${post.author.uid}`);
  };

  return (
    <div className="postExp transition-post">
      <div className="postExp-top">
        <div className="postExp-avarar" onClick={handleAvatarClick}>
          <img src={author?.avatar || avatar} alt="Post author" />
        </div>
        <p className="postExp-author">{author?.nickname || "Unknown Author"}</p>
        <p className="postExp-date">{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="postExp-center">
        <div className="postExp-title-box">
          <p className="postExp-title">{post.title}</p>
        </div>

        <div className="postExp-img">
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
              <button
                ref={prevButtonRef}
                className={`${
                  isBeginning ? "expanded-swiper-button in-activ" : "expanded-swiper-button"
                } expanded-swiper-button-prev ${isBeginning ? "expanded-button-disabled" : ""}`}
                disabled={isBeginning}
              >
                {isBeginning ? (
                  <MdOutlineArrowBackIos
                    size={28}
                    style={{ color: "var(--text-white)", opacity: "0.3" }}
                  />
                ) : (
                  <MdOutlineArrowBackIos size={28} style={{ color: "var(--text-white)" }} />
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
                    size={28}
                    style={{ color: "var(--text-white)", opacity: "0.3" }}
                  />
                ) : (
                  <MdOutlineArrowForwardIos size={28} style={{ color: "var(--text-white)" }} />
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
        </div>

        <div className="postExp-text-box">
          <p className="postExp-text">{post.text}</p>
        </div>

        <div className="postExp-exam-box">
          {post.quiz && post.quiz.question && post.quiz.answers && <Quiz quizData={post.quiz} />}

          {post.poll && <Poll pollData={post.poll} postId={post.id} />}
        </div>
      </div>

      <div className="postExp-line-box">
        <div className="postExp-line"></div>
      </div>

      <div className="postExp-bottom">
        <div className="postExp-bottom-left">
          <div className="postExp-icons">
            <button className="postExp-icon" onClick={handleLike}>
              {liked ? (
                <FaHeart size={24} style={{ color: "var(--text-error)" }} />
              ) : (
                <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
              )}
              <span>{likesCount}</span>
            </button>
            <div className="postExp-icon">
              <SlEye size={24} style={{ color: "var(--text-black)" }} />
              <span>{viewsCount}</span>
            </div>
            <div className="postExp-icon">
              <BiComment size={24} style={{ color: "var(--text-black)" }} />
              <span>{commentsCount}</span>
            </div>
          </div>

          <div className="postExp-btn-viewComm-box">
            <button className="postExp-btn-viewComm" onClick={toggleCommentsVisibility}>
              {commentsVisible ? "Hide comments" : "View comments"}
              {commentsVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </button>
          </div>
        </div>

        <button className="postExp-collapse-btn" onClick={onExpand}>
          <TbArrowsDiagonalMinimize2
            className="post-more-btn-icon"
            size={24}
            style={{ color: "var(--accent-blue-color)" }}
          />
        </button>
      </div>

      {commentsVisible && (
        <div className="postExp-comments-box">
          <div className="postExp-comments-scroll">
            <CommentsList postId={post.id} user={user} onCommentDeleted={handleCommentDeleted} />
          </div>
          <CommentsForm postId={post.id} onCommentAdded={handleCommentAdded} />
        </div>
      )}
    </div>
  );
};

export default ExpandedPost;
