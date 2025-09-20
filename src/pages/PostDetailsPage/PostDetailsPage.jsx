import { usePostDetails } from '../../hooks/usePostDetails';

import Loader from '../../components/Loader';
import PopularPosts from '../../components/PopularPosts/PopularPosts';
import ShareBlock from '../../components/ShareBlok/ShareBlok';
import UnregisteredModal from '../../components/UnregisteredModal';
import DetailsPostDesk from '../../components/DetailsPost/DetailsPostDesk';
import DetailsPostMob from '../../components/DetailsPost/DetailsPostMob';

const PostDetailsPage = () => {
  const {
    auth,
    post,
    author,
    error,
    commentsVisible,
    commentsCount,
    isModalOpen,
    setIsModalOpen,
    liked,
    likesCount,
    isSaved,
    isTablet,
    isMobile,
    handleLike,
    handleSavePost,
    handleBack,
    handleGoBack,
    handleAvatarClick,
    toggleCommentsVisibility,
    handleCommentAdded,
    handleCommentDeleted,
    handleEditPost,
    user,
    postId,
  } = usePostDetails();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="details">
        {isMobile ? (
          <>
            {post ? (
              <DetailsPostMob               
                auth={auth}
                author={author}
                handleAvatarClick={handleAvatarClick}
                post={post}
                handleGoBack={handleGoBack}
                user={user}
                handleEditPost={handleEditPost}
                handleLike={handleLike}
                liked={liked}
                likesCount={likesCount}
                commentsCount={commentsCount}
                handleSavePost={handleSavePost}
                isSaved={isSaved}
                postId={postId}
                handleCommentDeleted={handleCommentDeleted}
                handleCommentAdded={handleCommentAdded}
                handleBack={handleBack} 
              />
            ) : (
              <Loader />
            )}
          </>
        ) : (
          <>
            {post ? (
              <DetailsPostDesk
                auth={auth}
                author={author}
                handleAvatarClick={handleAvatarClick}
                post={post}
                handleGoBack={handleGoBack}
                user={user}
                handleEditPost={handleEditPost}
                handleLike={handleLike}
                liked={liked}
                likesCount={likesCount}
                commentsCount={commentsCount}
                toggleCommentsVisibility={toggleCommentsVisibility}
                commentsVisible={commentsVisible}
                handleSavePost={handleSavePost}
                isSaved={isSaved}
                postId={postId}
                handleCommentDeleted={handleCommentDeleted}
                handleCommentAdded={handleCommentAdded}
                handleBack={handleBack}
                isTablet={isTablet}
              />
            ) : (
              <Loader />
            )}
          </>
        )}

        <PopularPosts />

        <ShareBlock />
      </div>

      <UnregisteredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default PostDetailsPage;
