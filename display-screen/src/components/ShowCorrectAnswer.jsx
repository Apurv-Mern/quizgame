import "./ShowCorrectAnswer.css";

function ShowCorrectAnswer({ question, correctAnswer }) {
  if (!question) return null;
  return (
    <div className="show-correct-answer">
      <div className="correct-header">Correct Answer</div>
      <div className="question-text">{question.text}</div>
      <div className="options-list">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`option-item${
              option.id === correctAnswer ? " correct" : ""
            }`}
          >
            <span className="option-letter">{option.id.toUpperCase()}</span>
            <span className="option-text">{option.text}</span>
            {option.id === correctAnswer && (
              <span className="correct-label">✔</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowCorrectAnswer;
