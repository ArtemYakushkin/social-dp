import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./CollapsedPost.css";

import { ReactComponent as Heart } from "../../assets/icons/heart.svg";
import { ReactComponent as HeartRed } from "../../assets/icons/heart-red.svg";
import { ReactComponent as Eye } from "../../assets/icons/eye.svg";
import { ReactComponent as Comment } from "../../assets/icons/comment.svg";
import { ReactComponent as ArrowMove } from "../../assets/icons/arrow-move.svg";
import { ReactComponent as ArrowRight } from "../../assets/icons/arrow-right.svg";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as ArrowLeftDisabled } from "../../assets/icons/arrow-left-disabled.svg";
import { ReactComponent as ArrowRightDisabled } from "../../assets/icons/arrow-right-disabled.svg";

const CollapsedPost = ({
  post,
  liked,
  likesCount,
  viewsCount,
  handleLike,
  handleExpand,
}) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const paginationRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevButtonRef = useRef(null);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActiveIndex(swiper.activeIndex);
  };

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
    <div className="post transition-post">
      <div className="post-left">
        {post.media.length > 1 ? (
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => handleSlideChange(swiper)}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: paginationRef.current, // Кастомная пагинация
              bulletClass: "collapsed-bullet", // Кастомный класс буллетов
              bulletActiveClass: "collapsed-bullet-active", // Класс для активного буллета
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
            <div ref={paginationRef} className="collapsed-swiper-pagination">
              {post.media.map((_, index) => (
                <div
                  key={index}
                  className={`collapsed-bullet ${
                    activeIndex === index ? "collapsed-bullet-active" : ""
                  }`}
                  onClick={() => swiperRef.current?.slideTo(index)} // Переключение слайда по клику на буллет
                ></div>
              ))}
            </div>
            <button
              ref={prevButtonRef}
              className={`collapsed-swiper-button collapsed-swiper-button-prev ${
                isBeginning ? "collapsed-button-disabled" : ""
              }`}
              disabled={isBeginning}
            >
              {isBeginning ? <ArrowLeftDisabled /> : <ArrowLeft />}
            </button>
            <button
              ref={nextButtonRef}
              className={`collapsed-swiper-button collapsed-swiper-button-next ${
                isEnd ? "collapsed-button-disabled" : ""
              }`}
              disabled={isEnd}
            >
              {isEnd ? <ArrowRightDisabled /> : <ArrowRight />}
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
      <div className="post-right">
        <div className="post-header">
          <div className="post-avarar">
            <img src={post.author.avatar} alt="Post author" />
          </div>
          <p className="post-author">{post.author.nickname}</p>
          <p className="post-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="post-center">
          <p className="post-title">{post.title}</p>
          <p className="post-text">{post.text}</p>
        </div>
        <div className="post-bottom">
          <div className="post-icons">
            <button className="post-icon" onClick={handleLike}>
              {liked ? <HeartRed /> : <Heart />}
              <span>{likesCount}</span>
            </button>
            <div className="post-icon">
              <Eye />
              <span>{viewsCount}</span>
            </div>
            <div className="post-icon">
              <Comment />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
          <button className="post-more-btn" onClick={handleExpand}>
            <ArrowMove />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollapsedPost;
