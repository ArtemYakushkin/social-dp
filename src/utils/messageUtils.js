import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";


export const deleteMessageById = async (messageId) => {
  try {
    await deleteDoc(doc(db, "authorMessages", messageId));
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};


export const updateMessageText = async (messageId, newText) => {
  try {
    await updateDoc(doc(db, "authorMessages", messageId), {
      message: newText.trim(),
    });
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
};