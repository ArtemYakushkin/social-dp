import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

import { FiBell } from "react-icons/fi";

import "../styles/NotificationIcon.css";

const NotificationsIcon = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", currentUser.uid),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <Link to="/notifications" className="notification-icon">
      <FiBell size={26} />
      {notifications.length > 0 && <div className="notification-badge">{notifications.length}</div>}
    </Link>
  );
};

export default NotificationsIcon;
