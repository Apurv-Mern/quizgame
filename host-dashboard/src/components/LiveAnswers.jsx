import "./LiveAnswers.css";

function LiveAnswers({ answers }) {
  const recentAnswers = answers.slice(-10).reverse();

  return (
    <div className="live-answers">
      <h3>Live Answers ({answers.length})</h3>

      <div className="answers-list">
        {recentAnswers.map((answer, index) => (
          <div
            key={index}
            className={`answer-item ${
              answer.isCorrect ? "correct" : "incorrect"
            }`}
          >
            <span className="answer-icon">{answer.isCorrect ? "✓" : "✗"}</span>
            <span className="answer-nickname">{answer.nickname}</span>
            <span className="answer-choice">
              Answer: {answer.answerId.toUpperCase()}
            </span>
            <span className="answer-time">{answer.responseTime}s</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveAnswers;
