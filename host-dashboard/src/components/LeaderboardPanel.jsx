import { useState, useEffect } from "react";
import "./LeaderboardPanel.css";

function LeaderboardPanel({ leaderboard, showCountdown = false, onCountdownComplete }) {
  const [countdown, setCountdown] = useState(showCountdown ? 5 : 0);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onCountdownComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (showCountdown && countdown === 0) {
      setCountdown(5);
    }
  }, [showCountdown, countdown, onCountdownComplete]);

  useEffect(() => {
    if (showCountdown) {
      setCountdown(5);
    }
  }, [showCountdown]);

  if (!leaderboard?.top10 || leaderboard.top10.length === 0) {
    return (
      <div className="leaderboard-panel">
        <h3>🏆 Leaderboard</h3>
        <div className="empty-state">
          <p>No scores yet</p>
          <p className="empty-hint">Start the first question to see rankings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-header">
        <h3>🏆 Top 10 Leaderboard</h3>
        <div className="total-count">
          {leaderboard.totalParticipants} players
        </div>
      </div>

      {showCountdown && countdown > 0 && (
        <div className="countdown-timer">
          <div className="countdown-label">Next question in:</div>
          <div className="countdown-value">{countdown}s</div>
        </div>
      )}

      <div className="leaderboard-list">
        {leaderboard.top10.map((player) => (
          <div key={player.participantId} className="leaderboard-entry">
            <div className="rank-badge">#{player.rank}</div>
            <div className="player-info">
              <div className="player-name">{player.nickname}</div>
              <div className="player-stats">
                {player.correctCount} correct ·{" "}
                {player.avgResponseTime.toFixed(1)}s avg
              </div>
            </div>
            <div className="player-score">
              {player.score}
              <span className="score-label">pts</span>
            </div>
            {player.change && player.change !== "→" && (
              <div
                className={`rank-change ${
                  player.change.startsWith("+") ? "up" : "down"
                }`}
              >
                {player.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardPanel;
