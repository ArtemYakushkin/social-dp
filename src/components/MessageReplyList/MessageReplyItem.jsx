import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const MessageReplyItem = ({
  reply,
  isMobile,
  currentUser,
  setIsEditing,
  setSelectedReply,
  setEditedText,
  setIsDeleting,
  setModalImageUrl,
  setIsModalImage,
}) => {
  return (
    <>
      <div className="reply-item">
        <span></span>

        <div className="reply-top">
          <div className="reply-avatar avatarSmallMedium">
            {reply.from.avatar ||
            (reply.from.nickname && reply.from.nickname.charAt(0).toUpperCase()) ? (
              typeof reply.from.avatar === 'string' && reply.from.avatar.length > 1 ? (
                <img src={reply.from.avatar} alt="Avatar" />
              ) : (
                <div className="reply-avatar-initial">{reply.from.avatar}</div>
              )
            ) : (
              <div className="reply-avatar-initial">U</div>
            )}
          </div>

          <div className="reply-content">
            <div className="reply-info">
              <div className="reply-header">
                <div className="reply-user">
                  <p className="entryUser">{reply.from.nickname}</p>
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
                    {reply.from.uid === currentUser?.uid && (
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

              {reply.gif && (
                <div
                  className="reply-media"
                  onClick={() => {
                    setModalImageUrl(reply.gif);
                    setIsModalImage(true);
                  }}
                >
                  <img src={reply.gif} alt="gif" />
                </div>
              )}

              {reply.image && (
                <div
                  className="reply-media"
                  onClick={() => {
                    setModalImageUrl(reply.image);
                    setIsModalImage(true);
                  }}
                >
                  <img src={reply.image} alt="reply" />
                </div>
              )}
            </div>

            {reply.from.uid === currentUser?.uid && (
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
    </>
  );
};

export default MessageReplyItem;
