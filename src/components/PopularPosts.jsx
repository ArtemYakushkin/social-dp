import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import Loader from "./Loader";
import avatar from "../assets/avatar.png";

import { FaRegHeart } from "react-icons/fa";
import { SlEye } from "react-icons/sl";
import { BiComment } from "react-icons/bi";

import "../styles/PopularPosts.css";

const PopularPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authors, setAuthors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("likes", "desc"), limit(3));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(true);
        } else {
          const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPosts(postsData);
        }
      } catch (error) {
        console.error("Ошибка загрузки популярных постов:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    const fetchAuthors = async () => {
      const newAuthors = {};
      const uniqueUids = [...new Set(posts.map((post) => post.author?.uid).filter(Boolean))];

      await Promise.all(
        uniqueUids.map(async (uid) => {
          try {
            const authorSnap = await getDoc(doc(db, "users", uid));
            newAuthors[uid] = authorSnap.exists()
              ? authorSnap.data()
              : { nickname: "Unknown Author", avatar };
          } catch (error) {
            console.error(`Ошибка загрузки автора ${uid}:`, error);
            newAuthors[uid] = { nickname: "Unknown Author", avatar };
          }
        })
      );

      setAuthors((prevAuthors) => ({ ...prevAuthors, ...newAuthors }));
    };

    fetchAuthors();
  }, [posts]);

  const handleExpandClick = (postId) => {
    if (postId) navigate(`/post/${postId}`);
    else console.error("Ошибка: postId отсутствует!");
  };

  return (
    <div className="popular">
      <div className="container">
        <h2 className="popular-title">Topics that may interest you</h2>

        {loading && <Loader />}

        {error && !loading && (
          <p className="text-center text-gray-500">Популярные посты не найдены.</p>
        )}

        {!loading && !error && (
          <div className="popular-list">
            {posts.map((post) => (
              <div className="expPost" key={post.id}>
                <div className="expPost-header">
                  <div className="expPost-avatar">
                    <img src={authors[post.author?.uid]?.avatar || avatar} alt="Post author" />
                  </div>
                  <div className="expPost-info-post">
                    <p className="expPost-author">
                      {authors[post.author?.uid]?.nickname || "Unknown Author"}
                    </p>
                    <p className="expPost-date">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="expPost-content" onClick={() => handleExpandClick(post.id)}>
                  <div className="expPost-image">
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
                  <div className="expPost-box-text">
                    <p className="expPost-title">{post.title}</p>
                    <p className="expPost-text">{post.text}</p>
                  </div>
                </div>

                <div className="expPost-line">
                  <div></div>
                </div>

                <div className="expPost-footer">
                  <div className="expPost-icon-box">
                    <div className="expPost-icon">
                      <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
                      <span>{post.likes.length}</span>
                    </div>
                    <div className="expPost-icon">
                      <SlEye size={24} style={{ color: "var(--text-black)" }} />
                      <span>{post.views}</span>
                    </div>
                    <div className="expPost-icon">
                      <BiComment size={24} style={{ color: "var(--text-black)" }} />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularPosts;
