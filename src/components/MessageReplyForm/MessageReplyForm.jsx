import { useState, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';

import { isEnglishOnly } from '../../utils/validation';
import { uploadImage, sendReply, sendReplyNotification } from '../../utils/messageReplyFormUtils';
import { useClickOutside } from '../../hooks/useClickOutside';

import ModalGifSearch from '../ModalGifSearch';

import { BsEmojiSmile } from 'react-icons/bs';
import { HiOutlineGif } from 'react-icons/hi2';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { GoImage } from 'react-icons/go';
import { IoSend } from 'react-icons/io5';

const MessageReplyForm = ({ replyToMessage, currentUser }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [gifFile, setGifFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [error, setError] = useState('');

  const emojiPickerRef = useRef(null);
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1259px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });


  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleSend = async () => {
    if (!text.trim() && !imageFile && !gifFile) {
      setError("You can't send an empty message.");
      return;
    }

    if (text.trim() && !isEnglishOnly(text.trim())) {
      setError('Only English characters are allowed.');
      return;
    }

    let imageUrl = null;
    let gifUrl = null;

    try {
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (gifFile) {
        gifUrl = gifFile;
      }

      await sendReply({ replyToMessage, currentUser, text, imageUrl, gifUrl });
      await sendReplyNotification(replyToMessage.senderId, currentUser);

      setText('');
      setImage(null);
      setImageFile(null);
      setGif(null);
      setGifFile(null);
      setShowEmojiPicker(false);
      setError('');
      toast.success('Reply sent successfully!');
    } catch (err) {
      console.error('Error sending reply:', err);
      toast.error('Failed to send message.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="replyForm">
      {gif && (
        <div className="replyForm-preview">
          <img src={gif} alt="gif-preview" />
          <button className="replyForm-btn-close" onClick={() => setGif(null)}>
            <IoIosCloseCircleOutline size={24} />
          </button>
        </div>
      )}

      {image && (
        <div className="replyForm-preview">
          <img src={image} alt="preview" />
          <button className="replyForm-btn-close" onClick={() => setImage(null)}>
            <IoIosCloseCircleOutline size={24} />
          </button>
        </div>
      )}

      <textarea
        className="replyForm-textarea nicknameText"
        placeholder="Reply to message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
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

          <button
            className="replyForm-btn"
            type="button"
            onClick={() => setIsGifModalOpen(true)}
            style={{ width: '34px', height: '34px' }}
          >
            <HiOutlineGif size={34} />
          </button>

          <label
            className="replyForm-btn"
            style={{ width: '34px', height: '34px', cursor: 'pointer' }}
          >
            <GoImage size={32} />
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>
        </div>

        <button className="replyForm-submit" onClick={handleSend}>
          <IoSend size={isTablet || isMobile ? '24' : '36'} />
        </button>
      </div>

      {showEmojiPicker && (
        <div className="replyForm-emoji" ref={emojiPickerRef}>
          <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
        </div>
      )}

      <ModalGifSearch
        isOpen={isGifModalOpen}
        onClose={() => setIsGifModalOpen(false)}
        onGifSelect={(url) => {
          setGifFile(url);
          setGif(url);
          setIsGifModalOpen(false);
        }}
      />
    </div>
  );
};

export default MessageReplyForm;
