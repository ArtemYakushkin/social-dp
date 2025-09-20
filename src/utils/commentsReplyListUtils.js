import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export const handleEditReply = async ({
  selectedReply,
  editedText,
  setReplies,
  setIsEditing,
  setSelectedReply,
}) => {
  if (!selectedReply || !editedText.trim()) return;

  try {
    await updateDoc(doc(db, "replys", selectedReply.id), { text: editedText });

    setReplies((prev) =>
      prev.map((reply) =>
        reply.id === selectedReply.id ? { ...reply, text: editedText } : reply
      )
    );

    setIsEditing(false);
    setSelectedReply(null);
  } catch (error) {
    console.error("Error editing reply:", error);
  }
};

export const handleDeleteReply = async ({
  replyId,
  setReplies,
  setIsDeleting,
  setSelectedReply,
}) => {
  try {
    const replyRef = doc(db, "replys", replyId);
    const replySnap = await getDoc(replyRef);
    const replyData = replySnap.data();

    if (!replyData?.commentId) return;

    await deleteDoc(replyRef);

    const commentRef = doc(db, "comments", replyData.commentId);
    const commentSnap = await getDoc(commentRef);
    const commentData = commentSnap.data();

    if (commentData?.replies) {
      const updatedReplies = commentData.replies.filter((id) => id !== replyId);
      await updateDoc(commentRef, {
        replies: updatedReplies,
        replyCount: updatedReplies.length,
      });
    }

    setReplies((prev) => prev.filter((reply) => reply.id !== replyId));
    setIsDeleting(false);
    setSelectedReply(null);
  } catch (error) {
    console.error("Error deleting reply:", error);
  }
};