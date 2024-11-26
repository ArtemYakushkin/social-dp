// import React, { useEffect, useState, useMemo } from "react";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   arrayUnion,
//   arrayRemove,
//   doc,
//   orderBy,
// } from "firebase/firestore";
// import { db } from "../../firebase";
// import { ReactComponent as Heart } from "../../assets/icons/heart.svg";
// import { ReactComponent as HeartRed } from "../../assets/icons/heart-red.svg";
// import { ReactComponent as PlusCircle } from "../../assets/icons/plus-circle.svg";
// import { ReactComponent as MinusCircle } from "../../assets/icons/minus-circle.svg";
// import Loader from "../Loader/Loader";
// import ReplyForm from "../ReplyForm/ReplyForm";
// import ReplyList from "../ReplyList/ReplyList";
// import ModalDeleteComment from "../ModalDeleteComment/ModalDeleteComment";
// import ModalEditComment from "../ModalEditComment/ModalEditComment";
// import "./CommentsList.css";

// const CommentsList = ({ postId, user, onCommentDeleted }) => {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCommentId, setActiveCommentId] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [commentToDelete, setCommentToDelete] = useState(null);
//   const [commentToEdit, setCommentToEdit] = useState(null);
//   const [repliesCount, setRepliesCount] = useState(
//     comments.replies?.length || 0
//   );

//   // Используем useMemo для инициализации Set один раз
//   const deletedComments = useMemo(() => new Set(), []);

//   useEffect(() => {
//     if (!postId) return;

//     const q = query(
//       collection(db, "comments"),
//       where("postId", "==", postId),
//       orderBy("createdAt", "desc")
//     );

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const fetchedComments = [];
//       querySnapshot.forEach((doc) => {
//         // Фильтруем комментарии, удалённые локально
//         if (!deletedComments.has(doc.id)) {
//           fetchedComments.push({ id: doc.id, ...doc.data() });
//         }
//       });
//       setComments(fetchedComments);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [postId, deletedComments]);

//   const handleReplyAdded = () => {
//     setRepliesCount((prevCount) => prevCount + 1);
//   };

//   const handleReplyDeleted = () => {
//     setRepliesCount((prevCount) => Math.max(prevCount - 1, 0));
//   };

//   const handleLike = async (commentId, likes) => {
//     if (!user || !user.uid) {
//       alert("You need to be logged in to like a comment.");
//       return;
//     }

//     const commentRef = doc(db, "comments", commentId);
//     const userLiked = likes.includes(user.uid);

//     try {
//       if (userLiked) {
//         await updateDoc(commentRef, {
//           likes: arrayRemove(user.uid),
//         });
//       } else {
//         await updateDoc(commentRef, {
//           likes: arrayUnion(user.uid),
//         });
//       }
//     } catch (error) {
//       console.error("Error updating like:", error);
//     }
//   };

//   const handleDeleteComment = (commentId) => {
//     setCommentToDelete(commentId);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       // Удаляем комментарий из коллекции "comments"
//       await deleteDoc(doc(db, "comments", commentToDelete));

//       // Удаляем ID комментария из массива "comments" в соответствующем посте
//       const postRef = doc(db, "posts", postId);
//       await updateDoc(postRef, {
//         comments: arrayRemove(commentToDelete),
//       });

//       // Обновляем состояние
//       setComments((prevComments) =>
//         prevComments.filter((c) => c.id !== commentToDelete)
//       );

