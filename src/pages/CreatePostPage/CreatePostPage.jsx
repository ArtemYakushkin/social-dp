import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth"; // Хук для получения данных о текущем пользователе
import { db, storage } from "../../firebase"; // Firebase конфигурация
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "./CreatePostPage.css";

const CreatePostPage = () => {
  const { user } = useAuth(); // Получаем данные о текущем пользователе
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // Состояние для превью изображений
  const [activeTab, setActiveTab] = useState("Quiz"); // Текущая активная вкладка
  const [quiz, setQuiz] = useState({
    question: "",
    answers: [],
    correctAnswer: null,
  });
  const [poll, setPoll] = useState({ question: "", answers: ["Yes", "No"] });
  const navigate = useNavigate();

  // Обработчик изменения файлов
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Создаем массив для хранения URL-адресов превью
    const filePreviews = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Преобразуем файл в URL

      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result); // Когда чтение завершено, сохраняем результат
        };
      });
    });

    // Ждем завершения загрузки всех превью и сохраняем их в состоянии
    Promise.all(filePreviews).then((previews) => {
      setPreviewImages(previews);
    });
  };

  // Обработчик изменения формы Quiz
  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  // Обработчик добавления вариантов ответа в Quiz
  const addQuizAnswer = () => {
    setQuiz({ ...quiz, answers: [...quiz.answers, ""] });
  };

  // Обработчик изменения вариантов ответа в Quiz
  const handleQuizAnswerChange = (index, value) => {
    const newAnswers = [...quiz.answers];
    newAnswers[index] = value;
    setQuiz({ ...quiz, answers: newAnswers });
  };

  // Обработчик формы Poll
  const handlePollChange = (e) => {
    setPoll({ ...poll, [e.target.name]: e.target.value });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      // Загрузка изображений или видео в Firebase Storage
      const mediaUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const storageRef = ref(storage, `posts/${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      // Подготовка данных для сохранения в Firestore
      const postData = {
        title,
        text,
        media: mediaUrls,
        createdAt: Timestamp.now().toDate().toISOString(),
        comments: [],
        likes: [],
        views: 0,
        author: {
          avatar: user.photoURL,
          nickname: user.displayName,
        },
      };

      // Добавление функционала для вкладок Quiz и Poll
      if (activeTab === "Quiz") {
        postData.quiz = quiz;
      } else if (activeTab === "Poll") {
        postData.poll = poll;
      }

      // Сохранение данных в Firestore
      await addDoc(collection(db, "posts"), postData);

      toast.success("Post created successfully");
      // Очистка формы после успешного сохранения
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
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="create-group">
            <label className="create-label">
              Title
              <input
                className="create-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Create title..."
              />
            </label>
          </div>
          <div className="create-group">
            <label className="create-label">
              Text
              <textarea
                className="create-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Create text..."
              />
            </label>
          </div>

          {/* Вкладки для выбора Quiz или Poll */}
          <div className="create-select">
            <button
              className={
                activeTab === "Quiz"
                  ? "create-select-btn-activ"
                  : "create-select-btn"
              }
              type="button"
              onClick={() => setActiveTab("Quiz")}
            >
              Quiz
            </button>
            <button
              className={
                activeTab === "Poll"
                  ? "create-select-btn-activ"
                  : "create-select-btn"
              }
              type="button"
              onClick={() => setActiveTab("Poll")}
            >
              Poll
            </button>
          </div>

          {/* Функционал для Quiz */}
          {activeTab === "Quiz" && (
            <div className="create-quiz">
              <label className="create-label">
                Question
                <input
                  className="create-input"
                  type="text"
                  name="question"
                  value={quiz.question}
                  onChange={handleQuizChange}
                  placeholder="Enter quiz question..."
                />
              </label>
              {quiz.answers.map((answer, index) => (
                <div key={index} className="create-quiz-group">
                  <input
                    className="create-quiz-input-text"
                    type="text"
                    value={answer}
                    onChange={(e) =>
                      handleQuizAnswerChange(index, e.target.value)
                    }
                    placeholder={`Answer ${index + 1}`}
                  />
                  <input
                    className="create-quiz-input-radio"
                    type="radio"
                    name="correctAnswer"
                    value={index}
                    checked={quiz.correctAnswer === index}
                    onChange={() => setQuiz({ ...quiz, correctAnswer: index })}
                  />
                  Correct
                </div>
              ))}
              <button
                className="create-quiz-btn"
                type="button"
                onClick={addQuizAnswer}
              >
                Add Answer
              </button>
            </div>
          )}

          {/* Функционал для Poll */}
          {activeTab === "Poll" && (
            <div className="create-poll">
              <label className="create-label">
                Question
                <input
                  className="create-input"
                  type="text"
                  name="question"
                  value={poll.question}
                  onChange={handlePollChange}
                  placeholder="Enter poll question..."
                />
              </label>
              <div className="create-poll-group">
                <label>
                  Yes
                  <input type="radio" name="pollAnswer" value="Yes" />
                </label>
                <label>
                  No
                  <input type="radio" name="pollAnswer" value="No" />
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
