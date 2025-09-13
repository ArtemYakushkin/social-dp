import { useNavigate } from 'react-router-dom';

import CommentsReplyForm from '../CommentsReplyForm/CommentsReplyForm';
import ReplyList from '../ReplyList';

import { FaPlus, FaMinus } from 'react-icons/fa6';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const CommentsItem = ({
  comment,
  user,
  postId,
  activeCommentId,
  toggleReplyList,
  setIsEditing,
  setIsDeleting,
  setSelectedComment,
  setEditedText,
  handleLike,
  isMobile,
}) => {
  const navigate = useNavigate();

  return (
    <div className={isMobile ? 'container' : ''}>
      <div className="entry-item">
        <div className="entry-top">
          <div
            className="entry-avatar avatarMedium"
            onClick={() => navigate(`/author/${comment.author.id}`)}
          >
            {comment.author.avatar ? (
              <img src={comment.author.avatar} alt="Avatar" />
            ) : (
              <div className="entry-placeholder">
                {comment.author.nickname ? comment.author.nickname.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <div className="entry-content">
            <div className="entry-info">
              <div className="entry-header">
                <div className="entry-user">
                  <p className="entryUser">{comment.author.nickname}</p>
                  <p className="dateText">
                    {comment.createdAt && comment.createdAt.toDate
                      ? comment.createdAt.toDate().toLocaleString('ru-RU', {
                          timeZone: 'Europe/Moscow',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Date not available'}
                  </p>
                </div>

                {isMobile && (
                  <>
                    {comment.author.id === user?.uid && isMobile && (
                      <div className="entry-actions-mob">
                        <button
                          className="entry-btn"
                          onClick={() => {
                            setIsEditing(true);
                            setSelectedComment(comment);
                            setEditedText(comment.text);
                          }}
                        >
                          <AiOutlineEdit size={20} />
                        </button>
                        <button
                          className="entry-btn"
                          onClick={() => {
                            setIsDeleting(true);
                            setSelectedComment(comment);
                          }}
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="mesText">{comment.text}</p>
            </div>
          </div>
        </div>

        <div className="entry-center">
          <div className="entry-actions">
            <button className="btnNotShell" onClick={() => toggleReplyList(comment.id)}>
              {activeCommentId === comment.id ? 'Cancel reply' : 'Reply to comment'}
            </button>

            {!isMobile && comment.author.id === user?.uid && (
              <>
                <button
                  className="btnNotShell"
                  onClick={() => {
                    setIsEditing(true);
                    setSelectedComment(comment);
                    setEditedText(comment.text);
                  }}
                >
                  Edit comment
                </button>
                <button
                  className="btnNotShell"
                  onClick={() => {
                    setIsDeleting(true);
                    setSelectedComment(comment);
                  }}
                >
                  Delete comment
                </button>
              </>
            )}
          </div>

          <button className="entry-btn-like" onClick={() => handleLike(comment.id, comment.likes)}>
            {comment.likes.includes(user?.uid) ? (
              <FaHeart size={isMobile ? 20 : 24} style={{ color: 'var(--text-error)' }} />
            ) : (
              <FaRegHeart size={isMobile ? 20 : 24} style={{ color: 'var(--text-black)' }} />
            )}
            <span>{comment.likes.length}</span>
          </button>
        </div>

        {activeCommentId === comment.id && (
          <div className="entry-reply-box">
            <CommentsReplyForm commentId={comment.id} postId={postId} user={user} />
            <ReplyList commentId={comment.id} currentUser={user} />
          </div>
        )}

        <div className="entry-bottom">
          <span></span>
          <button className="entry-more-btn" onClick={() => toggleReplyList(comment.id)}>
            {activeCommentId === comment.id ? (
              <>
                <div>
                  <FaMinus size={14} />
                </div>
                <p>hide replies</p>
              </>
            ) : (
              <>
                <div>
                  <FaPlus size={14} />
                </div>
                <p>more replies</p>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsItem;
