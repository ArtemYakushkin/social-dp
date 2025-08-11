import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import AuthorMessReplyForm from "../AuthorMessReplyForm";
import AuthorMessReplyList from "../AuthorMessReplyList";

import { FaPlus, FaMinus } from "react-icons/fa6";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const MessageItem = ({
  msg,
  user,
  isOwnerPage,
  activeMessageId,
  toggleReplyList,
  setModalImageUrl,
  setIsModalImage,
  onEdit,
  onDelete,
  showReplyForm,
}) => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <li className="entry-item">
      <div className="entry-top">
        <div
          className="entry-avatar avatarMedium"
          onClick={() => navigate(`/author/${msg.senderId}`)}
        >
          {msg.senderAvatar ? (
            <img src={msg.senderAvatar} alt="Avatar" />
          ) : (
            <div className="entry-placeholder">
              {msg.senderNickname ? msg.senderNickname.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        <div className="entry-content">
          <div className="entry-info">
            <div className="entry-header">
              <div className="entry-user">
                <p className="entryUser">{msg.senderNickname}</p>
                <p className="dateText">
                  {msg.createdAt?.toDate
                    ? msg.createdAt.toDate().toLocaleString("ru-RU", {
                        timeZone: "Europe/Moscow",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Date not available"}
                </p>
              </div>

              {isMobile && (
                <>
                  {msg.senderId === user.uid && (
                    <div className="entry-actions-mob">
                      <button className="entry-btn" onClick={() => onEdit(msg)}>
                        <AiOutlineEdit size={20} />
                      </button>
                      <button className="entry-btn" onClick={() => onDelete(msg)}>
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <p className="mesText">{msg.message}</p>

            {msg.gif && (
              <div
                className="entry-media"
                onClick={() => {
                  setModalImageUrl(msg.gif);
                  setIsModalImage(true);
                }}
              >
                <img src={msg.gif} alt="gif" />
              </div>
            )}

            {msg.image && (
              <div
                className="entry-media"
                onClick={() => {
                  setModalImageUrl(msg.image);
                  setIsModalImage(true);
                }}
              >
                <img src={msg.image} alt="message" />
              </div>
            )}
          </div>

          {msg.senderId === user.uid && (
            <div className="entry-actions">
              <button className="btnNotShell" onClick={() => onEdit(msg)}>
                Edit message
              </button>
              <button className="btnNotShell" onClick={() => onDelete(msg)}>
                Delete message
              </button>
            </div>
          )}
        </div>
      </div>

      {isOwnerPage && (
        <div className="entry-center">
          <button className="btnNotShell" onClick={() => toggleReplyList(msg.id)}>
            {activeMessageId === msg.id ? "Cancel reply" : "Reply to message"}
          </button>
        </div>
      )}

      {activeMessageId === msg.id && (
        <div className="entry-reply-box">
          {showReplyForm && (
            <AuthorMessReplyForm
              replyToMessage={msg}
              currentUser={{
                uid: user.uid,
                nickname: user.displayName,
                avatar: user.photoURL,
              }}
            />
          )}
          <AuthorMessReplyList messageId={msg.id} />
        </div>
      )}

      <div className="entry-bottom">
        <span></span>
        <button className="entry-more-btn" onClick={() => toggleReplyList(msg.id)}>
          {activeMessageId === msg.id ? (
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
    </li>
  );
};

export default MessageItem;
