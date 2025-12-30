import "./CurrentQuestion.css";

/**
 * Component to display the current active question with correct answer
 * @param {Object} props
 * @param {Object} props.question - The current question object
 * @param {number} props.questionNumber - Current question number
 */
function CurrentQuestion({ question, questionNumber }) {
  if (!question) {
    return (
      <div className="current-question">
        <div className="question-placeholder">
          <p>No active question</p>
          <span>Start the game to see the current question</span>
        </div>
      </div>
    );
  }

  const correctOption = question.options.find(
    (opt) => opt.id === question.correctAnswer
  );

  return (
    <div className="current-question">
      <div className="question-header">
        <h3>Current Question {questionNumber}</h3>
      </div>
      <div className="question-content">
        <div className="question-text">{question.text}</div>
        <div className="question-options">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`option-item ${
                option.id === question.correctAnswer ? "correct" : ""
              }`}
            >
              <span className="option-label">{option.id.toUpperCase()}</span>
              <span className="option-text">{option.text}</span>
              {option.id === question.correctAnswer && (
                <span className="correct-badge">✓ Correct Answer</span>
              )}
            </div>
          ))}
        </div>
        {correctOption && (
          <div className="correct-answer-info">
            <strong>Correct Answer:</strong> {correctOption.id.toUpperCase()} -{" "}
            {correctOption.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrentQuestion;

