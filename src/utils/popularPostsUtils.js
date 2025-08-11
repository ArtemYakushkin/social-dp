import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import avatarPlaceholder from "../assets/avatar.png";

export const fetchPopularPosts = async (db) => {
  const q = query(collection(db, "posts"), orderBy("likes", "desc"), limit(5));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { posts: [], error: true };
  }

  const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return { posts: postsData, error: false };
};

export const fetchAuthors = async (db, posts) => {
  const newAuthors = {};
  const uniqueUids = [...new Set(posts.map((post) => post.author?.uid).filter(Boolean))];

  await Promise.all(
    uniqueUids.map(async (uid) => {
      try {
        const authorSnap = await getDoc(doc(db, "users", uid));
        newAuthors[uid] = authorSnap.exists()
          ? authorSnap.data()
          : { nickname: "Unknown Author", avatar: avatarPlaceholder };
      } catch {
        newAuthors[uid] = { nickname: "Unknown Author", avatar: avatarPlaceholder };
      }
    })
  );

  return newAuthors;
};

export const navigateToPost = (navigate, postId) => {
  if (postId) navigate(`/post/${postId}`);
  else console.error("Ошибка: postId отсутствует!");
};