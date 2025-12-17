import "./Leaderboard.css";

function Leaderboard({ data, showFinalMessage }) {
  if (!data?.top10 || data.top10.length === 0) {
    return (
      <div className="leaderboard">
        <div className="leaderboard-content">
          <h1 className="leaderboard-title">🏆 Leaderboard</h1>
          <p className="empty-message">Waiting for scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-content">
        {showFinalMessage && (
          <div className="game-ended-banner">🏁 Game Ended - Final Results</div>
        )}
        <h1 className="leaderboard-title">🏆 Top 10 Leaderboard</h1>

        <div className="podium">
          {data.top10.slice(0, 3).map((player, index) => (
            <div
              key={player.participantId}
              className={`podium-position position-${index + 1}`}
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

        {data.top10.length > 3 && (
          <div className="rankings-list">
            {data.top10.slice(3).map((player) => (
              <div key={player.participantId} className="ranking-entry">
                <div className="ranking-position">#{player.rank}</div>
                <div className="ranking-name">{player.nickname}</div>
                <div className="ranking-score">{player.score}</div>
              </div>
            ))}
          </div>
        )}

        <div className="total-players">
          {data.totalParticipants} players competing
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
