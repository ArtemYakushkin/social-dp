import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useMediaQuery } from "react-responsive";

import { MdOutlineDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import "../styles/EditPostPage.css";

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [oldMedia, setOldMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [quiz, setQuiz] = useState({ question: "", answers: [""], correctAnswer: null });
  const [poll, setPoll] = useState({ question: "" });

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, "posts", postId);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setTitle(postData.title);
        setText(postData.text);
        setOldMedia(postData.media || []);
        if (postData.quiz) {
          setActiveTab("Quiz");
          setQuiz(postData.quiz);
        } else if (postData.poll) {
          setActiveTab("Poll");
          setPoll(postData.poll);
        }
      }
    };
    fetchPost();
  }, [postId]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    const previewUrls = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));

    setNewMedia((prev) => [...prev, ...previewUrls]);
  };

  const removeOldMedia = async (url) => {
    const updated = oldMedia.filter((m) => m !== url);
    setOldMedia(updated);
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  };

  const removeNewMedia = (index) => {
    setNewMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, question: e.target.value });
  };

  const handleQuizAnswerChange = (index, value) => {
    const updatedAnswers = [...quiz.answers];
    updatedAnswers[index] = value;
    setQuiz({ ...quiz, answers: updatedAnswers });
  };

  const addQuizAnswer = () => {
    setQuiz({ ...quiz, answers: [...quiz.answers, ""] });
  };

  const removeQuizAnswer = (index) => {
    const updatedAnswers = quiz.answers.filter((_, i) => i !== index);
    const updatedCorrect =
      quiz.correctAnswer === index
        ? null
        : quiz.correctAnswer > index
        ? quiz.correctAnswer - 1
        : quiz.correctAnswer;
    setQuiz({ ...quiz, answers: updatedAnswers, correctAnswer: updatedCorrect });
  };

  const handlePollChange = (e) => {
    setPoll({ ...poll, [e.target.name]: e.target.value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Quiz") {
      setPoll({ question: "" });
    } else if (tab === "Poll") {
      setQuiz({ question: "", answers: [""], correctAnswer: null });
    } else {
      setQuiz({ question: "", answers: [""], correctAnswer: null });
      setPoll({ question: "" });
    }
  };

  const handleUpdate = async () => {
    const postRef = doc(db, "posts", postId);

    const newMediaUrls = [];
    for (const mediaItem of newMedia) {
      const file = mediaItem.file;
      const fileRef = ref(storage, `posts/${uuidv4()}-${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      newMediaUrls.push(url);
    }

    await updateDoc(postRef, {
      title,
      text,
      media: [...oldMedia, ...newMediaUrls],
      ...(activeTab === "Quiz" ? { quiz, poll: deleteField() } : {}),
      ...(activeTab === "Poll"
        ? {
            poll: {
              question: poll.question,
              answers: ["Yes", "No"],
              pollVotes: [0, 0],
            },
            quiz: deleteField(),
          }
        : {}),
      ...(activeTab === null ? { quiz: deleteField(), poll: deleteField() } : {}),
    });

    navigate("/");
  };

  return (
    <>
      {isMobile ? (
        <div className="edit">
          <div className="container">
            <div className="edit-wrapp-mobile">
              <div className="edit-input-container">
                <input
                  className="edit-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="edit-placeholder">Title</span>
              </div>

              <div className="edit-textarea-container">
                <textarea
                  className="edit-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="edit-placeholder">Text</span>
              </div>

              <div className="edit-tabs">
                <button
                  className={`edit-tabs-btn ${activeTab === "Quiz" ? "edit-tabs-btn-active" : ""}`}
                  onClick={() => handleTabChange("Quiz")}
                >
                  Quiz
                </button>
                <button
                  className={`edit-tabs-btn ${activeTab === "Poll" ? "edit-tabs-btn-active" : ""}`}
                  onClick={() => handleTabChange("Poll")}
                >
                  Poll
                </button>
                <button
                  className={`edit-tabs-btn ${activeTab === null ? "edit-tabs-btn-active" : ""}`}
                  onClick={() => handleTabChange(null)}
                >
                  None
                </button>
              </div>

              {activeTab === "Quiz" && (
                <div className="edit-quiz-section">
                  <div className="edit-input-container">
                    <input
                      className="edit-input"
                      type="text"
                      value={quiz.question}
                      onChange={handleQuizChange}
                    />
                    <span className="edit-placeholder">Question:</span>
                  </div>
                  {quiz.answers.map((answer, index) => (
                    <div className="edit-quiz-answers" key={index}>
                      <div className="edit-quiz-input-container">
                        <input
                          className="edit-input"
                          type="text"
                          value={answer}
                          onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                        />
                        <span className="edit-placeholder">Answer:</span>
                      </div>

                      <div className="edit-quiz-answer-option">
                        <input
                          className="edit-input-radio"
                          type="radio"
                          name="correctAnswer"
                          checked={quiz.correctAnswer === index}
                          onChange={() => setQuiz({ ...quiz, correctAnswer: index })}
                        />

                        <p
                          className="edit-text-correct"
                          style={{
                            color:
                              quiz.correctAnswer === index
                                ? "var(--accent-blue-color)"
                                : "var(--text-black)",
                          }}
                        >
                          Correct
                        </p>

                        <button className="edit-delete-btn" onClick={() => removeQuizAnswer(index)}>
                          <MdOutlineDelete size={30} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="edit-addanswer-btn" onClick={addQuizAnswer}>
                    Add Answer
                  </button>
                </div>
              )}

              {activeTab === "Poll" && (
                <div className="edit-poll-section">
                  <div className="edit-input-container">
                    <input
                      className="edit-input"
                      type="text"
                      name="question"
                      value={poll.question}
                      onChange={handlePollChange}
                    />
                    <span className="edit-placeholder">Question:</span>
                  </div>
                  <div className="edit-poll-group">
                    <label className="edit-poll-label">
                      Yes
                      <input
                        className="edit-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="Yes"
                        disabled
                      />
                    </label>
                    <label className="edit-poll-label">
                      No
                      <input
                        className="edit-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="No"
                        disabled
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="edit-media-section">
                <div className="edit-media-list">
                  {oldMedia.map((url, i) => (
                    <div className="edit-media-item" key={`old-${i}`}>
                      <div className="edit-media-img">
                        <img src={url} alt="media" />
                        <button
                          className="edit-media-delete-btn"
                          onClick={() => removeOldMedia(url)}
                        >
                          <IoClose size={42} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {newMedia.map((item, i) => (
                    <div className="edit-media-item" key={`new-${i}`}>
                      <div className="edit-media-img">
                        <img src={item.preview} alt="new media" />
                        <button className="edit-media-delete-btn" onClick={() => removeNewMedia(i)}>
                          <IoClose size={42} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="edit-file-add">
                  <label className="edit-label-add" htmlFor="imageInputCreate">
                    Add Media
                  </label>
                  <input
                    className="edit-input-add"
                    id="imageInputCreate"
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/gif, video/mp4"
                    onChange={handleMediaChange}
                  />
                </div>
              </div>

              <button className="edit-update-btn" onClick={handleUpdate}>
                Update Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="edit">
          <div className="container">
            <div className="edit-wrapp">
              <div className="edit-input-container">
                <input
                  className="edit-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="edit-placeholder">Title</span>
              </div>

              <div className="edit-textarea-container">
                <textarea
                  className="edit-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="edit-placeholder">Text</span>
              </div>

              <div className="edit-tabs">
                <button
                  className={`edit-tabs-btn ${activeTab === "Quiz" ? "edit-tabs-btn-active" : ""}`}
                  onClick={() => handleTabChange("Quiz")}
                >
                  Quiz
                </button>
                <button
                  className={`edit-tabs-btn ${activeTab === "Poll" ? "edit-tabs-btn-active" : ""}`}
                  onClick={() => handleTabChange("Poll")}
                >
                  Poll
                </button>
                <button
                  className={`edit-tabs-btn ${activeTab === null ? "edit-tabs-btn-active" : ""}`}
                  onClick={() => handleTabChange(null)}
                >
                  None
                </button>
              </div>

              {activeTab === "Quiz" && (
                <div className="edit-quiz-section">
                  <div className="edit-input-container">
                    <input
                      className="edit-input"
                      type="text"
                      value={quiz.question}
                      onChange={handleQuizChange}
                    />
                    <span className="edit-placeholder">Question:</span>
                  </div>
                  {quiz.answers.map((answer, index) => (
                    <div className="edit-quiz-answers" key={index}>
                      <div className="edit-quiz-input-container">
                        <input
                          className="edit-input"
                          type="text"
                          value={answer}
                          onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                        />
                        <span className="edit-placeholder">Answer:</span>
                      </div>
                      <input
                        className="edit-input-radio"
                        type="radio"
                        name="correctAnswer"
                        checked={quiz.correctAnswer === index}
                        onChange={() => setQuiz({ ...quiz, correctAnswer: index })}
                      />
                      <p
                        className="edit-text-correct"
                        style={{
                          color:
                            quiz.correctAnswer === index
                              ? "var(--accent-blue-color)"
                              : "var(--text-black)",
                        }}
                      >
                        Correct
                      </p>
                      <button className="edit-delete-btn" onClick={() => removeQuizAnswer(index)}>
                        <MdOutlineDelete size={isTablet ? "30" : "40"} />
                      </button>
                    </div>
                  ))}
                  <button className="edit-addanswer-btn" onClick={addQuizAnswer}>
                    Add Answer
                  </button>
                </div>
              )}

              {activeTab === "Poll" && (
                <div className="edit-poll-section">
                  <div className="edit-input-container">
                    <input
                      className="edit-input"
                      type="text"
                      name="question"
                      value={poll.question}
                      onChange={handlePollChange}
                    />
                    <span className="edit-placeholder">Question:</span>
                  </div>
                  <div className="edit-poll-group">
                    <label className="edit-poll-label">
                      Yes
                      <input
                        className="edit-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="Yes"
                        disabled
                      />
                    </label>
                    <label className="edit-poll-label">
                      No
                      <input
                        className="edit-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="No"
                        disabled
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="edit-media-section">
                <div className="edit-media-list">
                  {oldMedia.map((url, i) => (
                    <div className="edit-media-item" key={`old-${i}`}>
                      <div className="edit-media-img">
                        <img src={url} alt="media" />
                        <button
                          className="edit-media-delete-btn"
                          onClick={() => removeOldMedia(url)}
                        >
                          <IoClose size={42} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {newMedia.map((item, i) => (
                    <div className="edit-media-item" key={`new-${i}`}>
                      <div className="edit-media-img">
                        <img src={item.preview} alt="new media" />
                        <button className="edit-media-delete-btn" onClick={() => removeNewMedia(i)}>
                          <IoClose size={42} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="edit-file-add">
                  <label className="edit-label-add" htmlFor="imageInputCreate">
                    Add Media
                  </label>
                  <input
                    className="edit-input-add"
                    id="imageInputCreate"
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/gif, video/mp4"
                    onChange={handleMediaChange}
                  />
                </div>
              </div>

              <button className="edit-update-btn" onClick={handleUpdate}>
                Update Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPostPage;
