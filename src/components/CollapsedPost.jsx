import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import avatar from "../assets/avatar.png";

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { SlEye } from "react-icons/sl";
import { BiComment } from "react-icons/bi";

import "../styles/CollapsedPost.css";

const CollapsedPost = ({ post, liked, likesCount, viewsCount, handleLike, author }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef(null);
  const paginationRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevButtonRef = useRef(null);

  const navigate = useNavigate();

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

  const handleAvatarClick = () => {
    navigate(`/author/${post.author.uid}`);
  };

  const handleExpandClick = () => {
    navigate(`/post/${post.id}`);
  };

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
              el: paginationRef.current,
              bulletClass: "collapsed-bullet",
              bulletActiveClass: "collapsed-bullet-active",
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
                  onClick={() => swiperRef.current?.slideTo(index)}
                ></div>
              ))}
            </div>
            <button
              ref={prevButtonRef}
              className={`${
                isBeginning ? "collapsed-swiper-button in-activ" : "collapsed-swiper-button"
              } collapsed-swiper-button-prev ${isBeginning ? "collapsed-button-disabled" : ""}`}
              disabled={isBeginning}
            >
              {isBeginning ? (
                <MdOutlineArrowBackIos
                  size={18}
                  style={{ color: "var(--text-white)", opacity: "0.3" }}
                />
              ) : (
                <MdOutlineArrowBackIos size={18} style={{ color: "var(--text-white)" }} />
              )}
            </button>
            <button
              ref={nextButtonRef}
              className={`${
                isEnd ? "collapsed-swiper-button in-activ" : "collapsed-swiper-button"
              } collapsed-swiper-button-next ${isEnd ? "collapsed-button-disabled" : ""}`}
              disabled={isEnd}
            >
              {isEnd ? (
                <MdOutlineArrowForwardIos
                  size={18}
                  style={{ color: "var(--text-white)", opacity: "0.3" }}
                />
              ) : (
                <MdOutlineArrowForwardIos size={18} style={{ color: "var(--text-white)" }} />
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

      <div className="post-right">
        <div className="post-header">
          <div className="post-avatar" onClick={handleAvatarClick}>
            <img src={author?.avatar || avatar} alt="Post author" />
          </div>
          <p className="post-author">{author?.nickname || "Unknown Author"}</p>
          <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="post-center">
          <p className="post-title">{post.title}</p>
          <p className="post-text">{post.text}</p>
        </div>
        <div className="post-bottom">
          <div className="post-icons">
            <button className="post-icon" onClick={handleLike}>
              {liked ? (
                <FaHeart size={24} style={{ color: "var(--text-error)" }} />
              ) : (
                <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
              )}
              <span>{likesCount}</span>
            </button>
            <div className="post-icon">
              <SlEye size={24} style={{ color: "var(--text-black)" }} />
              <span>{viewsCount}</span>
            </div>
            <div className="post-icon">
              <BiComment size={24} style={{ color: "var(--text-black)" }} />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
          <button className="post-more-btn" onClick={handleExpandClick}>
            Read more
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollapsedPost;