//       // Вызываем колбэк, если он передан
//       if (onCommentDeleted) {
//         onCommentDeleted(commentToDelete);
//       }
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     } finally {
//       setIsDeleteModalOpen(false);
//     }
//   };

//   const handleEditComment = (commentId, newText) => {
//     setCommentToEdit({ id: commentId, text: newText });
//     setIsEditModalOpen(true);
//   };

//   const handleSaveEdit = async (newText) => {
//     try {
//       const commentRef = doc(db, "comments", commentToEdit.id);
//       await updateDoc(commentRef, {
//         text: newText,
//       });
//       setComments((prevComments) =>
//         prevComments.map((c) =>
//           c.id === commentToEdit.id ? { ...c, text: newText } : c
//         )
//       );
//     } catch (error) {
//       console.error("Error updating comment:", error);
//     } finally {
//       setIsEditModalOpen(false);
//     }
//   };

//   const toggleReplyList = (commentId) => {
//     setActiveCommentId((prevActiveId) =>
//       prevActiveId === commentId ? null : commentId
//     );
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   if (comments.length === 0) {
//     return (
//       <p className="comment-notcomment-text">There are no comments yet.</p>
//     );
//   }

//   return (
//     <div className="comment-list">
//       {comments.map((comment) => (
//         <div className="comment-total-wrapp" key={comment.id}>
//           <div className="comment-top-section">
//             <div className="comment-avatar">
//               <img src={comment.author.avatar} alt="Avatar" />
//             </div>
//             <div className="comment-right">
//               <div className="comment-content">
//                 <div className="comment-author">
//                   <p className="comment-nikname">{comment.author.nickname}</p>
//                   <p className="comment-date">
//                     {comment.createdAt && comment.createdAt.toDate
//                       ? comment.createdAt.toDate().toLocaleString("ru-RU", {
//                           timeZone: "Europe/Moscow",
//                           year: "numeric",
//                           month: "2-digit",
//                           day: "2-digit",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })
//                       : "Date not available"}
//                   </p>
//                 </div>
//                 <p className="comment-text">{comment.text}</p>
//               </div>
//             </div>
//           </div>
//           <div className="comment-center-section">
//             <button
//               className="comment-btn-like"
//               onClick={() => handleLike(comment.id, comment.likes)}
//             >
//               {comment.likes.includes(user?.uid) ? <HeartRed /> : <Heart />}
//               <span>{comment.likes.length}</span>
//             </button>
//             {comment.author.id === user?.uid && (
//               <div className="comment-center-options">
//                 <button
//                   className="comment-options-btn"
//                   onClick={() => handleEditComment(comment.id, comment.text)}
//                 >
//                   Edit comment
//                 </button>
//                 <button
//                   className="comment-options-btn"
//                   onClick={() => handleDeleteComment(comment.id)}
//                 >
//                   Delete comment
//                 </button>
//               </div>
//             )}
//           </div>
//           {activeCommentId === comment.id && (
//             <div className="comment-list-reply-container">
//               <ReplyForm
//                 commentId={comment.id}
//                 postId={postId}
//                 user={user}
//                 onReplyAdded={handleReplyAdded}
//               />
//               <ReplyList
//                 commentId={comment.id}
//                 user={user}
//                 onReplyDeleted={handleReplyDeleted}
//               />
//             </div>
//           )}
//           <div className="comment-bottom-section">
//             <button
//               className="comment-list-btn"
//               onClick={() => toggleReplyList(comment.id)}
//             >
//               {activeCommentId === comment.id ? (
//                 <>
//                   <MinusCircle />
//                   <p className="comment-list-btn-text">
//                     hide {repliesCount} replies
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <PlusCircle />
//                   <p className="comment-list-btn-text">
//                     {repliesCount} more replies
//                   </p>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       ))}
//       <ModalDeleteComment
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={handleConfirmDelete}
//       />
//       <ModalEditComment
//         isOpen={isEditModalOpen}
//         currentText={commentToEdit?.text || ""}
//         onClose={() => setIsEditModalOpen(false)}
//         onSave={handleSaveEdit}
//       />
//     </div>
//   );
// };

// export default CommentsList;

import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ReactComponent as Heart } from "../../assets/icons/heart.svg";
import { ReactComponent as HeartRed } from "../../assets/icons/heart-red.svg";
import { ReactComponent as PlusCircle } from "../../assets/icons/plus-circle.svg";
import { ReactComponent as MinusCircle } from "../../assets/icons/minus-circle.svg";
import Loader from "../Loader/Loader";
import ReplyForm from "../ReplyForm/ReplyForm";
import ReplyList from "../ReplyList/ReplyList";
import ModalDeleteComment from "../ModalDeleteComment/ModalDeleteComment";
import ModalEditComment from "../ModalEditComment/ModalEditComment";
import "./CommentsList.css";

const CommentsList = ({ postId, user, onCommentDeleted }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [repliesCounts, setRepliesCounts] = useState({});

  const deletedComments = useMemo(() => new Set(), []);

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = [];
      const newRepliesCounts = {};

      querySnapshot.forEach((doc) => {
        if (!deletedComments.has(doc.id)) {
          const data = doc.data();
          fetchedComments.push({ id: doc.id, ...data });
          newRepliesCounts[doc.id] = data.replies?.length || 0;
        }
      });

      setComments(fetchedComments);
      setRepliesCounts(newRepliesCounts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId, deletedComments]);

  const handleReplyAdded = (commentId) => {
    setRepliesCounts((prevCounts) => ({
      ...prevCounts,
      [commentId]: (prevCounts[commentId] || 0) + 1,
    }));
  };

  const handleReplyDeleted = (commentId) => {
    setRepliesCounts((prevCounts) => ({
      ...prevCounts,
      [commentId]: Math.max((prevCounts[commentId] || 0) - 1, 0),
    }));
  };

  const handleLike = async (commentId, likes) => {
    if (!user || !user.uid) {
      alert("You need to be logged in to like a comment.");
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

  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "comments", commentToDelete));

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayRemove(commentToDelete),
      });

      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== commentToDelete)
      );

      if (onCommentDeleted) {
        onCommentDeleted(commentToDelete);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditComment = (commentId, newText) => {
    setCommentToEdit({ id: commentId, text: newText });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (newText) => {
    try {
      const commentRef = doc(db, "comments", commentToEdit.id);
      await updateDoc(commentRef, {
        text: newText,
      });
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentToEdit.id ? { ...c, text: newText } : c
        )
      );
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const toggleReplyList = (commentId) => {
    setActiveCommentId((prevActiveId) =>
      prevActiveId === commentId ? null : commentId
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (comments.length === 0) {
    return (
      <p className="comment-notcomment-text">There are no comments yet.</p>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div className="comment-total-wrapp" key={comment.id}>
          <div className="comment-top-section">
            <div className="comment-avatar">
              <img src={comment.author.avatar} alt="Avatar" />
            </div>
            <div className="comment-right">
              <div className="comment-content">
                <div className="comment-author">
                  <p className="comment-nikname">{comment.author.nickname}</p>
                  <p className="comment-date">
                    {comment.createdAt && comment.createdAt.toDate
                      ? comment.createdAt.toDate().toLocaleString("ru-RU", {
                          timeZone: "Europe/Moscow",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Date not available"}
                  </p>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          </div>
          <div className="comment-center-section">
            <button
              className="comment-btn-like"
              onClick={() => handleLike(comment.id, comment.likes)}
            >
              {comment.likes.includes(user?.uid) ? <HeartRed /> : <Heart />}
              <span>{comment.likes.length}</span>
            </button>
            {comment.author.id === user?.uid && (
              <div className="comment-center-options">
                <button
                  className="comment-options-btn"
                  onClick={() => handleEditComment(comment.id, comment.text)}
                >
                  Edit comment
                </button>
                <button
                  className="comment-options-btn"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete comment
                </button>
              </div>
            )}
          </div>
          {activeCommentId === comment.id && (
            <div className="comment-list-reply-container">
              <ReplyForm
                commentId={comment.id}
                postId={postId}
                user={user}
                onReplyAdded={() => handleReplyAdded(comment.id)}
              />
              <ReplyList
                commentId={comment.id}
                user={user}
                onReplyDeleted={() => handleReplyDeleted(comment.id)}
              />
            </div>
          )}
          <div className="comment-bottom-section">
            <button
              className="comment-list-btn"
              onClick={() => toggleReplyList(comment.id)}
            >
              {activeCommentId === comment.id ? (
                <>
                  <MinusCircle />
                  <p className="comment-list-btn-text">
                    hide {repliesCounts[comment.id] || 0} replies
                  </p>
                </>
              ) : (
                <>
                  <PlusCircle />
                  <p className="comment-list-btn-text">
                    {repliesCounts[comment.id] || 0} more replies
                  </p>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
      <ModalDeleteComment
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <ModalEditComment
        isOpen={isEditModalOpen}
        currentText={commentToEdit?.text || ""}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default CommentsList;
