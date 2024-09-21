import React, { useState } from "react";
import "./Poll.css"; // Создадим файл стилей для опроса

const Poll = ({ pollData, onVote }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleVote = (answer) => {
    setSelectedAnswer(answer);
    onVote(answer); // Передаем выбранный ответ в родительский компонент
  };

  return (
    <div className="poll">
      <h2 className="poll-question">{pollData.question}</h2>
      <div className="poll-answers">
        {pollData.answers.map((answer, index) => (
          <button
            key={index}
            className={`poll-answer-button ${
              selectedAnswer === answer ? "selected" : ""
            }`}
            onClick={() => handleVote(answer)}
            disabled={!!selectedAnswer} // Отключаем выбор после ответа
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Poll;
