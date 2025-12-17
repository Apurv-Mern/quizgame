import "./GameControls.css";

function GameControls({
  currentQuestion,
  totalQuestions,
  gameStatus,
  onStartQuestion,
  onEndQuestion,
  onPauseGame,
  onEndGame,
  canStartNext,
}) {
  const isActive = gameStatus === "active";

  return (
    <div className="game-controls">
      <div className="controls-header">
        <h2>Game Controls</h2>
        <div className="question-progress">
          Question {currentQuestion || 0} of {totalQuestions}
        </div>
      </div>

      <div className="controls-grid">
        <button
          className="control-btn primary large"
          onClick={onStartQuestion}
          disabled={!canStartNext || isActive}
        >
          {currentQuestion === 0 ? "▶️ Start Game" : "▶️ Next Question"}
        </button>

        <button
          className="control-btn warning"
          onClick={onEndQuestion}
          disabled={!isActive}
        >
          ⏹️ End Question
        </button>

        <button
          className="control-btn secondary"
          onClick={onPauseGame}
          disabled={!isActive}
        >
          ⏸️ Pause Game
        </button>

        <button className="control-btn danger" onClick={onEndGame}>
          🏁 End Game
        </button>
      </div>

      {isActive && (
        <div className="active-indicator">
          <div className="pulse-dot"></div>
          <span>Question Active</span>
        </div>
      )}
    </div>
  );
}

export default GameControls;
