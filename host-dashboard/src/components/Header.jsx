import "./Header.css";

function Header({ connectionStatus, participantCount }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>🎮 Host Dashboard</h1>
          <span className="subtitle">Where in the World? Quiz</span>
        </div>

        <div className="header-right">
          <div className="stat-badge">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{participantCount}</span>
            <span className="stat-label">Participants</span>
          </div>

          <div className={`connection-indicator ${connectionStatus}`}>
            <div className="indicator-dot"></div>
            <span>{connectionStatus === "connected" ? "Live" : "Offline"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
