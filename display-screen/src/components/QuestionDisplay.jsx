import { useEffect, useState } from "react";
import "./QuestionDisplay.css";

function QuestionDisplay({ question }) {
  const [timeLeft, setTimeLeft] = useState(question?.timeLimit || 30);

  useEffect(() => {
    setTimeLeft(question?.timeLimit || 30);
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
            {question.clue1 && <li className="clue-item">{question.clue1}</li>}
            {question.clue2 && <li className="clue-item">{question.clue2}</li>}
            {question.clue3 && <li className="clue-item">{question.clue3}</li>}
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
