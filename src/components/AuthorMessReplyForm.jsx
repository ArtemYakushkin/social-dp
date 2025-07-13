import { useState, useRef, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

import ModalGifSearch from "./ModalGifSearch";

import { BsEmojiSmile } from "react-icons/bs";
import { HiOutlineGif } from "react-icons/hi2";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GoImage } from "react-icons/go";
import { IoSend } from "react-icons/io5";

import "../styles/AuthorMessReplyForm.css";

const AuthorMessReplyForm = ({ replyToMessage, currentUser }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [gifFile, setGifFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [error, setError] = useState("");

  const emojiPickerRef = useRef(null);

  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });
  // const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const isEnglishOnly = (text) => {
    const regex = /^[\p{Emoji}\p{L}\p{N}\p{P}\p{Zs}\r\n]+$/u;
    const englishOnly = /^[\p{Emoji}A-Za-z0-9 .,!?'"()\-\n\r]+$/u;
    return regex.test(text.trim()) && englishOnly.test(text.trim());
  };

  const handleSend = async () => {
    if (!text.trim() && !imageFile && !gifFile) {
      setError("You can't send an empty message.");
      return;
    }

    if (text.trim() && !isEnglishOnly(text.trim())) {
      setError("Only English characters are allowed.");
      return;
    }

    let imageUrl = null;
    let gifUrl = null;

    try {
      if (imageFile) {
        const imgRef = ref(storage, `messageReplies/images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      }

      if (gifFile) {
        gifUrl = gifFile; // просто сохраняем URL
      }

      await addDoc(collection(db, "authorMessageReplies"), {
        replyToMessageId: replyToMessage.id,
        replyToAuthorId: replyToMessage.senderId,
        from: {
          uid: currentUser.uid,
          nickname: currentUser.nickname,
          avatar: currentUser.avatar,
        },
        text: text.trim(),
        image: imageUrl,
        gif: gifUrl,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, "notifications"), {
        recipientId: replyToMessage.senderId,
        sender: {
          uid: currentUser.uid,
          nickname: currentUser.nickname,
          photoURL: currentUser.avatar,
        },
        message: `${currentUser.nickname} replied to your message`,
        type: "reply_to_message",
        createdAt: serverTimestamp(),
        read: false,
      });

      // Очистка
      setText("");
      setImage(null);
      setImageFile(null);
      setGif(null);
      setGifFile(null);
      setShowEmojiPicker(false);
      setError("");
      toast.success("Reply sent successfully!");
    } catch (err) {
      console.error("Error sending reply:", err);
      toast.error("Failed to send message.");
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
    <div className="reply-mes-form">
      {gif && (
        <div className="reply-mes-preview">
          <img src={gif} alt="gif-preview" />
          <button className="reply-mes-btn-close" onClick={() => setGif(null)}>
            <IoIosCloseCircleOutline size={24} />
          </button>
        </div>
      )}

      {image && (
        <div className="reply-mes-preview">
          <img src={image} alt="preview" />
          <button className="reply-mes-btn-close" onClick={() => setImage(null)}>
            <IoIosCloseCircleOutline size={24} />
          </button>
        </div>
      )}

      <textarea
        className="reply-mes-textarea"
        placeholder="Reply to message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {error && <p className="reply-mes-error">{error}</p>}

      <div className="reply-mes-options">
        <div className="reply-mes-wrapper">
          <button
            type="button"
            className="reply-mes-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <BsEmojiSmile size={24} />
          </button>

          <button
            className="reply-mes-btn"
            type="button"
            onClick={() => setIsGifModalOpen(true)}
            style={{ width: "34px", height: "34px" }}
          >
            <HiOutlineGif size={34} />
          </button>

          <label
            className="reply-mes-btn"
            style={{ width: "34px", height: "34px", cursor: "pointer" }}
          >
            <GoImage size={32} />
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>
        </div>

        <button className="reply-mes-submit-btn" onClick={handleSend}>
          <IoSend size={isTablet ? "24" : "36"} />
        </button>
      </div>

      {showEmojiPicker && (
        <div className="reply-mes-emoji-picker" ref={emojiPickerRef}>
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

export default AuthorMessReplyForm;
