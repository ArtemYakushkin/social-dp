import { addDoc, collection, doc, updateDoc, arrayUnion, serverTimestamp, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { isEnglishOnly } from './validation';

const notifyNewReply = async (postId, commentId, replyId, sender) => {
  const commentRef = doc(db, "comments", commentId);
  const commentSnap = await getDoc(commentRef);

  if (commentSnap.exists()) {
    const comment = commentSnap.data();

    if (comment.author?.id && comment.author.id !== sender.id) {
      await addDoc(collection(db, "notifications"), {
        recipientId: comment.author.id,
        type: "new_reply",
        postId,
        commentId,
        replyId,
        commentText: comment.text,
        sender: {
          id: sender.id,
          nickname: sender.nickname || "Someone",
          photoURL: sender.photoURL || null,
        },
        message: `${sender.nickname || "Someone"} replied to your comment "${comment.text}"`,
        createdAt: serverTimestamp(),
        read: false,
      });
    }
  }
};

export const handleReplySubmit = async ({
  e,
  replyText,
  setError,
  postId,
  commentId,
  user,
  setReplyText,
  onReplyAdded,
}) => {
  e.preventDefault();
  setError("");

  if (!replyText.trim()) {
    setError("Reply cannot be empty");
    return;
  }

  if (!isEnglishOnly(replyText)) {
    setError("Reply must contain only English letters.");
    return;
  }

  try {
    const replyRef = await addDoc(collection(db, "replys"), {
      postId,
      commentId,
      text: replyText,
      author: {
        uid: user.uid,
        nickname: user.displayName,
        avatar: user.photoURL || null,
      },
      createdAt: serverTimestamp(),
    });

    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      replies: arrayUnion(replyRef.id),
    });

    await notifyNewReply(postId, commentId, replyRef.id, {
      id: user.uid,
      nickname: user.displayName,
      photoURL: user.photoURL || null,
    });

    setReplyText("");
    toast.success("Reply added successfully!");

    if (onReplyAdded) {
      onReplyAdded();
    }
  } catch (error) {
    console.error("Error adding reply: ", error);
    setError("Error sending reply");
  }
};

export const handleRegisterClick = ({ user, setIsRegisterModalOpen }) => {
  if (user) {
    toast.info("You are already registered", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else {
    setIsRegisterModalOpen(true);
  }
};