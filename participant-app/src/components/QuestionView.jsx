import { useState, useEffect } from "react";
import "./QuestionView.css";

function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  answerSubmitted,
  answerResult,
  onAnswerSelect,
  onAnswerSubmit,
}) {
  const [timeRemaining, setTimeRemaining] = useState(question?.timeLimit || 30);

  useEffect(() => {
    if (!question || answerSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, answerSubmitted]);

  useEffect(() => {
    if (question) {
      setTimeRemaining(question.timeLimit);
    }
  }, [question]);

  if (!question) return null;

  const getTimerClass = () => {
    if (timeRemaining <= 10) return "critical";
    if (timeRemaining <= 20) return "warning";
    return "normal";
  };

  const getAnswerClass = (optionId) => {
    if (answerSubmitted && selectedAnswer === optionId) {
      if (answerResult?.success) {
        return "submitted";
      }
      return "submitting";
    }
    if (selectedAnswer === optionId) {
      return "selected";
    }
    return "";
  };

  const getAnswerLabel = (optionId) => {
    if (!answerSubmitted || selectedAnswer !== optionId) {
      return null;
    }

    if (answerResult?.success) {
      return <span className="answer-status">✓ Submitted</span>;
    }

    return <span className="answer-status submitting-label">Sending...</span>;
  };

  return (
    <div className="question-view">
      <div className="question-status-bar">
        <div className="question-meta">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className={`timer ${getTimerClass()}`}>⏱ {timeRemaining}s</div>
      </div>

      <div className="question-content">
        <div className="question-display-header">
          <div className="globe-icon">🌍</div>
          <h2 className="question-text">{question.text}</h2>
        </div>

        <div className="options-container">
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`option-button ${getAnswerClass(option.id)}`}
              onClick={() => onAnswerSelect(option.id)}
              disabled={answerSubmitted || timeRemaining === 0}
            >
              <div className="option-letter">{option.id.toUpperCase()}</div>
              <div className="option-text">{option.text}</div>
              {getAnswerLabel(option.id)}
            </button>
          ))}
        </div>

        {selectedAnswer && !answerSubmitted && (
          <button
            className="submit-answer-button"
            onClick={onAnswerSubmit}
            disabled={answerSubmitted || timeRemaining === 0}
          >
            Submit Answer
          </button>
        )}

        {answerResult?.success && (
          <div className="submission-success">
            ✅ Answer received! Waiting for results...
          </div>
        )}

        {answerResult?.error && (
          <div className="submission-error">❌ {answerResult.error}</div>
        )}
      </div>
    </div>
  );
}

export default QuestionView;
