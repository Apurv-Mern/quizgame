import { useState, useEffect } from "react";
import "./ResultsView.css";

function ResultsView({ results, leaderboard, participant, questionNumber, totalQuestions }) {
  const [countdown, setCountdown] = useState(5);
  const showCountdown = questionNumber && totalQuestions && questionNumber < totalQuestions;

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (showCountdown && countdown === 0) {
      setCountdown(5);
    }
  }, [showCountdown, countdown]);

  useEffect(() => {
    if (showCountdown) {
      setCountdown(5);
    }
  }, [questionNumber, showCountdown]);

  if (!results) return null;

  const getResultIcon = () => {
    if (results.isCorrect) return "✅";
    return "❌";
  };

  const getResultClass = () => {
    return results.isCorrect ? "correct" : "incorrect";
  };

  const getRankSuffix = (rank) => {
    if (!rank) return "";
    const j = rank % 10;
    const k = rank % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return (
    <div className="results-view">
      <div className="results-content">
        <div className={`result-banner ${getResultClass()}`}>
          <div className="result-icon">{getResultIcon()}</div>
          <div className="result-text">
            {results.isCorrect ? "Correct!" : "Incorrect"}
          </div>
        </div>

        <div className="score-card">
          <div className="score-item">
            <div className="score-label">Points Earned</div>
            <div className="score-value">+{results.points || 0}</div>
          </div>

          <div className="score-divider"></div>

          <div className="score-item">
            <div className="score-label">Your Rank</div>
            <div className="score-value rank">
              #{results.rank?.rank || "?"}
              <span className="rank-suffix">
                {getRankSuffix(results.rank?.rank)}
              </span>
            </div>
          </div>
        </div>

        <div className="total-score">
          <div className="total-label">Total Score</div>
          <div className="total-value">{results.totalScore || 0} points</div>
        </div>

        {leaderboard?.top10 && leaderboard.top10.length > 0 && (
          <div className="leaderboard-preview">
            <h3>🏆 Top 3</h3>
            <div className="top-three">
              {leaderboard.top10.slice(0, 3).map((player, index) => (
                <div
                  key={player.participantId}
                  className={`podium-entry ${
                    player.participantId === participant?.id ? "highlight" : ""
                  }`}
                >
                  <div className="podium-rank">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                  </div>
                  <div className="podium-info">
                    <div className="podium-name">{player.nickname}</div>
                    <div className="podium-score">{player.score} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCountdown && countdown > 0 ? (
          <div className="countdown-timer">
            <div className="countdown-label">Next question in:</div>
            <div className="countdown-value">{countdown}s</div>
          </div>
        ) : (
          <div className="next-question-message">Next question coming...</div>
        )}
      </div>
    </div>
  );
}

export default ResultsView;
