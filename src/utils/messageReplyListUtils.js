import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const editReply = async (replyId, newText) => {
  if (!replyId || !newText.trim()) return;

  await updateDoc(doc(db, 'authorMessageReplies', replyId), {
    text: newText.trim(),
  });
};

export const deleteReply = async (replyId) => {
  if (!replyId) return;

  await deleteDoc(doc(db, 'authorMessageReplies', replyId));
};
