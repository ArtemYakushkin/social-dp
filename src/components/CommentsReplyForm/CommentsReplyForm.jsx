import { useState, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import RegisterPage from '../../pages/RegisterPage';
import LoginPage from '../../pages/LoginPage';

import { handleReplySubmit, handleRegisterClick } from '../../utils/commentsReplyFormUtils';
import { useAuthModals } from '../../hooks/useAuthModals';
import { useClickOutside } from '../../hooks/useClickOutside';

import { IoSend } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';

const CommentsReplyForm = ({ commentId, postId, user, onReplyAdded }) => {
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const emojiPickerRef = useRef(null);
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

  const addEmoji = (emoji) => {
    setReplyText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <>
      {user ? (
        <form
          className="replyForm"
          onSubmit={(e) =>
            handleReplySubmit({
              e,
              replyText,
              setError,
              postId,
              commentId,
              user,
              setReplyText,
              onReplyAdded,
            })
          }
        >
          <textarea
            className="replyForm-textarea nicknameText"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add your reply here"
            rows={3}
          />

          {error && <p className="replyForm-error errorText">{error}</p>}

          <div className="replyForm-options">
            <div className="replyForm-wrapper">
              <button
                type="button"
                className="replyForm-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <BsEmojiSmile size={24} />
              </button>
            </div>

            <button className="replyForm-submit" type="submit">
              <IoSend size={isTablet || isMobile ? 24 : 30} color="var(--bg-accent-blue-color)" />
            </button>
          </div>

          {showEmojiPicker && (
            <div className="replyForm-emoji" ref={emojiPickerRef}>
              <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
            </div>
          )}
        </form>
      ) : (
        <p
          className="notRegText"
          onClick={() => handleRegisterClick({ user, setIsRegisterModalOpen })}
        >
          Log in to reply
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
    </>
  );
};

export default CommentsReplyForm;
