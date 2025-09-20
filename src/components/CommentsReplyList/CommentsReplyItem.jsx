import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const CommentsReplyItem = ({
  reply,
  currentUser,
  setIsEditing,
  setIsDeleting,
  setSelectedReply,
  setEditedText,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const navigate = useNavigate();

  return (
    <div className="reply-item">
      <span></span>

      <div className="reply-top">
        <div
          className="reply-avatar avatarSmallMedium"
          onClick={() => navigate(`/author/${reply.author.uid}`)}
        >
          {reply.author.avatar ? (
            <img src={reply.author.avatar} alt="Avatar" />
          ) : (
            <div className="reply-avatar-initial">
              {reply.author.nickname ? reply.author.nickname.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <div className="reply-content">
          <div className="reply-info">
            <div className="reply-header">
              <div className="reply-user">
                <p className="entryUser">{reply.author.nickname}</p>
                <p className="dateText">
                  {reply.createdAt && reply.createdAt.toDate
                    ? reply.createdAt.toDate().toLocaleString('ru-RU', {
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
                  {reply.author.uid === currentUser?.uid && (
                    <div className="reply-actions-mob">
                      <button
                        className="reply-btn"
                        onClick={() => {
                          setIsEditing(true);
                          setSelectedReply(reply);
                          setEditedText(reply.text);
                        }}
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                      <button
                        className="reply-btn"
                        onClick={() => {
                          setIsDeleting(true);
                          setSelectedReply(reply);
                        }}
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <p className="mesText">{reply.text}</p>
          </div>

          {reply.author.uid === currentUser?.uid && (
            <div className="reply-actions">
              <button
                className="btnNotShell"
                onClick={() => {
                  setIsEditing(true);
                  setSelectedReply(reply);
                  setEditedText(reply.text);
                }}
              >
                Edit Reply
              </button>
              <button
                className="btnNotShell"
                onClick={() => {
                  setIsDeleting(true);
                  setSelectedReply(reply);
                }}
              >
                Delete Reply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsReplyItem;
