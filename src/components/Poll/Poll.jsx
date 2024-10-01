import React, { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Импорт Firebase конфигурации
import { useAuth } from "../../auth/useAuth"; // Хук для получения информации о текущем пользователе
import { toast } from "react-toastify"; // Для отображения уведомлений
import "./Poll.css"; // Стили для опроса

const Poll = ({ pollData, postId }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [pollVotes, setPollVotes] = useState([]); // Хранение количества голосов
  const { user } = useAuth(); // Получаем информацию о текущем пользователе

  // Загрузка текущих данных о голосах из Firebase
  useEffect(() => {
    const fetchPollVotes = async () => {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        setPollVotes(
          postData.pollVotes || new Array(pollData.answers.length).fill(0)
        );
      }
    };
    fetchPollVotes();
  }, [postId, pollData.answers.length]);

  const handleVote = async (index) => {
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }
    if (selectedAnswer !== null) return; // Если уже проголосовал, ничего не делать

    try {
      // Обновляем локальное состояние голосов
      const updatedVotes = [...pollVotes];
      updatedVotes[index] += 1;

      // Сохраняем в Firebase
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        pollVotes: updatedVotes,
        lastVoteTime: serverTimestamp(), // Обновляем время последнего голоса
      });

      // Обновляем состояние компонента
      setSelectedAnswer(index);
      setPollVotes(updatedVotes);

      toast.success("Your vote has been recorded!");
    } catch (error) {
      console.error("Error updating vote count:", error);
      toast.error("Failed to record your vote.");
    }
  };

  // Функция для расчета процентного соотношения
  const getPercentage = (index) => {
    const totalVotes = pollVotes.reduce((acc, votes) => acc + votes, 0);
    if (totalVotes === 0) return 0;
    return Math.round((pollVotes[index] / totalVotes) * 100); // Округление до целого числа
  };

  return (
    <div className="poll">
      <h2 className="poll-question">{pollData.question}</h2>
      <div className="poll-answers">
        {pollData.answers.map((answer, index) => (
          <div key={index} className="poll-answer">
            <button
              className={`poll-answer-button ${
                selectedAnswer === index ? "selected" : ""
              }`}
              onClick={() => handleVote(index)}
              disabled={selectedAnswer !== null} // Отключаем выбор после ответа
            >
              {answer}
            </button>
            <div className="poll-votes">
              <div className="poll-progress-bar">
                <div
                  className="poll-progress"
                  style={{ width: `${getPercentage(index)}%` }}
                ></div>
              </div>
              <p className="poll-progress-text">
                {pollVotes[index]} votes ({getPercentage(index)}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Poll;
