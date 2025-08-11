import React, { useState, useEffect } from "react";

import QuizModal from "./QuizModal";
import UnregisteredModal from "./UnregisteredModal";

import Star from "../assets/star.png";

import "../styles/Quiz.css";

const Quiz = ({ quizData, user, postId }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const quizKey = `quiz-${postId}-${quizData.question.replace(/\s+/g, "-")}-${
    user?.uid || "guest"
  }`;

  useEffect(() => {
    const stored = localStorage.getItem(quizKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedAnswer(parsed.selectedAnswer);
      setIsAnswered(true);
    }
  }, [quizKey]);

  const handleAnswerClick = (index) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    if (isAnswered) return;

    if (index === quizData.correctAnswer) {
      setSelectedAnswer(index);
      setIsAnswered(true);

      localStorage.setItem(
        quizKey,
        JSON.stringify({
          selectedAnswer: index,
          correct: true,
        })
      );

      setModalMessage(
        <div className="quiz-happy-wrapp">
          <div className="quiz-happy-img-box">
            <img className="quiz-happy-img-robot" src="/image/robby-funny.svg" alt="robot" />
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
      setIsQuizModalOpen(true);
    } else {
      setModalMessage(
        <div className="quiz-sad-wrapp">
          <div className="quiz-sad-img-box">
            <img className="quiz-sad-img-robot" src="/image/robby-base.svg" alt="robot" />
            <img className="quiz-sad-img-hand" src="/image/robby-hand.svg" alt="robot hand" />
          </div>
          <div className="quiz-sad-content">
            <h4 className="quiz-sad-title">Oops!</h4>
            <p className="quiz-sad-text">Not correct this time. Don’t worry — try again!</p>
          </div>
        </div>
      );
      setIsQuizModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsQuizModalOpen(false);
  };

  return (
    <div className="quiz">
      <h3 className="quiz-question">{quizData.question}</h3>
      <ul className="quiz-answers">
        {quizData.answers.map((answer, index) => (
          <li
            key={index}
            className={`quiz-answer ${
              isAnswered && index === selectedAnswer ? "quiz-answer-selected" : ""
            } ${isAnswered && index !== selectedAnswer ? "quiz-answer-disabled" : ""}`}
            onClick={() => handleAnswerClick(index)}
          >
            {answer}
          </li>
        ))}
      </ul>

      <QuizModal isOpen={isQuizModalOpen} onClose={closeModal} message={modalMessage} />
      <UnregisteredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Quiz;
