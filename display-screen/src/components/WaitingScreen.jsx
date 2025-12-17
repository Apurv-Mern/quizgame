import "./WaitingScreen.css";

function WaitingScreen({ participantCount }) {
  return (
    <div className="waiting-screen">
      <div className="waiting-content">
        <div className="logo-large">🌍</div>

        <h1 className="title">Where in the World?</h1>
        <p className="subtitle">Monaco Finance Conference 2025</p>

        <div className="waiting-message">
          <p>Get Ready!</p>
          <p className="message-sub">The quiz will begin shortly...</p>
        </div>

        <div className="participant-display">
          <div className="participant-icon">👥</div>
          <div className="participant-number">{participantCount}</div>
          <div className="participant-label">Players Ready</div>
        </div>

        <div className="pulse-animation">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
        </div>
      </div>
    </div>
  );
}

export default WaitingScreen;
