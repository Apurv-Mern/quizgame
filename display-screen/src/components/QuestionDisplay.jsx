import "./QuestionDisplay.css";

function QuestionDisplay({ question }) {
  return (
    <div className="question-display">
      <div className="question-content">
        <div className="question-header">
          <div className="globe-icon">🌍</div>
          <h2 className="question-text">{question.text}</h2>
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
