import { useEffect, useState } from "react";
import "./QuestionDisplay.css";

function QuestionDisplay({ question }) {
  const [timeLeft, setTimeLeft] = useState(question?.timeLimit || 30);
  const [visibleHints, setVisibleHints] = useState([1]); // Start with hint 1 visible

  useEffect(() => {
    setTimeLeft(question?.timeLimit || 30);
    setVisibleHints([1]); // Reset to only hint 1 when new question starts
    if (!question?.timeLimit) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [question]);

  const getTimerClass = () => {
    if (timeLeft <= 10) return "critical";
    if (timeLeft <= 20) return "warning";
    return "normal";
  };

  // Function to handle hint reveals from backend
  const handleHintReveal = (hintNumber) => {
    setVisibleHints((prev) => {
      if (!prev.includes(hintNumber)) {
        return [...prev, hintNumber];
      }
      return prev;
    });
  };

  // Expose handleHintReveal to parent via prop (if needed) or listen to socket events here
  useEffect(() => {
    // Import socket service dynamically
    import("../services/socket").then(({ default: socketService }) => {
      const handleReveal = (data) => {
        handleHintReveal(data.hintNumber);
      };

      socketService.on("reveal_hint", handleReveal);

      return () => {
        socketService.off("reveal_hint", handleReveal);
      };
    });
  }, []);

  return (
    <div className="question-display">
      <div className="question-content">
        <div className="question-header">
          <div className={`timer-display ${getTimerClass()}`}>
            ⏱ {timeLeft}s
          </div>
          <h2 className="question-region">{question.text}</h2>
        </div>

        <div className="clues-section">
          <div className="clues-label">Clues:</div>
          <ul className="clues-list">
            {question.clue1 && visibleHints.includes(1) && (
              <li className="clue-item">{question.clue1}</li>
            )}
            {question.clue2 && visibleHints.includes(2) && (
              <li className="clue-item">{question.clue2}</li>
            )}
            {question.clue3 && visibleHints.includes(3) && (
              <li className="clue-item">{question.clue3}</li>
            )}
          </ul>
        </div>

        <div className="options-grid">
          {question.options.map((option, index) => (
            <div key={option.id} className="option-card">
              <div className="option-letter">{option.id.toUpperCase()}</div>
              <div className="option-text">{option.text}</div>
            </div>
          ))}
        </div>

        <div className="instruction-text">Answer on your mobile device</div>
      </div>
    </div>
  );
}

export default QuestionDisplay;
