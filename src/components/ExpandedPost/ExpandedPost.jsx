import React, { useState, useRef, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ExpandedPost.css";

import Quiz from "../Quiz/Quiz";
import Poll from "../Poll/Poll";
import CommentsForm from "../CommentsForm/CommentsForm";
import CommentsList from "../CommentsList/CommentsList";

import { ReactComponent as Heart } from "../../assets/icons/heart.svg";
import { ReactComponent as HeartRed } from "../../assets/icons/heart-red.svg";
import { ReactComponent as Eye } from "../../assets/icons/eye.svg";
import { ReactComponent as Comment } from "../../assets/icons/comment.svg";
import { ReactComponent as ArrowCollapse } from "../../assets/icons/arrow-collapse.svg";
import { ReactComponent as ArrowRight } from "../../assets/icons/arrow-right.svg";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as ArrowLeftDisabled } from "../../assets/icons/arrow-left-disabled.svg";
import { ReactComponent as ArrowRightDisabled } from "../../assets/icons/arrow-right-disabled.svg";

const ExpandedPost = ({
  user,
  post,
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
  const [commentsCount, setCommentsCount] = useState(
    post.comments?.length || 0
  );
  const swiperRef = useRef(null);
  const paginationRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevButtonRef = useRef(null);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "posts", post.id), // Предполагается, что посты хранятся в коллекции "posts"
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const updatedPost = docSnapshot.data();
          setCommentsCount(updatedPost.comments?.length || 0); // Обновляем состояние
        }
      },
      (error) => {
        console.error("Ошибка при получении данных из Firestore:", error);
      }
    );

    // Отписка от слушателя при размонтировании компонента
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

  return (
    <div className="postExp transition-post">
      <div className="postExp-top">
        <div className="postExp-avarar">
          <img src={post.author.avatar} alt="Post author" />
        </div>
        <p className="postExp-author">{post.author.nickname}</p>
        <p className="postExp-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
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
                el: paginationRef.current, // Кастомная пагинация
                bulletClass: "expanded-bullet", // Кастомный класс буллетов
                bulletActiveClass: "expanded-bullet-active", // Класс для активного буллета
              }}
              navigation={{
                nextEl: nextButtonRef.current, // Кастомные кнопки навигации
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
                    <video autoPlay loop>
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
                    onClick={() => swiperRef.current?.slideTo(index)} // Переключение слайда по клику на буллет
                  ></div>
                ))}
              </div>
              <button
                ref={prevButtonRef}
                className={`expanded-swiper-button expanded-swiper-button-prev ${
                  isBeginning ? "expanded-button-disabled" : ""
                }`}
                disabled={isBeginning}
              >
                {isBeginning ? (
                  <ArrowLeftDisabled width={42} height={42} />
                ) : (
                  <ArrowLeft width={42} height={42} />
                )}
              </button>
              <button
                ref={nextButtonRef}
                className={`expanded-swiper-button expanded-swiper-button-next ${
                  isEnd ? "expanded-button-disabled" : ""
                }`}
                disabled={isEnd}
              >
                {isEnd ? (
                  <ArrowRightDisabled width={42} height={42} />
                ) : (
                  <ArrowRight width={42} height={42} />
                )}
              </button>
            </Swiper>
          ) : post.media[0].includes(".mp4") ? (
            <video autoPlay loop>
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
          {post.quiz && post.quiz.question && post.quiz.answers && (
            <Quiz quizData={post.quiz} />
          )}

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
              {liked ? <HeartRed /> : <Heart />}
              <span>{likesCount}</span>
            </button>
            <div className="postExp-icon">
              <Eye />
              <span>{viewsCount}</span>
            </div>
            <div className="postExp-icon">
              <Comment />
              <span>{commentsCount}</span>
            </div>
          </div>

          <div className="postExp-btn-viewComm-box">
            <button
              className="postExp-btn-viewComm"
              onClick={toggleCommentsVisibility}
            >
              {commentsVisible ? "Hide comments" : "View comments"}
              {commentsVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </button>
          </div>
        </div>

        <button className="postExp-collapse-btn" onClick={onExpand}>
          <ArrowCollapse />
        </button>
      </div>

      {commentsVisible && (
        <div className="postExp-comments-box">
          <div className="postExp-comments-scroll">
            <CommentsList
              postId={post.id}
              user={user}
              onCommentDeleted={handleCommentDeleted}
            />
          </div>
          <CommentsForm postId={post.id} onCommentAdded={handleCommentAdded} />
        </div>
      )}
    </div>
  );
};

export default ExpandedPost;
