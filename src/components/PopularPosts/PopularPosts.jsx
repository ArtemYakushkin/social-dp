import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { db } from "../../firebase";
import { fetchPopularPosts, fetchAuthors, navigateToPost } from "../../utils/popularPostsUtils";

import Loader from "../Loader";

import avatar from "../../assets/avatar.png";

import { FaRegHeart } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { BiComment } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const PopularPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authors, setAuthors] = useState({});
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { posts, error } = await fetchPopularPosts(db);
        if (error) setError(true);
        setPosts(posts);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const loadAuthors = async () => {
      const authorsData = await fetchAuthors(db, posts);
      setAuthors((prev) => ({ ...prev, ...authorsData }));
    };
    loadAuthors();
  }, [posts]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [posts]);

  return (
    <div className="popular">
      <div className="container">
        <h2 className="popular-title sectionTitle">Topics you may like</h2>

        {loading && <Loader />}
        {error && !loading && <p className="popular-not-found">Popular posts not found.</p>}

        {!loading && !error && (
          <div className="popular-container">
            <button ref={prevRef} className="popular-btn popular-btn-prev">
              <IoIosArrowBack size={32} />
            </button>

            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              loop={true}
              spaceBetween={20}
              slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiperRef.current = swiper;
              }}
              className="popular-slider"
            >
              {posts.map((post) => (
                <SwiperSlide key={post.id}>
                  <div
                    className="grid"
                    style={{ boxShadow: "none", backgroundColor: "var(--bg-register-form)" }}
                    onClick={() => navigateToPost(navigate, post.id)}
                  >
                    <div className="grid-header">
                      <div className="grid-avatar avatarLarge">
                        <img src={authors[post.author?.uid]?.avatar || avatar} alt="Post author" />
                      </div>
                      <div className="grid-info-post">
                        <p className="nicknameText">
                          {authors[post.author?.uid]?.nickname || "Unknown Author"}
                        </p>
                        <p className="dateText">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid-content">
                      <div className="grid-image">
                        {post.media?.[0] &&
                          (post.media[0].includes(".mp4") ? (
                            <video autoPlay loop muted>
                              <source src={post.media[0]} type="video/mp4" />
                              Your browser does not support video.
                            </video>
                          ) : (
                            <img src={post.media[0]} alt="Post media" />
                          ))}
                      </div>
                      <div className="grid-box-text">
                        <p className="grid-title postTitle">{post.title}</p>
                        <p className="grid-text nicknameText">{post.text}</p>
                      </div>
                    </div>

                    <div className="grid-bottom">
                      <div className="grid-line">
                        <div></div>
                      </div>

                      <div className="grid-footer">
                        <div className="grid-icon-box">
                          <div className="grid-icon">
                            <FaRegHeart size={24} color="var(--text-black)" />
                            <span>{post.likes.length}</span>
                          </div>
                          <div className="grid-icon">
                            <FiEye size={24} color="var(--text-black)" />
                            <span>{post.views}</span>
                          </div>
                          <div className="grid-icon">
                            <BiComment size={24} color="var(--text-black)" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button ref={nextRef} className="popular-btn popular-btn-next">
              <IoIosArrowForward size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularPosts;
