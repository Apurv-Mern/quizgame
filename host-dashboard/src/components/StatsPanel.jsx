import "./StatsPanel.css";

function StatsPanel({ participantCount, answerCount, recentJoins }) {
  const answerRate =
    participantCount > 0
      ? Math.round((answerCount / participantCount) * 100)
      : 0;

  return (
    <div className="stats-panel">
      <h3>Live Statistics</h3>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{participantCount}</div>
          <div className="stat-label">Total Players</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{answerCount}</div>
          <div className="stat-label">Answers Received</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{answerRate}%</div>
          <div className="stat-label">Response Rate</div>
        </div>
      </div>

      {recentJoins.length > 0 && (
        <div className="recent-joins">
          <h4>Recent Joins</h4>
          <div className="joins-list">
            {recentJoins.slice(0, 5).map((participant, index) => (
              <div key={index} className="join-item">
                <span className="join-icon">👤</span>
                <span className="join-name">{participant.nickname}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
