import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { db, storage } from "../firebase";
import { collection, addDoc, Timestamp, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

import "../styles/CreatePostPage.css";

const CreatePostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("Quiz");
  const [quiz, setQuiz] = useState({
    question: "",
    answers: [],
    correctAnswer: null,
  });
  const [poll, setPoll] = useState({ question: "", answers: ["Yes", "No"] });
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const filePreviews = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(filePreviews).then((previews) => {
      setPreviewImages(previews);
    });
  };

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const addQuizAnswer = () => {
    setQuiz({ ...quiz, answers: [...quiz.answers, ""] });
  };

  const handleQuizAnswerChange = (index, value) => {
    const newAnswers = [...quiz.answers];
    newAnswers[index] = value;
    setQuiz({ ...quiz, answers: newAnswers });
  };

  const handlePollChange = (e) => {
    setPoll({ ...poll, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      const mediaUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const storageRef = ref(storage, `posts/${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      const postData = {
        title,
        text,
        media: mediaUrls,
        createdAt: Timestamp.now().toDate().toISOString(),
        comments: [],
        likes: [],
        views: 0,
        author: {
          uid: user.uid,
        },
      };

      if (activeTab === "Quiz") {
        postData.quiz = quiz;
      } else if (activeTab === "Poll") {
        postData.poll = poll;
      }

      const postRef = await addDoc(collection(db, "posts"), postData);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        createdPosts: arrayUnion({
          id: postRef.id,
        }),
      });

      toast.success("Post created successfully");
      setTitle("");
      setText("");
      setSelectedFiles([]);
      setPreviewImages([]);
      setQuiz({ question: "", answers: [], correctAnswer: null });
      setPoll({ question: "", answers: ["Yes", "No"] });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create">
      <div className="container">
        <form className="create-wrapp" onSubmit={handleSubmit}>
          <div className="create-input-container">
            <input
              className="create-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="create-placeholder">Create title</span>
          </div>

          <div className="create-textarea-container">
            <textarea
              className="create-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <span className="create-placeholder">Create text</span>
          </div>

          <div className="create-tabs">
            <button
              className={`create-tabs-btn ${activeTab === "Quiz" ? "create-tabs-btn-active" : ""}`}
              onClick={() => setActiveTab("Quiz")}
            >
              Quiz
            </button>
            <button
              className={`create-tabs-btn ${activeTab === "Poll" ? "create-tabs-btn-active" : ""}`}
              onClick={() => setActiveTab("Poll")}
            >
              Poll
            </button>
          </div>

          {activeTab === "Quiz" && (
            <div className="create-quiz-section">
              <div className="create-input-container">
                <input
                  className="create-input"
                  type="text"
                  name="question"
                  value={quiz.question}
                  onChange={handleQuizChange}
                />
                <span className="create-placeholder">Question:</span>
              </div>
              {quiz.answers.map((answer, index) => (
                <div key={index} className="create-quiz-answers">
                  <div className="create-quiz-input-container">
                    <input
                      className="create-input"
                      type="text"
                      value={answer}
                      onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                    />
                    <span className="create-placeholder">Answer:</span>
                  </div>
                  <input
                    className="create-input-radio"
                    type="radio"
                    name="correctAnswer"
                    value={index}
                    checked={quiz.correctAnswer === index}
                    onChange={() => setQuiz({ ...quiz, correctAnswer: index })}
                  />
                  <p
                    className="create-text-correct"
                    style={{
                      color:
                        quiz.correctAnswer === index
                          ? "var(--accent-blue-color)"
                          : "var(--text-black)",
                    }}
                  >
                    Correct
                  </p>
                </div>
              ))}
              <button className="create-addanswer-btn" type="button" onClick={addQuizAnswer}>
                Add Answer
              </button>
            </div>
          )}

          {activeTab === "Poll" && (
            <div className="create-poll-section">
              <div className="create-input-container">
                <input
                  className="create-input"
                  type="text"
                  name="question"
                  value={poll.question}
                  onChange={handlePollChange}
                />
                <span className="create-placeholder">Question:</span>
              </div>
              <div className="create-poll-group">
                <label className="edit-poll-label">
                  Yes
                  <input className="edit-input-radio" type="radio" name="pollAnswer" value="Yes" />
                </label>
                <label className="edit-poll-label">
                  No
                  <input className="edit-input-radio" type="radio" name="pollAnswer" value="No" />
                </label>
              </div>
            </div>
          )}

          {/* Поле для загрузки файлов (изображения или видео) */}
          <div className="create-group-add">
            <label className="create-label-add" htmlFor="imageInputCreate">
              Add Media
            </label>
            <input
              className="create-input-add"
              id="imageInputCreate"
              type="file"
              multiple
              accept="image/jpeg, image/png, image/gif, video/mp4"
              onChange={handleFileChange}
            />
          </div>

          {/* Предварительный просмотр изображений */}
          {previewImages.length > 0 && (
            <div className="create-preview-container">
              {previewImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="create-image-preview"
                />
              ))}
            </div>
          )}

          <button className="create-submit-btn" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
