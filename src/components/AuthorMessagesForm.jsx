import React, { useState, useRef, useEffect } from "react";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Modal from "react-modal";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

import { db } from "../firebase";
import { useAuth } from "../auth/useAuth";

import ModalGifSearch from "./ModalGifSearch";

import { BsEmojiSmile } from "react-icons/bs";
import { HiOutlineGif } from "react-icons/hi2";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GoImage } from "react-icons/go";
import { IoSend } from "react-icons/io5";

import "../styles/AuthorMessagesForm.css";

Modal.setAppElement("#root");

const AuthorMessagesForm = ({ authorId }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [authorNickname, setAuthorNickname] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const emojiPickerRef = useRef(null);

  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

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

  useEffect(() => {
    const fetchAuthorNickname = async () => {
      try {
        const docRef = doc(db, "users", authorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAuthorNickname(data.nickname || "Unknown Author");
        } else {
          setAuthorNickname("Unknown Author");
        }
      } catch (error) {
        console.error("Failed to fetch author nickname:", error);
        setAuthorNickname("Unknown Author");
      }
    };

    if (authorId) {
      fetchAuthorNickname();
    }
  }, [authorId]);

  const isEnglishOnly = (text) => {
    const regex = /^[\p{Emoji}\p{L}\p{N}\p{P}\p{Zs}\r\n]+$/u;
    const englishOnly = /^[\p{Emoji}A-Za-z0-9 .,!?'"()\-\n\r]+$/u;
    return regex.test(text.trim()) && englishOnly.test(text.trim());
  };

  const handleSend = async () => {
    if (!text.trim() && !imageFile && !gif) {
      setError("You can't send an empty message.");
      return;
    }

    if (text.trim() && !isEnglishOnly(text.trim())) {
      setError("Only English characters are allowed.");
      return;
    }

    let uploadedImageURL = null;

    if (imageFile) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `messages/${user.uid}-${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        uploadedImageURL = await getDownloadURL(storageRef);
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error("Failed to upload image.");
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
      await addDoc(collection(db, "authorMessages"), messageData);

      await addDoc(collection(db, "notifications"), {
        recipientId: authorId,
        type: "new_message",
        sender: {
          uid: user.uid,
          nickname: user.displayName,
          photoURL: user.photoURL,
        },
        message: `${user.displayName} sent you a message`,
        createdAt: serverTimestamp(),
        read: false,
      });

      setText("");
      setImage(null);
      setImageFile(null);
      setGif(null);
      setError("");
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message or notification:", error);
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

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="author-mes-section">
      <div className="author-mes-author">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Post author" />
        ) : (
          <div className="author-mes-avatar-placeholder">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>

      {isMobile ? (
        <>
          {user ? (
            <div className="author-mes-form">
              {gif && (
                <div className="author-mes-preview">
                  <img src={gif} alt="gif-preview" />
                  <button className="author-mes-btn-close" onClick={() => setGif(null)}>
                    <IoIosCloseCircleOutline size={24} />
                  </button>
                </div>
              )}

              {image && (
                <div className="author-mes-preview">
                  <img src={image} alt="preview" />
                  <button className="author-mes-btn-close" onClick={() => setImage(null)}>
                    <IoIosCloseCircleOutline size={24} />
                  </button>
                </div>
              )}

              <textarea
                className="author-mes-textarea"
                placeholder={`Write a message...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {error && <p className="author-mes-error">{error}</p>}

              <div className="author-mes-options">
                <div className="author-mes-wrapper">
                  <button
                    type="button"
                    className="author-mes-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile size={24} />
                  </button>

                  <button
                    className="author-mes-btn"
                    type="button"
                    onClick={() => setIsGifModalOpen(true)}
                    style={{ width: "34px", height: "34px" }}
                  >
                    <HiOutlineGif size={34} />
                  </button>

                  <label
                    className="author-mes-btn"
                    style={{ width: "34px", height: "34px", cursor: "pointer" }}
                  >
                    <GoImage size={32} />
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                  </label>
                </div>

                <button className="author-mes-submit-btn" onClick={handleSend}>
                  <IoSend size={isTablet ? "24" : "36"} />
                </button>
              </div>

              {showEmojiPicker && (
                <div className="author-mes-emoji-picker" ref={emojiPickerRef}>
                  <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
                </div>
              )}
            </div>
          ) : (
            <p className="author-mes-not-register">Login to leave a message for {authorNickname}</p>
          )}
        </>
      ) : (
        <>
          {user ? (
            <div className="author-mes-form">
              {gif && (
                <div className="author-mes-preview">
                  <img src={gif} alt="gif-preview" />
                  <button className="author-mes-btn-close" onClick={() => setGif(null)}>
                    <IoIosCloseCircleOutline size={24} />
                  </button>
                </div>
              )}

              {image && (
                <div className="author-mes-preview">
                  <img src={image} alt="preview" />
                  <button className="author-mes-btn-close" onClick={() => setImage(null)}>
                    <IoIosCloseCircleOutline size={24} />
                  </button>
                </div>
              )}

              <textarea
                className="author-mes-textarea"
                placeholder={`Write a message...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {error && <p className="author-mes-error">{error}</p>}

              <div className="author-mes-options">
                <div className="author-mes-wrapper">
                  <button
                    type="button"
                    className="author-mes-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile size={24} />
                  </button>

                  <button
                    className="author-mes-btn"
                    type="button"
                    onClick={() => setIsGifModalOpen(true)}
                    style={{ width: "34px", height: "34px" }}
                  >
                    <HiOutlineGif size={34} />
                  </button>

                  <label
                    className="author-mes-btn"
                    style={{ width: "34px", height: "34px", cursor: "pointer" }}
                  >
                    <GoImage size={32} />
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                  </label>
                </div>

                <button className="author-mes-submit-btn" onClick={handleSend}>
                  <IoSend size={isTablet ? "24" : "36"} />
                </button>
              </div>

              {showEmojiPicker && (
                <div className="author-mes-emoji-picker" ref={emojiPickerRef}>
                  <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
                </div>
              )}
            </div>
          ) : (
            <p className="author-mes-not-register">Login to leave a message for {authorNickname}</p>
          )}
        </>
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

export default AuthorMessagesForm;
