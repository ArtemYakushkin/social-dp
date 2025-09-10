import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

import { stripHtml } from './textUtils';

// export const stripHtml = (html) => {
//   const div = document.createElement("div");
//   div.innerHTML = html;
//   return div.textContent || div.innerText || "";
// };

export const fetchUserProfileData = async (userId, setState) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      setState(data);
    }
  } catch (error) {
    console.error('Ошибка загрузки данных пользователя:', error);
  }
};

export const getUserPostCount = async (userId, setPostCount) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setPostCount(userData.createdPosts?.length || 0);
    }
  } catch (error) {
    console.error('Ошибка загрузки постов:', error);
  }
};

export const subscribeToMessages = (userId, setMessages) => {
  const messagesRef = collection(db, 'authorMessages');
  const q = query(messagesRef, where('authorId', '==', userId), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(msgs);
  });
};

export const publishAboutMe = async (userId, aboutMe, setAboutMe, setErrors, setIsEditingAbout) => {
  const englishOnlyRegex = /^[\u0020-\u007E]+$/;
  const plainText = stripHtml(aboutMe).trim();

  if (plainText && !englishOnlyRegex.test(plainText)) {
    setErrors({ aboutMe: 'Please use English characters only.' });
    return;
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { aboutMe });
    setAboutMe(aboutMe);
    setIsEditingAbout(false);
    setErrors({});
  } catch (error) {
    console.error('Error updating About Me:', error);
    setErrors({ aboutMe: 'Failed to save. Please try again.' });
  }
};
