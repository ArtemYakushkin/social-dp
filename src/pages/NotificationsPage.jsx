import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

import PopularPosts from "../components/PopularPosts";

import "../styles/NotificationsPage.css";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated");
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationClick = async (notification) => {
    if (notification.type === "new_post") {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === "new_comment") {
      navigate(`/post/${notification.postId}#comment-${notification.commentId}`);
    } else if (notification.type === "new_reply") {
      navigate(`/post/${notification.postId}#reply-${notification.replyId}`);
    }

    await deleteDoc(doc(db, "notifications", notification.id));
  };

  // const { message, sender } = notification;
  // const parts = message.split(sender.nickname);

  return (
    <>
      <div className="notifi">
        <div className="container">
          <div className="notifi-wrapp">
            <h2 className="notifi-title">Notifications</h2>
            <ul className="notifi-list">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const { message, sender } = notification;
                  const parts = message.split(sender.nickname);

                  return (
                    <li
                      className="notifi-item"
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notifi-avatar">
                        <img src={sender.photoURL} alt={sender.nickname} />
                      </div>
                      <div className="notifi-text">
                        <p className="notifi-message">
                          {parts[0]}
                          <span className="notifi-nickname">{sender.nickname}</span>
                          {parts[1]}
                        </p>
                        <p className="notifi-date">
                          {notification.createdAt && notification.createdAt.toDate
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
                    </li>
                  );
                })
              ) : (
                <p style={{ color: "var(--text-black)" }}>No new notifications</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <PopularPosts />
    </>
  );
};

export default NotificationsPage;
