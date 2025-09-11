import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const uploadImage = async (file, path = "messageReplies/images") => {
  const imgRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  await uploadBytes(imgRef, file);
  return await getDownloadURL(imgRef);
};

export const sendReply = async ({ replyToMessage, currentUser, text, imageUrl, gifUrl }) => {
  return await addDoc(collection(db, "authorMessageReplies"), {
    replyToMessageId: replyToMessage.id,
    replyToAuthorId: replyToMessage.senderId,
    from: {
      uid: currentUser.uid,
      nickname: currentUser.nickname,
      avatar: currentUser.avatar,
    },
    text: text.trim(),
    image: imageUrl,
    gif: gifUrl,
    createdAt: serverTimestamp(),
  });
};

export const sendReplyNotification = async (recipientId, currentUser) => {
  return await addDoc(collection(db, "notifications"), {
    recipientId,
    sender: {
      uid: currentUser.uid,
      nickname: currentUser.nickname,
      photoURL: currentUser.avatar,
    },
    message: `${currentUser.nickname} replied to your message`,
    type: "reply_to_message",
    createdAt: serverTimestamp(),
    read: false,
  });
};