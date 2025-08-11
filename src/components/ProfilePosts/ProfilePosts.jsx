import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../auth/useAuth";
import { fetchUserPostsData, filterAndSortPosts } from "../../utils/profilePostsUtils";

import Loader from "../Loader";
import OptionsProfilePosts from "../OptionsProfilePosts/OptionsProfilePosts";

import { FaRegHeart } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { BiComment } from "react-icons/bi";

const ProfilePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("New");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchUserPostsData(user.uid)
      .then(setPosts)
      .catch((err) => console.error("Error loading posts:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSearchChange = (query) => setSearchQuery(query);

  const handleSortChange = (option) => setSortOption(option);

  const filteredPosts = useMemo(
    () => filterAndSortPosts(posts, searchQuery, sortOption),
    [posts, searchQuery, sortOption]
  );

  return (
    <>
      <OptionsProfilePosts
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchChange={handleSearchChange}
        selectedOption={sortOption}
        onSortChange={handleSortChange}
      />

      <div className="container">
        {loading ? (
          <Loader />
        ) : (
          <ul className="posts-grid">
            {filteredPosts.map((post) => (
              <Link to={`/post/${post.id}`} key={post.id}>
                <li className="grid" style={{ height: "580px" }}>
                  <div className="grid-header">
                    <p className="dateText">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="grid-content">
                    <div className="grid-image">
                      {post.media && post.media.length > 0 && (
                        <img src={post.media[0]} alt="Post" />
                      )}
                    </div>

                    <div className="grid-box-text">
                      <h3 className="grid-title postTitle">{post.title}</h3>
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
                          <FaRegHeart size={24} style={{ color: "var(--text-black)" }} />
                          <span>{post.likes?.length || 0}</span>
                        </div>
                        <div className="grid-icon">
                          <FiEye size={24} style={{ color: "var(--text-black)" }} />
                          <span>{post.views}</span>
                        </div>
                        <div className="grid-icon">
                          <BiComment size={24} style={{ color: "var(--text-black)" }} />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProfilePosts;
