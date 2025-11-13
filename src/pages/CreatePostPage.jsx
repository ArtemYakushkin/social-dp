import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
  doc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

import '../styles/CreatePostPage.css';

const CreatePostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState('Quiz');
  const [quiz, setQuiz] = useState({
    question: '',
    answers: [],
    correctAnswer: null,
  });
  const [poll, setPoll] = useState({ question: '', answers: ['Yes', 'No'] });
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    setQuiz({ ...quiz, answers: [...quiz.answers, ''] });
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
      alert('You must be logged in to create a post.');
      return;
    }

    const senderNickname = user.displayName || 'Anonymous';

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
          nickname: senderNickname,
        },
      };

      if (activeTab === 'Quiz') {
        postData.quiz = quiz;
      } else if (activeTab === 'Poll') {
        postData.poll = poll;
      }

      const postRef = await addDoc(collection(db, 'posts'), postData);

      const senderData = {
        uid: user.uid,
        nickname: senderNickname,
        photoURL: user.photoURL,
      };

      await notifyNewPost(postRef.id, senderData);

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        createdPosts: arrayUnion({
          id: postRef.id,
        }),
      });

      toast.success('Post created successfully');
      setTitle('');
      setText('');
      setSelectedFiles([]);
      setPreviewImages([]);
      setQuiz({ question: '', answers: [], correctAnswer: null });
      setPoll({ question: '', answers: ['Yes', 'No'] });
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const notifyNewPost = async (postId, senderData) => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    usersSnapshot.forEach(async (doc) => {
      if (doc.id !== senderData.uid) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: doc.id,
          type: 'new_post',
          postId,
          postTitle: title,
          sender: senderData,
          message: `${senderData.nickname} published a new post "${title}"`,
          createdAt: serverTimestamp(),
          read: false,
        });
      }
    });
  };

  return (
    <>
      {isMobile ? (
        <div className="create">
          <div className="container">
            <form className="create-wrapp-mobile" onSubmit={handleSubmit}>
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
                  className={`create-tabs-btn ${
                    activeTab === 'Quiz' ? 'create-tabs-btn-active' : ''
                  }`}
                  type="button"
                  onClick={() => setActiveTab('Quiz')}
                >
                  Quiz
                </button>
                <button
                  className={`create-tabs-btn ${
                    activeTab === 'Poll' ? 'create-tabs-btn-active' : ''
                  }`}
                  type="button"
                  onClick={() => setActiveTab('Poll')}
                >
                  Poll
                </button>
              </div>

              {activeTab === 'Quiz' && (
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
                      <div className="create-quiz-answers-correct">
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
                                ? 'var(--accent-blue-color)'
                                : 'var(--text-black)',
                          }}
                        >
                          Correct
                        </p>
                      </div>
                    </div>
                  ))}
                  <button className="create-addanswer-btn" type="button" onClick={addQuizAnswer}>
                    Add Answer
                  </button>
                </div>
              )}

              {activeTab === 'Poll' && (
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
                    <label className="create-poll-label">
                      Yes
                      <input
                        className="create-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="Yes"
                        disabled
                      />
                    </label>
                    <label className="create-poll-label">
                      No
                      <input
                        className="create-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="No"
                        disabled
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="create-media-section">
                {previewImages.length > 0 && (
                  <div className="create-media-list">
                    {previewImages.map((image, index) => (
                      <div className="create-media-img">
                        <img src={image} alt={`Preview ${index + 1}`} key={index} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="create-file-add">
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
              </div>

              <button className="create-update-btn" type="submit">
                Create
              </button>
            </form>
          </div>
        </div>
      ) : (
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
                  className={`create-tabs-btn ${
                    activeTab === 'Quiz' ? 'create-tabs-btn-active' : ''
                  }`}
                  type="button"
                  onClick={() => setActiveTab('Quiz')}
                >
                  Quiz
                </button>
                <button
                  className={`create-tabs-btn ${
                    activeTab === 'Poll' ? 'create-tabs-btn-active' : ''
                  }`}
                  type="button"
                  onClick={() => setActiveTab('Poll')}
                >
                  Poll
                </button>
              </div>

              {activeTab === 'Quiz' && (
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
                              ? 'var(--accent-blue-color)'
                              : 'var(--text-black)',
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

              {activeTab === 'Poll' && (
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
                    <label className="create-poll-label">
                      Yes
                      <input
                        className="create-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="Yes"
                        disabled
                      />
                    </label>
                    <label className="create-poll-label">
                      No
                      <input
                        className="create-input-radio"
                        type="radio"
                        name="pollAnswer"
                        value="No"
                        disabled
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="create-media-section">
                {previewImages.length > 0 && (
                  <div className="create-media-list">
                    {previewImages.map((image, index) => (
                      <div className="create-media-img" key={index}>
                        <img src={image} alt={`Preview ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="create-file-add">
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
              </div>

              <button className="create-update-btn" type="submit">
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostPage;
