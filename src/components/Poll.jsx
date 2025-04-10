import React, { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../firebase";
import { useAuth } from "../auth/useAuth";

import UnregisteredModal from "./UnregisteredModal";

import "../styles/Poll.css";

const Poll = ({ pollData, postId }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [pollVotes, setPollVotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const pollKey = `poll-${postId}-${pollData.question.replace(/\s+/g, "-")}-${
    user?.uid || "guest"
  }`;

  useEffect(() => {
    const fetchPollVotes = async () => {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        setPollVotes(postData.pollVotes || new Array(pollData.answers.length).fill(0));
      }
    };

    const stored = localStorage.getItem(pollKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedAnswer(parsed.selectedAnswer);
    }

    fetchPollVotes();
  }, [postId, pollData.answers.length, pollKey]);

  const handleVote = async (index) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    if (selectedAnswer !== null) return;

    try {
      const updatedVotes = [...pollVotes];
      updatedVotes[index] += 1;

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        pollVotes: updatedVotes,
        lastVoteTime: serverTimestamp(),
      });

      setSelectedAnswer(index);
      setPollVotes(updatedVotes);

      localStorage.setItem(
        pollKey,
        JSON.stringify({
          selectedAnswer: index,
        })
      );

      toast.success("Your vote has been recorded!");
    } catch (error) {
      console.error("Error updating vote count:", error);
      toast.error("Failed to record your vote.");
    }
  };

  const getPercentage = (index) => {
    const totalVotes = pollVotes.reduce((acc, votes) => acc + votes, 0);
    if (totalVotes === 0) return 0;
    return Math.round((pollVotes[index] / totalVotes) * 100);
  };

  return (
    <div className="poll">
      <h2 className="poll-question">{pollData.question}</h2>
      <div className="poll-answers">
        {pollData.answers.map((answer, index) => (
          <div key={index} className="poll-answer">
            <button
              className={`poll-answer-button ${
                selectedAnswer === index ? "poll-answer-button-selected" : ""
              }`}
              onClick={() => handleVote(index)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
            <div className="poll-votes">
              <div className="poll-progress-bar">
                <div className="poll-progress" style={{ width: `${getPercentage(index)}%` }}></div>
              </div>
              <p className="poll-progress-text">
                {pollVotes[index]} votes ({getPercentage(index)}%)
              </p>
            </div>
          </div>
        ))}
      </div>

      <UnregisteredModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Poll;
