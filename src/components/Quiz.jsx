import React, { useState } from "react";

import QuizModal from "./QuizModal";
import UnregisteredModal from "./UnregisteredModal";

// import SadRobot from "../assets/robby-base.svg";
// import HappyRobot from "../assets/robby-funny.svg";
// import HandRobot from "../assets/robby-hand.svg";
import Star from "../assets/star.png";

import "../styles/Quiz.css";

const Quiz = ({ quizData, user }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const handleAnswerClick = (index) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    setSelectedAnswer(index);

    if (index === quizData.correctAnswer) {
      setModalMessage(
        <div className="quiz-happy-wrapp">
          <div className="quiz-happy-img-box">
            {/* <img className="quiz-happy-img-robot" src={HappyRobot} alt="robot" /> */}
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
    } else {
      setModalMessage(
        <div className="quiz-sad-wrapp">
          <div className="quiz-sad-img-box">
            <img className="quiz-sad-img-robot" src="/image/robby-base.svg" alt="robot" />
            <img className="quiz-sad-img-hand" src="/image/robby-hand.svg" alt="robot hand" />
            {/* <img className="quiz-sad-img-robot" src={SadRobot} alt="robot" />
            <img className="quiz-sad-img-hand" src={HandRobot} alt="robot hand" /> */}
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
    setIsQuizModalOpen(true);
  };

  const closeModal = () => {
    setIsQuizModalOpen(false);
  };

  return (
    <div className="quiz">
      <h3 className="quiz-question">{quizData.question}</h3>
      <ul className="quiz-answers">
        {quizData.answers.map((answer, index) => (
          <li className="quiz-answer" key={index} onClick={() => handleAnswerClick(index)}>
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
