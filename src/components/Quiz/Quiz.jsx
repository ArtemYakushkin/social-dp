import React, { useState } from "react";
import QuizModal from "../QuizModal/QuizModal";
import SadRobot from "../../assets/robot-sad.png";
import HappyRobot from "../../assets/robot-happy.png";
import HandRobot from "../../assets/robot-hand.png";
import Star from "../../assets/star.png";
import "./Quiz.css";

const Quiz = ({ quizData }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    if (index === quizData.correctAnswer) {
      setModalMessage(
        <div className="quiz-happy-wrapp">
          <div className="quiz-happy-img-box">
            <img
              className="quiz-happy-img-robot"
              src={HappyRobot}
              alt="robot"
            />
          </div>
          <div className="quiz-happy-content">
            <img className="quiz-happy-img-star" src={Star} alt="star" />
            <h4 className="quiz-happy-title">Congratulations!</h4>
            <p className="quiz-happy-text">
              This is the correct answer. You are very knowledgeable!
            </p>
          </div>
        </div>
      );
    } else {
      setModalMessage(
        <div className="quiz-sad-wrapp">
          <div className="quiz-sad-img-box">
            <img className="quiz-sad-img-robot" src={SadRobot} alt="robot" />
            <img
              className="quiz-sad-img-hand"
              src={HandRobot}
              alt="robot hand"
            />
          </div>
          <div className="quiz-sad-content">
            <h4 className="quiz-sad-title">Alas, not this time</h4>
            <p className="quiz-sad-text">
              The answer is wrong, but next time you will definitely be lucky!
            </p>
          </div>
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
      <h3 className="quiz-question">{quizData.question}</h3>
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
