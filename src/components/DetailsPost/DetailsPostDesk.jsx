import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import MediaCarousel from '../MediaCarousel/MediaCarousel';
import Quiz from '../Quiz';
import Poll from '../Poll';
import CommentsForm from '../CommentsForm/CommentsForm';
import CommentsList from '../CommentsList/CommentsList';

import { HiArrowLongLeft } from 'react-icons/hi2';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import { BiComment } from 'react-icons/bi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa6';

const DetailsPostDesk = ({
  auth,
  author,
  handleAvatarClick,
  post,
  handleGoBack,
  user,
  handleEditPost,
  handleLike,
  liked,
  likesCount,
  commentsCount,
  toggleCommentsVisibility,
  commentsVisible,
  handleSavePost,
  isSaved,
  postId,
  handleCommentDeleted,
  handleCommentAdded,
  handleBack,
  isTablet,
}) => {
  return (
    <div className="container">
      <div className="details-wrapper">
        <div className="details-author-box">
          <div className="details-author-info" onClick={handleAvatarClick}>
            <div className="avatarMediumUnchanging">
              {author?.avatar ? (
                <img src={author.avatar} alt="Post author" />
              ) : (
                <div className="details-placeholder">
                  {author?.nickname ? author.nickname.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <div className="details-nickname-box">
              <p className="aboutMeText">{author?.nickname || 'Unknown Author'}</p>
              <p className="dateTextUnchanging">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="details-post-options">
            <button className="details-back" onClick={handleGoBack}>
              {isTablet ? <HiArrowLongLeft size={24} /> : <HiArrowLongLeft size={28} />}
              Go back
            </button>
            {user?.uid === post?.author?.uid && (
              <button className="btnModerateFill" onClick={handleEditPost}>
                Edit post
              </button>
            )}
          </div>
        </div>

        <h2 className="details-title postTitle">{post.title}</h2>

        <div className="details-media">
          {post.media.length > 1 ? (
            <MediaCarousel media={post.media} />
          ) : post.media[0].includes('.mp4') ? (
            <video controls>
              <source src={post.media[0]} type="video/mp4" />
              Your browser does not support video.
            </video>
          ) : (
            <img src={post.media[0]} alt="Post media" />
          )}
        </div>

        <p className="details-text nicknameText">
          {/* {post.text} */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => (
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }} {...props} />
              ),
            }}
          >
            {post.text || ''}
          </ReactMarkdown>
        </p>

        <div className="details-exam-box">
          {post.quiz && post.quiz.question && post.quiz.answers && (
            <Quiz quizData={post.quiz} user={user} />
          )}
          {post.poll && <Poll pollData={post.poll} postId={postId} />}
        </div>

        <div className="details-border">
          <div></div>
        </div>

        <div className="details-options">
          <div className="details-icons">
            <button className="details-icon" onClick={handleLike}>
              {liked ? (
                <FaHeart size={24} style={{ color: 'var(--text-error)' }} />
              ) : (
                <FaRegHeart size={24} style={{ color: 'var(--text-black)' }} />
              )}
              <span>{likesCount}</span>
            </button>
            <div className="details-icon">
              <FiEye size={24} style={{ color: 'var(--text-black)' }} />
              <span>{post.views}</span>
            </div>
            <div className="details-icon">
              <BiComment size={24} style={{ color: 'var(--text-black)' }} />
              <span>{commentsCount}</span>
            </div>
          </div>

          <div className="details-btn-view-box">
            <button className="details-btn-view" onClick={toggleCommentsVisibility}>
              {commentsVisible ? 'Hide comments' : 'View comments'}
              {commentsVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </button>
          </div>

          <button
            className="details-btn-saved"
            onClick={handleSavePost}
            disabled={!auth.currentUser || isSaved}
            style={{
              cursor: !auth.currentUser || isSaved ? 'not-allowed' : 'pointer',
            }}
          >
            {!auth.currentUser || isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
          </button>
        </div>

        {isTablet ? (
          <>
            {commentsVisible && (
              <div className="details-comments">
                <CommentsForm postId={postId} onCommentAdded={handleCommentAdded} />

                <div className="details-scroll">
                  <CommentsList
                    postId={postId}
                    user={user}
                    onCommentDeleted={handleCommentDeleted}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="details-comments">
            <div className="details-scroll">
              <CommentsList postId={postId} user={user} onCommentDeleted={handleCommentDeleted} />
            </div>
            <div className="details-form">
              <CommentsForm postId={postId} onCommentAdded={handleCommentAdded} />
            </div>
          </div>
        )}
      </div>

      <div className="details-return-box">
        <button className="btnHighTransparent" onClick={handleBack}>
          Back to homepage
        </button>
      </div>
    </div>
  );
};

export default DetailsPostDesk;
