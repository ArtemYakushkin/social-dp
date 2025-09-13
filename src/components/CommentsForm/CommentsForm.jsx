import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import RegisterPage from '../../pages/RegisterPage';
import LoginPage from '../../pages/LoginPage';

import { useAuth } from '../../auth/useAuth';
import { handleCommentSubmit, addEmoji, handleRegisterClick } from '../../utils/commentsFormUtils';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useAuthModals } from '../../hooks/useAuthModals';

import { IoSend } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';

const CommentsForm = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef(null);
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1259px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    const {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    openLogin,
    openRegister,
  } = useAuthModals();

  return (
    <div className={isMobile ? 'container' : ''}>
      <div className="form" style={{ padding: 0, margin: 0, borderTop: 'none' }}>
        {user ? (
          <>
            <div className="form-avatar avatarMedium">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Post author" />
              ) : (
                <div className="form-placeholder">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <div className="form-wrap">
              <form
                id="commentForm"
                onSubmit={(e) =>
                  handleCommentSubmit({
                    e,
                    commentText,
                    setError,
                    user,
                    postId,
                    setCommentText,
                    onCommentAdded,
                  })
                }
              >
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your comment here"
                  className="form-textarea nicknameText"
                />
              </form>

              {error && <p className="form-error errorText">{error}</p>}

              <div className="form-options">
                <div className="form-wrapper">
                  <button
                    type="button"
                    className="form-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile size={24} />
                  </button>
                </div>

                <button type="submit" form="commentForm" className="form-submit">
                  <IoSend size={isTablet || isMobile ? '24' : '36'} />
                </button>
              </div>

              {showEmojiPicker && (
                <div className="form-emoji" ref={emojiPickerRef}>
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => addEmoji(emoji, setCommentText, setShowEmojiPicker)}
                    theme="light"
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <p
            className="notRegText"
            onClick={() => handleRegisterClick(user, setIsRegisterModalOpen, toast)}
          >
            Log in to comment
          </p>
        )}

        {isRegisterModalOpen && (
          <RegisterPage
            isVisible={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            openLogin={openLogin}
          />
        )}

        {isLoginModalOpen && (
          <LoginPage
            isVisible={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            openRegister={openRegister}
          />
        )}
      </div>
    </div>
  );
};

export default CommentsForm;