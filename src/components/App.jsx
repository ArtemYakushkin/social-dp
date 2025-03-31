import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
// import DashboardPage from "./pages/DashboardPage/DashboardPage";
import CreatePostPage from "../pages/CreatePostPage";
import PostDetailsPage from "../pages/PostDetailsPage";
import { AuthProvider } from "../auth/useAuth";

const secretCode = process.env.REACT_APP_DASHBOARD_CODE;

function App() {
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
          <Route path="/create-post" element={<CreatePostPage />} />

          {/* <Route path={`/dashboard/${secretCode}`} element={<DashboardPage />} /> */}
          <Route path={`/dashboard/${secretCode}/create`} element={<CreatePostPage />} />
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
