import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";
import Loader from "../components/Loader";
import PopularPosts from "../components/PopularPosts";
import AuthorMessagesForm from "../components/AuthorMessagesForm";

import coverPlaceholder from "../assets/cover-img.png";
import avatarPlaceholder from "../assets/avatar.png";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import telegram from "../assets/telegram.png";

import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LiaIdCardSolid } from "react-icons/lia";

import "../styles/AboutProfilePage.css";

const AuthorProfile = () => {
  const { uid } = useParams();
  const [author, setAuthor] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [authorPosts, setAuthorPosts] = useState([]);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  console.log("coverPlaceholder", coverPlaceholder);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAuthorData = async () => {
      const authorRef = doc(db, "users", uid);
      const docSnap = await getDoc(authorRef);

      if (docSnap.exists()) {
        setAuthor(docSnap.data());
      } else {
        console.error("No such user!");
      }
    };

    fetchAuthorData();
  }, [uid]);

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      if (!author?.createdPosts || author.createdPosts.length === 0) {
        setAuthorPosts([]);
        return;
      }

      try {
        const postsPromises = author.createdPosts.map(async (post) => {
          const postId = post.id;

          if (typeof postId !== "string") {
            console.error("Invalid postId:", postId);
            return null;
          }

          const postRef = doc(db, "posts", postId);
          const postSnap = await getDoc(postRef);

          return postSnap.exists() ? { id: postId, ...postSnap.data() } : null;
        });

        const postsData = await Promise.all(postsPromises);
        setAuthorPosts(postsData.filter((post) => post !== null));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (activeTab === "posts") {
      fetchAuthorPosts();
    }
  }, [activeTab, author?.createdPosts]);

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <>
      <div className="app">
        {author ? (
          <>
            {isMobile ? (
              <>
                <div className="app-info">
                  <div className="app-avatar-img">
                    <img
                      src={author.avatar || avatarPlaceholder}
                      alt={`${author.nickname}'s avatar`}
                    />
                  </div>
                  <img
                    className="app-cover"
                    src={author.cover || coverPlaceholder}
                    alt={`${author.cover}'s`}
                  />

                  <div className="container">
                    <div className="app-social">
                      {author.facebook && (
                        <a href={author.facebook} target="_blank" rel="noopener noreferrer">
                          <img src={facebook} alt="facebook" />
                        </a>
                      )}
                      {author.instagram && (
                        <a href={author.instagram} target="_blank" rel="noopener noreferrer">
                          <img src={instagram} alt="instagram" />
                        </a>
                      )}
                      {author.telegram && (
                        <a href={author.telegram} target="_blank" rel="noopener noreferrer">
                          <img src={telegram} alt="telegram" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="container">
                    <h1 className="app-nickname">{author.nickname}</h1>
                    <div className="app-line-box">
                      <div></div>
                    </div>
                    <ul className="app-status">
                      <li className="app-item">
                        <p>
                          Country: <span>{author.country}</span>
                        </p>
                      </li>
                      <li className="app-item">
                        <p>
                          Status on the site: <span>{author.profession}</span>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="container">
                  <div className="app-tabs">
                    <button
                      className={`app-tabs-btn ${
                        activeTab === "about" ? "app-tabs-btn-active" : ""
                      }`}
                      onClick={() => setActiveTab("about")}
                    >
                      <LiaIdCardSolid size={24} /> About
                    </button>
                    {author.createdPosts.length === 0 ? (
                      <></>
                    ) : (
                      <button
                        className={`app-tabs-btn ${
                          activeTab === "posts" ? "app-tabs-btn-active" : ""
                        }`}
                        onClick={() => setActiveTab("posts")}
                      >
                        <HiOutlineClipboardDocumentList size={24} /> Posts (
                        {author.createdPosts.length})
                      </button>
                    )}
                  </div>

                  <div className="profile-tabs-content">
                    {activeTab === "about" && (
                      <>
                        <div className="app-about">
                          <h2 className="app-about-title">About author</h2>
                          {stripHtml(author.aboutMe).trim() ? (
                            <p
                              className="app-about-text"
                              dangerouslySetInnerHTML={{
                                __html: author.aboutMe,
                              }}
                            ></p>
                          ) : (
                            <p className="app-about-text-not-yet">
                              {author.nickname} has not yet written anything about himself.
                            </p>
                          )}
                        </div>
                        <AuthorMessagesForm authorId={uid} />
                      </>
                    )}

                    {activeTab === "posts" && (
                      <ul className="app-post-list">
                        {authorPosts.length > 0 ? (
                          authorPosts.map((post) => (
                            <li className="app-post-item" key={post.id}>
                              <Link to={`/post/${post.id}`} className="app-post-link">
                                <div className="app-post-image">
                                  {post.media && post.media.length > 0 && (
                                    <img src={post.media[0]} alt="Post" />
                                  )}
                                </div>
                                <div className="app-post-content">
                                  <p className="app-post-date">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </p>
                                  <h3 className="app-post-title">{post.title}</h3>
                                  <p className="app-post-text">{post.text}</p>
                                </div>
                              </Link>
                            </li>
                          ))
                        ) : (
                          <p className="app-post-no-posts">No posts yet</p>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            ) : isTablet ? (
              <div className="container">
                <div className="app-info">
                  <div className="app-avatar-img">
                    <img
                      src={author.avatar || avatarPlaceholder}
                      alt={`${author.nickname}'s avatar`}
                    />
                  </div>

                  <img
                    className="app-cover"
                    src={author.cover || coverPlaceholder}
                    alt={`${author.cover}'s`}
                  />

                  <div className="app-social">
                    {(author.facebook || author.instagram || author.telegram) && (
                      <p className="app-contacts">Contacts:</p>
                    )}
                    {author.facebook && (
                      <a href={author.facebook} target="_blank" rel="noopener noreferrer">
                        <img src={facebook} alt="facebook" />
                      </a>
                    )}
                    {author.instagram && (
                      <a href={author.instagram} target="_blank" rel="noopener noreferrer">
                        <img src={instagram} alt="instagram" />
                      </a>
                    )}
                    {author.telegram && (
                      <a href={author.telegram} target="_blank" rel="noopener noreferrer">
                        <img src={telegram} alt="telegram" />
                      </a>
                    )}
                  </div>

                  <h1 className="app-nickname">{author.nickname}</h1>

                  <div className="app-line-box">
                    <div></div>
                  </div>
                  <ul className="app-status">
                    <li className="app-item">
                      <p>
                        Country: <span>{author.country}</span>
                      </p>
                    </li>
                    <li className="app-item">
                      <p>
                        Status on the site: <span>{author.profession}</span>
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="app-tabs">
                  <button
                    className={`app-tabs-btn ${activeTab === "about" ? "app-tabs-btn-active" : ""}`}
                    onClick={() => setActiveTab("about")}
                  >
                    <LiaIdCardSolid size={24} /> About
                  </button>
                  {author.createdPosts.length === 0 ? (
                    <></>
                  ) : (
                    <button
                      className={`app-tabs-btn ${
                        activeTab === "posts" ? "app-tabs-btn-active" : ""
                      }`}
                      onClick={() => setActiveTab("posts")}
                    >
                      <HiOutlineClipboardDocumentList size={24} /> Posts (
                      {author.createdPosts.length})
                    </button>
                  )}
                </div>

                <div className="profile-tabs-content">
                  {activeTab === "about" && (
                    <div className="app-about">
                      <h2 className="app-about-title">About author</h2>
                      {stripHtml(author.aboutMe).trim() ? (
                        <p
                          className="app-about-text"
                          dangerouslySetInnerHTML={{
                            __html: author.aboutMe,
                          }}
                        ></p>
                      ) : (
                        <p className="app-about-text-not-yet">
                          {author.nickname} has not yet written anything about himself.
                        </p>
                      )}
                      <AuthorMessagesForm authorId={uid} />
                    </div>
                  )}

                  {activeTab === "posts" && (
                    <ul className="app-post-list">
                      {authorPosts.length > 0 ? (
                        authorPosts.map((post) => (
                          <li className="app-post-item" key={post.id}>
                            <Link to={`/post/${post.id}`} className="app-post-link">
                              <div className="app-post-image">
                                {post.media && post.media.length > 0 && (
                                  <img src={post.media[0]} alt="Post" />
                                )}
                              </div>
                              <div className="app-post-content">
                                <p className="app-post-date">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                <h3 className="app-post-title">{post.title}</h3>
                                <p className="app-post-text">{post.text}</p>
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <p className="app-post-no-posts">No posts yet</p>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="app-container">
                  <div className="app-info">
                    <div className="app-avatar-img">
                      <img
                        src={author.avatar || avatarPlaceholder}
                        alt={`${author.nickname}'s avatar`}
                      />
                    </div>

                    <img
                      className="app-cover"
                      src={author.cover || coverPlaceholder}
                      alt={`${author.cover}'s`}
                    />

                    <div className="app-personal">
                      <h1 className="app-nickname">{author.nickname}</h1>
                      <div className="app-social">
                        {(author.facebook || author.instagram || author.telegram) && (
                          <p className="app-contacts">Contacts:</p>
                        )}
                        {author.facebook && (
                          <a href={author.facebook} target="_blank" rel="noopener noreferrer">
                            <img src={facebook} alt="facebook" />
                          </a>
                        )}
                        {author.instagram && (
                          <a href={author.instagram} target="_blank" rel="noopener noreferrer">
                            <img src={instagram} alt="instagram" />
                          </a>
                        )}
                        {author.telegram && (
                          <a href={author.telegram} target="_blank" rel="noopener noreferrer">
                            <img src={telegram} alt="telegram" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="app-line-box">
                      <div></div>
                    </div>

                    <ul className="app-status">
                      <li className="app-item">
                        <p>
                          Country: <span>{author.country}</span>
                        </p>
                      </li>
                      <li className="app-item">
                        <p>
                          Status on the site: <span>{author.profession}</span>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="container">
                  <div className="app-tabs">
                    <button
                      className={`app-tabs-btn ${
                        activeTab === "about" ? "app-tabs-btn-active" : ""
                      }`}
                      onClick={() => setActiveTab("about")}
                    >
                      <LiaIdCardSolid size={24} /> About
                    </button>
                    {author.createdPosts.length === 0 ? (
                      <></>
                    ) : (
                      <button
                        className={`app-tabs-btn ${
                          activeTab === "posts" ? "app-tabs-btn-active" : ""
                        }`}
                        onClick={() => setActiveTab("posts")}
                      >
                        <HiOutlineClipboardDocumentList size={24} /> Posts (
                        {author.createdPosts.length})
                      </button>
                    )}
                  </div>
                </div>

                <div className="container">
                  <div className="profile-tabs-content">
                    {activeTab === "about" && (
                      <div className="app-about">
                        <h2 className="app-about-title">About author</h2>
                        {stripHtml(author.aboutMe).trim() ? (
                          <p
                            className="app-about-text"
                            dangerouslySetInnerHTML={{
                              __html: author.aboutMe,
                            }}
                          ></p>
                        ) : (
                          <p className="app-about-text-not-yet">
                            {author.nickname} has not yet written anything about himself.
                          </p>
                        )}
                        <AuthorMessagesForm authorId={uid} />
                      </div>
                    )}

                    {activeTab === "posts" && (
                      <ul className="app-post-list">
                        {authorPosts.length > 0 ? (
                          authorPosts.map((post) => (
                            <li className="app-post-item" key={post.id}>
                              <Link to={`/post/${post.id}`} className="app-post-link">
                                <div className="app-post-image">
                                  {post.media && post.media.length > 0 && (
                                    <img src={post.media[0]} alt="Post" />
                                  )}
                                </div>
                                <div className="app-post-content">
                                  <p className="app-post-date">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </p>
                                  <h3 className="app-post-title">{post.title}</h3>
                                  <p className="app-post-text">{post.text}</p>
                                </div>
                              </Link>
                            </li>
                          ))
                        ) : (
                          <p className="app-post-no-posts">No posts yet</p>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
      <PopularPosts />
    </>
  );
};

export default AuthorProfile;
