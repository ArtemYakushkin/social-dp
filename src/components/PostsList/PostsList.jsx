import React, { useEffect, useState } from "react";

import { useAuth } from "../../auth/useAuth";

import GridPost from "./GridPost";
import FlexPost from "./FlexPost";
import UnregisteredModal from "../UnregisteredModal";
import Loader from "../Loader";

import { loadAuthors, handleLikePost, initLikesState } from "../../utils/postUtils";

const PostsList = ({ posts, isLoading, viewMode, onSeeMore, showSeeMore }) => {
  const { user } = useAuth();
  const [authors, setAuthors] = useState({});
  const [modalOpenId, setModalOpenId] = useState(null);
  const [likesState, setLikesState] = useState({});

  useEffect(() => {
    const fetchAuthors = async () => {
      const newAuthors = await loadAuthors(posts, authors);
      if (Object.keys(newAuthors).length > 0) {
        setAuthors((prev) => ({ ...prev, ...newAuthors }));
      }
    };

    if (!isLoading) fetchAuthors();
  }, [posts, isLoading, authors]);

  useEffect(() => {
    setLikesState(initLikesState(posts, user));
  }, [posts, user]);

  const handleLike = (postId) => handleLikePost({ postId, user, setLikesState, setModalOpenId });

  return (
    <div className="container">
      <div className="posts-wrapp">
        {isLoading ? (
          <Loader />
        ) : posts.length > 0 ? (
          <div className={viewMode === "grid" ? "posts-grid" : "posts-flex"}>
            {posts.map((post) => {
              const author = authors[post.author?.uid] || null;
              const { liked, likesCount } = likesState[post.id] || {
                liked: false,
                likesCount: post.likes.length,
              };
              const viewsCount = post.views || 0;

              return (
                <React.Fragment key={post.id}>
                  {viewMode === "grid" ? (
                    <GridPost
                      post={post}
                      author={author}
                      liked={liked}
                      likesCount={likesCount}
                      viewsCount={viewsCount}
                      handleLike={() => handleLike(post.id)}
                    />
                  ) : (
                    <FlexPost
                      post={post}
                      author={author}
                      liked={liked}
                      likesCount={likesCount}
                      viewsCount={viewsCount}
                      handleLike={() => handleLike(post.id)}
                    />
                  )}

                  <UnregisteredModal
                    isOpen={modalOpenId === post.id}
                    onClose={() => setModalOpenId(null)}
                  />
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <h3 className="posts-no-posts sectionTitle">No posts found</h3>
        )}

        {!isLoading && showSeeMore && (
          <div className="posts-more-box">
            <button className="btnHighFill" onClick={onSeeMore}>
              See more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
