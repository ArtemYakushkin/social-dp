import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";
import Loader from "../components/Loader";
import PopularPosts from "../components/PopularPosts";

import coverPlaceholder from "../assets/cover-img.jpg";
import avatarPlaceholder from "../assets/avatar.png";

import "../styles/AboutProfilePage.css";

const AuthorProfile = () => {
  const { uid } = useParams();
  const [author, setAuthor] = useState(null);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

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
                  <div className="app-about">
                    <h2 className="app-about-title">About author</h2>
                    <p
                      className="app-about-text"
                      dangerouslySetInnerHTML={{
                        __html: author.aboutMe,
                      }}
                    ></p>
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

                <div className="app-about">
                  <h2 className="app-about-title">About author</h2>
                  <p
                    className="app-about-text"
                    dangerouslySetInnerHTML={{
                      __html: author.aboutMe,
                    }}
                  ></p>
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
                  <div className="app-about">
                    <h2 className="app-about-title">About author</h2>
                    <p
                      className="app-about-text"
                      dangerouslySetInnerHTML={{
                        __html: author.aboutMe,
                      }}
                    ></p>
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
