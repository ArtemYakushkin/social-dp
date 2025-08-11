import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------------- HomePage ----------------

export const fetchAllPosts = async (db, setPosts, setFilteredPosts, setIsLoading) => {
  try {
    const postsCollection = collection(db, "posts");
    const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));
    const postSnapshot = await getDocs(postsQuery);
    const allPosts = postSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(allPosts);
    setFilteredPosts(allPosts);
    setIsLoading(false);
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
  }
};

export const searchPosts = (searchQuery, posts, setFilteredPosts, setVisibleCount) => {
  const lowerCaseQuery = searchQuery.toLowerCase();
  const filtered = posts.filter((post) =>
    post.title?.toLowerCase().includes(lowerCaseQuery)
  );
  setFilteredPosts(filtered);
  setVisibleCount(6);
};

export const sortPosts = (sortOption, filteredPosts, setFilteredPosts, setVisibleCount) => {
  const sortedPosts = [...filteredPosts];

  if (sortOption === "Comment") {
    sortedPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
  } else if (sortOption === "Like") {
    sortedPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  } else if (sortOption === "New") {
    sortedPosts.sort((a, b) => {
      const dateA =
        a.createdAt instanceof Date
          ? a.createdAt.getTime()
          : a.createdAt?.toMillis?.() || Date.parse(a.createdAt) || 0;
      const dateB =
        b.createdAt instanceof Date
          ? b.createdAt.getTime()
          : b.createdAt?.toMillis?.() || Date.parse(b.createdAt) || 0;
      return dateB - dateA;
    });
  }

  setFilteredPosts(sortedPosts);
  setVisibleCount(6);
};

export const seeMorePosts = (visibleCount, setVisibleCount, postsPerPage) => {
  const newCount = visibleCount + postsPerPage;
  setVisibleCount(newCount);
};

// ---------------- PostsList ----------------

export const loadAuthors = async (posts, authors) => {
  const newAuthors = {};
  const uniqueUids = [...new Set(posts.map((p) => p.author?.uid).filter(Boolean))];

  for (const uid of uniqueUids) {
    if (!authors[uid]) {
      try {
        const authorSnap = await getDoc(doc(db, "users", uid));
        if (authorSnap.exists()) {
          newAuthors[uid] = authorSnap.data();
        }
      } catch (err) {
        console.error("Ошибка загрузки автора:", err);
      }
    }
  }

  return newAuthors;
};

export const handleLikePost = async ({
  postId,
  user,
  setLikesState,
  setModalOpenId,
}) => {
  if (!user || !user.uid) {
    setModalOpenId(postId);
    return;
  }

  const postRef = doc(db, "posts", postId);
  const userRef = doc(db, "users", user.uid);

  try {
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error("Post not found");

    const postData = postSnap.data();
    const isLiked = postData.likes.includes(user.uid);

    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });

    await updateDoc(userRef, {
      likedPosts: isLiked ? arrayRemove(postId) : arrayUnion(postId),
    });

    setLikesState((prev) => ({
      ...prev,
      [postId]: {
        liked: !isLiked,
        likesCount: prev[postId].likesCount + (isLiked ? -1 : 1),
      },
    }));
  } catch (error) {
    console.error("Ошибка при обновлении лайка:", error);
  }
};

export const initLikesState = (posts, user) => {
  const initLikes = {};
  posts.forEach((post) => {
    initLikes[post.id] = {
      liked: post.likes.includes(user?.uid),
      likesCount: post.likes.length,
    };
  });
  return initLikes;
};

// ---------------- GridPost and FlexPost ----------------

export const fetchSavedStatus = async (user, postId) => {
  if (!user) return false;

  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const savedPosts = userDoc.data().savedPosts || [];
      return savedPosts.includes(postId);
    }
  } catch (error) {
    console.error("Error fetching saved posts: ", error);
  }

  return false;
};

export const savePost = async (user, postId, setIsSaved) => {
  if (!user) {
    toast.info("You must be registered to save posts.");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      savedPosts: arrayUnion(postId),
    });

    setIsSaved(true);
  } catch (error) {
    console.error("Ошибка при сохранении поста: ", error);
    toast.error("Failed to save post");
  }
};