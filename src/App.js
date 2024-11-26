import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import DashboardPage from "./pages/DashboardPage/DashboardPage";
import CreatePostPage from "./pages/CreatePostPage/CreatePostPage";
// import PostDetails from "./pages/PostDetails/PostDetails";

const secretCode = process.env.REACT_APP_DASHBOARD_CODE;

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/posts/:postId" element={<PostDetails />} /> */}
        <Route path='/create-post' element={<CreatePostPage />} />

        {/* <Route path={`/dashboard/${secretCode}`} element={<DashboardPage />} /> */}
        <Route path={`/dashboard/${secretCode}/create`} element={<CreatePostPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Router>
  );
}

export default App;
