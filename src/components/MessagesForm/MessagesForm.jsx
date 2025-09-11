import { useState, useRef, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Modal from 'react-modal';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

import { db } from '../../firebase';
import { useAuth } from '../../auth/useAuth';
import { isEnglishOnly } from '../../utils/validation';
import { uploadImage, fetchAuthorNickname, sendNotification } from '../../utils/messageFormUtils';
import { useClickOutside } from '../../hooks/useClickOutside';

import ModalGifSearch from '../ModalGifSearch';

import { BsEmojiSmile } from 'react-icons/bs';
import { HiOutlineGif } from 'react-icons/hi2';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { GoImage } from 'react-icons/go';
import { IoSend } from 'react-icons/io5';

Modal.setAppElement('#root');

const MessagesForm = ({ authorId }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [authorNickname, setAuthorNickname] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const emojiPickerRef = useRef(null);
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1259px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    if (authorId) {
      fetchAuthorNickname(authorId).then(setAuthorNickname);
    }
  }, [authorId]);

  const handleSend = async () => {
    if (!text.trim() && !imageFile && !gif) {
      setError("You can't send an empty message.");
      return;
    }

    if (text.trim() && !isEnglishOnly(text.trim())) {
      setError('Only English characters are allowed.');
      return;
    }

    let uploadedImageURL = null;
    if (imageFile) {
      try {
        uploadedImageURL = await uploadImage(imageFile, user.uid);
      } catch (err) {
        console.error('Image upload error:', err);
        toast.error('Failed to upload image.');
        return;
      }
    }

    const messageData = {
      authorId,
      senderId: user.uid,
      senderNickname: user.displayName,
      senderAvatar: user.photoURL,
      message: text,
      image: uploadedImageURL || null,
      gif: gif || null,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'authorMessages'), messageData);
      await sendNotification(authorId, user);

      setText('');
      setImage(null);
      setImageFile(null);
      setGif(null);
      setError('');
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message or notification:', error);
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

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="form">
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
            {gif && (
              <div className="form-preview">
                <img src={gif} alt="gif-preview" />
                <button className="form-btn-close" onClick={() => setGif(null)}>
                  <IoIosCloseCircleOutline size={24} />
                </button>
              </div>
            )}

            {image && (
              <div className="form-preview">
                <img src={image} alt="preview" />
                <button className="form-btn-close" onClick={() => setImage(null)}>
                  <IoIosCloseCircleOutline size={24} />
                </button>
              </div>
            )}

            <textarea
              className="form-textarea nicknameText"
              placeholder={`Write a message...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

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

                <button
                  className="form-btn"
                  type="button"
                  onClick={() => setIsGifModalOpen(true)}
                  style={{ width: '34px', height: '34px' }}
                >
                  <HiOutlineGif size={34} />
                </button>

                <label
                  className="form-btn"
                  style={{ width: '34px', height: '34px', cursor: 'pointer' }}
                >
                  <GoImage size={32} />
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              </div>

              <button className="form-submit" onClick={handleSend}>
                <IoSend size={isTablet || isMobile ? '24' : '36'} />
              </button>
            </div>

            {showEmojiPicker && (
              <div className="form-emoji" ref={emojiPickerRef}>
                <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="notRegText">Login to leave a message for {authorNickname}</p>
      )}

      <ModalGifSearch
        isOpen={isGifModalOpen}
        onClose={() => setIsGifModalOpen(false)}
        onGifSelect={(url) => {
          setGif(url);
          setIsGifModalOpen(false);
        }}
      />
    </div>
  );
};

export default MessagesForm;
