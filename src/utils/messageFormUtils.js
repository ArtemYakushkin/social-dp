import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const uploadImage = async (file, userId) => {
  const storage = getStorage();
  const storageRef = ref(storage, `messages/${userId}-${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const fetchAuthorNickname = async (authorId) => {
  try {
    const docRef = doc(db, 'users', authorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().nickname || 'Unknown Author';
    }
    return 'Unknown Author';
  } catch (error) {
    console.error('Failed to fetch author nickname:', error);
    return 'Unknown Author';
  }
};

export const sendNotification = async (recipientId, user) => {
  await addDoc(collection(db, 'notifications'), {
    recipientId,
    type: 'new_message',
    sender: {
      uid: user.uid,
      nickname: user.displayName,
      photoURL: user.photoURL,
    },
    message: `${user.displayName} sent you a message`,
    createdAt: serverTimestamp(),
    read: false,
  });
};
