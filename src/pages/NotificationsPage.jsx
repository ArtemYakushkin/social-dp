import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  limit,
  startAfter,
} from "firebase/firestore";

import { useAuth } from "../auth/useAuth";
import { db } from "../firebase";

import PopularPosts from "../components/PopularPosts";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoCheckmarkCircleOutline, IoCheckmarkCircleSharp } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";

import "../styles/NotificationsPage.css";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const options = ["All", "Only unread"];
  const selectedOption = filter === "all" ? "All" : "Only unread";

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    const value = option === "All" ? "all" : "unread";
    setFilter(value);
    setNotifications([]);
    setLastVisible(null);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!user) return;

    const fetchInitialNotifications = async () => {
      try {
        let q;

        if (filter === "unread") {
          q = query(
            collection(db, "notifications"),
            where("recipientId", "==", user.uid),
            where("read", "==", false),
            orderBy("createdAt", "desc"),
            limit(10)
          );
        } else {
          q = query(
            collection(db, "notifications"),
            where("recipientId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(10)
          );
        }

        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setNotifications(docs);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === 10);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    setNotifications([]);
    setLastVisible(null);
    fetchInitialNotifications();
  }, [user, filter]);

  const loadMoreNotifications = async () => {
    if (!lastVisible || !user) return;

    try {
      let q;

      if (filter === "unread") {
        q = query(
          collection(db, "notifications"),
          where("recipientId", "==", user.uid),
          where("read", "==", false),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(10)
        );
      } else {
        q = query(
          collection(db, "notifications"),
          where("recipientId", "==", user.uid),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(10)
        );
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setNotifications((prev) => [...prev, ...docs]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 10);
    } catch (error) {
      console.error("Error loading more notifications:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await updateDoc(doc(db, "notifications", notification.id), { read: true });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }

    if (notification.type === "new_post") {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === "new_comment") {
      navigate(`/post/${notification.postId}#comment-${notification.commentId}`);
    } else if (notification.type === "new_reply") {
      navigate(`/post/${notification.postId}#reply-${notification.replyId}`);
    } else if (notification.type === "new_message") {
      navigate("/profile");
    } else if (notification.type === "reply_to_message") {
      navigate(`/author/${notification.sender.uid}`);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="notifi">
          <div className="notifi-wrapp">
            <div className="container">
              <div className="notifi-header">
                <h2 className="notifi-title">Notifications</h2>
                <div className="notifi-dropdown" ref={dropdownRef}>
                  <div className="notifi-dropdown-header" onClick={toggleDropdown}>
                    <span className="notifi-dropdown-title">Show:</span>
                    <span className="notifi-dropdown-selected">{selectedOption}</span>
                    <span className="notifi-dropdown-icon">
                      {isOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </span>
                  </div>
                  {isOpen && (
                    <ul className="notifi-dropdown-list">
                      {options.map((option) => (
                        <li
                          key={option}
                          className="notifi-dropdown-item"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <ul className="notifi-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const { message, sender, read } = notification;
                    const parts = message.split(sender.nickname);
                    const isRead = read;

                    return (
                      <li className={`notifi-item ${isRead ? "read" : ""}`} key={notification.id}>
                        <div className="notifi-content">
                          <div
                            className="notifi-avatar"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            {sender?.photoURL ? (
                              <img src={sender.photoURL} alt={sender.nickname} />
                            ) : (
                              <div className="notifi-avatar-placeholder">
                                {sender?.nickname ? sender.nickname.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                          </div>

                          <div
                            className="notifi-text"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <p className="notifi-message">
                              {parts[0]}
                              <span className="notifi-nickname">{sender.nickname}</span>
                              {parts[1]}
                            </p>
                            <p className="notifi-date">
                              {notification.createdAt?.toDate
                                ? notification.createdAt.toDate().toLocaleString("ru-RU", {
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
                        </div>

                        <div className="notifi-dots">
                          <button
                            className="notifi-actions-btn"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {isRead ? (
                              <IoCheckmarkCircleSharp size={20} />
                            ) : (
                              <IoCheckmarkCircleOutline size={20} />
                            )}
                          </button>

                          <button
                            className="notifi-actions-btn"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <AiOutlineDelete size={20} />
                          </button>

                          {!isRead && <div className="notifi-point-read"></div>}
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <p style={{ color: "var(--text-black)" }}>No notifications</p>
                )}
              </ul>

              {hasMore && (
                <div className="notifi-more-btn-box">
                  <button className="notifi-more-btn" onClick={loadMoreNotifications}>
                    View previous notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="notifi">
          <div className="container">
            <div className="notifi-wrapp">
              <div className="notifi-header">
                <h2 className="notifi-title">Notifications</h2>
                <div className="notifi-dropdown" ref={dropdownRef}>
                  <div className="notifi-dropdown-header" onClick={toggleDropdown}>
                    <span className="notifi-dropdown-title">Show:</span>
                    <span className="notifi-dropdown-selected">{selectedOption}</span>
                    <span className="notifi-dropdown-icon">
                      {isOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </span>
                  </div>
                  {isOpen && (
                    <ul className="notifi-dropdown-list">
                      {options.map((option) => (
                        <li
                          key={option}
                          className="notifi-dropdown-item"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <ul className="notifi-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const { message, sender, read } = notification;
                    const parts = message.split(sender.nickname);
                    const isRead = read;

                    return (
                      <li className={`notifi-item ${isRead ? "read" : ""}`} key={notification.id}>
                        <div
                          className="notifi-avatar"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          {sender?.photoURL ? (
                            <img src={sender.photoURL} alt={sender.nickname} />
                          ) : (
                            <div className="notifi-avatar-placeholder">
                              {sender?.nickname ? sender.nickname.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                        </div>

                        <div
                          className="notifi-text"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <p className="notifi-message">
                            {parts[0]}
                            <span className="notifi-nickname">{sender.nickname}</span>
                            {parts[1]}
                          </p>
                          <p className="notifi-date">
                            {notification.createdAt?.toDate
                              ? notification.createdAt.toDate().toLocaleString("ru-RU", {
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

                        <div className="notifi-dots">
                          <button
                            className="notifi-actions-btn"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {isRead ? (
                              <IoCheckmarkCircleSharp size={20} />
                            ) : (
                              <IoCheckmarkCircleOutline size={20} />
                            )}
                          </button>

                          <button
                            className="notifi-actions-btn"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <AiOutlineDelete size={20} />
                          </button>

                          {!isRead && <div className="notifi-point-read"></div>}
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <p style={{ color: "var(--text-black)" }}>No notifications</p>
                )}
              </ul>

              {hasMore && (
                <div className="notifi-more-btn-box">
                  <button className="notifi-more-btn" onClick={loadMoreNotifications}>
                    View previous notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PopularPosts />
    </>
  );
};

export default NotificationsPage;
