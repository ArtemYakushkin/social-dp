import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchAuthorData = async (uid) => {
  try {
    const authorRef = doc(db, 'users', uid);
    const docSnap = await getDoc(authorRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching author data:', error);
    return null;
  }
};

export const fetchAuthorPosts = async (createdPosts) => {
  if (!createdPosts || createdPosts.length === 0) return [];

  try {
    const postsPromises = createdPosts.map(async (post) => {
      const postId = post.id;
      if (typeof postId !== 'string') return null;

      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);

      return postSnap.exists() ? { id: postId, ...postSnap.data() } : null;
    });

    const postsData = await Promise.all(postsPromises);
    return postsData.filter((post) => post !== null);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};
