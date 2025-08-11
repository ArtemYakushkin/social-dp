import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUserPostsData = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) return [];

  const userData = userSnapshot.data();
  const postObjects = userData.createdPosts || [];
  const postIds = postObjects.map((post) => post.id).filter(Boolean);

  if (postIds.length === 0) return [];

  const postPromises = postIds.map(async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    return postSnap.exists() ? { id: postSnap.id, ...postSnap.data() } : null;
  });

  return (await Promise.all(postPromises)).filter(Boolean);
};

export const filterAndSortPosts = (posts, query, sortOption) => {
  return posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.text.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "New") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "Comment") {
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      } else if (sortOption === "Like") {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });
};