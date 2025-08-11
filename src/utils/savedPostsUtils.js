import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";

export const fetchSavedPosts = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) return [];

  const userData = userSnapshot.data();
  const postIds = (userData.savedPosts || []).filter(Boolean);

  if (postIds.length === 0) return [];

  const postPromises = postIds.map(async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) return null;

    const postData = postSnap.data();
    const authorRef = doc(db, "users", postData.author.uid);
    const authorSnap = await getDoc(authorRef);
    const authorData = authorSnap.exists() ? authorSnap.data() : null;

    return { id: postSnap.id, ...postData, author: authorData };
  });

  const results = await Promise.all(postPromises);
  return results.filter(Boolean);
};

export const filterAndSortPosts = (posts, searchQuery, sortOrder) => {
  let filtered = [...posts];

  if (searchQuery.trim()) {
    filtered = filtered.filter(
      (post) =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return filtered;
};

export const removeSavedPost = async (uid, postId, setPosts) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      savedPosts: arrayRemove(postId),
    });

    setPosts((prev) => prev.filter((post) => post.id !== postId));
    toast.success("Post removed from saved items.");
  } catch (error) {
    console.error("Error removing saved post:", error);
    toast.error("Failed to remove the post.");
  }
};