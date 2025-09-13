import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

export const handleLike = async ({ user, commentId, likes, setIsModalOpen }) => {
  if (!user || !user.uid) {
    setIsModalOpen(true);
    return;
  }

  const commentRef = doc(db, "comments", commentId);
  const userLiked = likes.includes(user.uid);

  try {
    if (userLiked) {
      await updateDoc(commentRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(user.uid),
      });
    }
  } catch (error) {
    console.error("Error updating like:", error);
  }
};

export const handleSaveEdit = async ({
  selectedComment,
  editedText,
  setComments,
  setIsEditing,
  setSelectedComment,
  setEditedText,
}) => {
  if (!selectedComment) return;

  try {
    const commentRef = doc(db, "comments", selectedComment.id);
    await updateDoc(commentRef, { text: editedText });

    setComments((prev) =>
      prev.map((c) => (c.id === selectedComment.id ? { ...c, text: editedText } : c))
    );
  } catch (error) {
    console.error("Error editing comment:", error);
  } finally {
    setIsEditing(false);
    setSelectedComment(null);
    setEditedText("");
  }
};

export const handleConfirmDelete = async ({
  selectedComment,
  postId,
  setComments,
  onCommentDeleted,
  setIsDeleting,
  setSelectedComment,
}) => {
  if (!selectedComment) return;

  try {
    await deleteDoc(doc(db, "comments", selectedComment.id));
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayRemove(selectedComment.id),
    });

    setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
    if (onCommentDeleted) onCommentDeleted(selectedComment.id);
  } catch (error) {
    console.error("Error deleting comment:", error);
  } finally {
    setIsDeleting(false);
    setSelectedComment(null);
  }
};