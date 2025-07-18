import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { db } from "../firebase";

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { BiComment } from "react-icons/bi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";

import "../styles/ExpandedPost.css";

const ExpandedPost = ({ post, liked, likesCount, viewsCount, handleLike, author }) => {
  const auth = getAuth();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

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

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const user = auth.currentUser;

      if (!user) {
        setIsSaved(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const savedPosts = userDoc.data().savedPosts || [];
          setIsSaved(savedPosts.includes(post.id));
        }
      } catch (error) {
        console.error("Error fetching saved posts: ", error);
      }
    };

    fetchSavedPosts();
  }, [post.id, auth.currentUser]);

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
        savedPosts: arrayUnion(post.id),
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Ошибка при сохранении поста: ", error);
      toast.error(error);
    }
  };

  return (
    <div className="expPost">
      <div className="expPost-header">
        <div className="expPost-avatar" onClick={handleAvatarClick}>
          {author?.avatar ? (
            <img src={author.avatar} alt="Post author" />
          ) : (
            <div className="expPost-avatar-placeholder">
              {author?.nickname ? author.nickname.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <div className="expPost-info-post">
          <p className="expPost-author" onClick={handleAvatarClick}>
            {author?.nickname || "Unknown Author"}
          </p>
          <p className="expPost-date">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="expPost-content">
        <div className="expPost-image">
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
          ) : Array.isArray(post.media) && post.media[0]?.includes(".mp4") ? (
            <video autoPlay loop>
              <source src={post.media[0]} type="video/mp4" />
              Your browser does not support video.
            </video>
          ) : (
            <img src={post.media[0]} alt="Post media" />
          )}
        </div>
        <div className="expPost-box-text" onClick={handleExpandClick}>
          <p className="expPost-title">{post.title}</p>
          <p className="expPost-text">{post.text}</p>
          <div className="expPost-more-box">
            <span className="expPost-more">More</span>
          </div>
        </div>
      </div>

      <div className="expPost-bottom">
        <div className="expPost-line">
          <div></div>
        </div>

        <div className="expPost-footer">
          <div className="expPost-icon-box">
            <button className="expPost-icon" onClick={handleLike}>
              {liked ? (
                <FaHeart size={24} style={{ color: "var(--text-error)" }} />
              ) : (
                <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
              )}
              <span>{likesCount}</span>
            </button>
            <div className="expPost-icon">
              <FiEye size={24} style={{ color: "var(--text-black)" }} />
              <span>{viewsCount}</span>
            </div>
            <div className="expPost-icon">
              <BiComment size={24} style={{ color: "var(--text-black)" }} />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>

          <button
            className="details-btn-saved"
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

export default ExpandedPost;
