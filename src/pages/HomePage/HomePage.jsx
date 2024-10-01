import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Подключение Firebase
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import PostCard from "../../components/PostCard/PostCard";
import Loader from "../../components/Loader/Loader";
import "./HomePage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]); // Состояние для хранения списка постов
  const [lastVisible, setLastVisible] = useState(null); // Состояние для хранения последнего загруженного поста
  const [hasMorePosts, setHasMorePosts] = useState(true); // Состояние для отслеживания наличия следующих постов
  const [expandedPostId, setExpandedPostId] = useState(null);
  const POSTS_PER_PAGE = 5; // Количество постов на одной странице

  // Функция для загрузки первой порции постов
  const fetchPosts = async () => {
    try {
      const postsCollection = collection(db, "posts");
      // Создаем запрос с сортировкой по 'createdAt' и лимитом на 5 постов
      const postsQuery = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );
      const postSnapshot = await getDocs(postsQuery);
      const postList = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (postSnapshot.docs.length > 0) {
        const lastVisiblePost = postSnapshot.docs[postSnapshot.docs.length - 1]; // Запоминаем последний загруженный пост
        setLastVisible(lastVisiblePost);
        setPosts(postList);
        setHasMorePosts(postSnapshot.docs.length === POSTS_PER_PAGE); // Если меньше 5 постов, значит их больше нет
      }
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  };

  // Функция для загрузки следующей порции постов
  const fetchMorePosts = async () => {
    if (!lastVisible) return;

    try {
      const postsCollection = collection(db, "posts");
      // Загружаем следующую порцию постов начиная с последнего загруженного
      const postsQuery = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(POSTS_PER_PAGE)
      );
      const postSnapshot = await getDocs(postsQuery);
      const postList = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (postSnapshot.docs.length > 0) {
        const lastVisiblePost = postSnapshot.docs[postSnapshot.docs.length - 1];
        setLastVisible(lastVisiblePost);
        setPosts((prevPosts) => [...prevPosts, ...postList]); // Добавляем новые посты к уже загруженным
        setHasMorePosts(postSnapshot.docs.length === POSTS_PER_PAGE);
      } else {
        setHasMorePosts(false); // Больше постов нет
      }
    } catch (error) {
      console.error("Ошибка при загрузке дополнительных постов:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleExpand = (postId) => {
    setExpandedPostId(postId === expandedPostId ? null : postId);
  };

  return (
    <div className="home">
      <div className="container">
        <div className="home-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isExpanded={expandedPostId === post.id}
                onExpand={() => handleExpand(post.id)}
              />
            ))
          ) : (
            <Loader />
          )}
        </div>

        {hasMorePosts && (
          <div className="home-btn-container">
            <button className="home-see-more-btn" onClick={fetchMorePosts}>
              See More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
