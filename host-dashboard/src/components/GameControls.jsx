import { useState, useEffect } from "react";
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
  const [timer, setTimer] = useState(30);
  const isActive = gameStatus === "active";

  // Timer countdown effect
  useEffect(() => {
    if (isActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, timer]);

  // Reset timer when new question starts
  useEffect(() => {
    if (isActive && currentQuestion > 0) {
      setTimer(30);
    }
  }, [currentQuestion, isActive]);

  // Reset timer when game ends or becomes inactive
  useEffect(() => {
    if (!isActive) {
      setTimer(30);
    }
  }, [isActive]);

  return (
    <div className="game-controls">
      <div className="controls-header">
        <h2>Game Controls</h2>
        <div className="question-progress">
          Question {currentQuestion || 0} of {totalQuestions}
        </div>
      </div>

      {isActive && (
        <div className="timer-display">
          <div className="timer-label">Time Remaining</div>
          <div className={`timer-value ${timer <= 5 ? "timer-warning" : ""}`}>
            {timer}s
          </div>
        </div>
      )}

      <div className="controls-grid">
        <button
          className="control-btn primary large"
          onClick={onStartQuestion}
          disabled={!canStartNext}
        >
          {currentQuestion === 0 ? "▶️ Start Game" : "▶️ Next Question"}
        </button>
        {/* 
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
        </button> */}

        <button className="control-btn danger large" onClick={onEndGame}>
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
