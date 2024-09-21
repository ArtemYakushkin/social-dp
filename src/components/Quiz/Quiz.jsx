import React, { useState } from "react";
import { BsEmojiSunglasses, BsEmojiTear } from "react-icons/bs";
import QuizModal from "../QuizModal/QuizModal";
import "./Quiz.css";

const Quiz = ({ quizData }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    if (index === quizData.correctAnswer) {
      setModalMessage(
        <div>
          <BsEmojiSunglasses
            style={{
              width: "50px",
              height: "50px",
              color: "#48ff00",
              marginBottom: "20px",
            }}
          />
          <p
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Congratulations, correct answer!
          </p>
        </div>
      );
    } else {
      setModalMessage(
        <div>
          <BsEmojiTear
            style={{
              width: "50px",
              height: "50px",
              color: "#ff0000",
              marginBottom: "20px",
            }}
          />
          <p
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Incorrect answer. Please try again.
          </p>
        </div>
      );
    }
    setIsModalOpen(true); // Открываем модальное окно
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="quiz">
      <h3 className="quiz-question">
        Question: <span>{quizData.question}</span>
      </h3>
      <ul className="quiz-answers">
        {quizData.answers.map((answer, index) => (
          <li
            className="quiz-answer"
            key={index}
            onClick={() => handleAnswerClick(index)}
          >
            {answer}
          </li>
        ))}
      </ul>

      {/* Модальное окно для отображения результата */}
      <QuizModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
      />
    </div>
  );
};

export default Quiz;
