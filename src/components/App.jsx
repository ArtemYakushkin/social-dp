import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import AboutPage from "../pages/AboutPage";
import AuthorProfilePage from "../pages/AuthorProfilePage";
import CreatePostPage from "../pages/CreatePostPage";
import PostDetailsPage from "../pages/PostDetailsPage";
import EditPostPage from "../pages/EditPostPage";
import NotificationsPage from "../pages/NotificationsPage";
import Loader from "../components/Loader";
import { AuthProvider } from "../auth/useAuth";

const allowedEmails = process.env.REACT_APP_ALLOWED_EMAILS?.split(",") || [];

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <Loader />;
  }

  const isAllowed = user && allowedEmails.includes(user.email);

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/author/:uid" element={<AuthorProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/post/:postId" element={<PostDetailsPage />} />
          {/* <Route path="/create-post" element={<CreatePostPage />} /> */}
          <Route
            path="/create-post"
            element={isAllowed ? <CreatePostPage /> : <Navigate to="/" />}
          />
          <Route path="/edit-post/:postId" element={<EditPostPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path={`/create`} element={<CreatePostPage />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
