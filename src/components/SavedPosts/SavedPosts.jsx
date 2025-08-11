import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { useAuth } from "../../auth/useAuth";
import { fetchSavedPosts, filterAndSortPosts, removeSavedPost } from "../../utils/savedPostsUtils";

import OptionsSavedPosts from "../OptionsSavedPosts/OptionsSavedPosts";
import Loader from "../Loader";
import InfoBoard from "../InfoBoard/InfoBoard";

const SavedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchSavedPosts(user.uid)
      .then(setPosts)
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const filteredAndSortedPosts = useMemo(
    () => filterAndSortPosts(posts, searchQuery, sortOrder),
    [posts, searchQuery, sortOrder]
  );

  return (
    <>
      <OptionsSavedPosts
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <InfoBoard message={"You do not have any saved posts yet."} />
      ) : (
        <div className="container">
          <ul className="posts-grid" style={{ rowGap: "40px" }}>
            {filteredAndSortedPosts.reverse().map((post) => (
              <li className="grid" style={{ height: isTablet || isMobile ? "445px" : "540px" }}>
                <Link to={`/post/${post.id}`} key={post.id}>
                  <div className="grid-header">
                    <div className="grid-avatar avatarLarge">
                      {post.author.avatar && <img src={post.author.avatar} alt="Author" />}
                    </div>
                    <div className="grid-info-post">
                      <p className="nicknameText">{post.author.nickname}</p>
                      <p className="dateText">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid-content">
                    <div className="grid-image">
                      {post.media && post.media.length > 0 && (
                        <img src={post.media[0]} alt="Post" />
                      )}
                    </div>
                    <div className="grid-box-text">
                      <p className="grid-title postTitle">{post.title}</p>
                      <p className="grid-text nicknameText">{post.text}</p>
                    </div>
                  </div>
                </Link>
                <button
                  className="grid-delete"
                  onClick={() => removeSavedPost(user.uid, post.id, setPosts)}
                  title="Remove from saved"
                >
                  Delete post
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SavedPosts;
