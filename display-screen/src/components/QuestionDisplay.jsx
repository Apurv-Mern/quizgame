import "./QuestionDisplay.css";

function QuestionDisplay({ question }) {
  return (
    <div className="question-display">
      <div className="question-content">
        <div className="question-header">
          <div className="globe-icon">30d</div>
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
