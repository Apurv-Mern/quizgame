import "./WaitingRoom.css";

function WaitingRoom({ participant, participantCount }) {
  return (
    <div className="waiting-room">
      <div className="waiting-content">
        <div className="logo">🌍</div>

        <h1>Hey {participant?.nickname}! 👋</h1>
        <h2>You're in!</h2>

        <p className="waiting-message">Waiting for host to start the quiz...</p>

        <div className="participant-counter">
          <div className="counter-icon">👥</div>
          <div className="counter-text">
            <strong>{participantCount}</strong> Players Ready
          </div>
        </div>

        <p className="info-text">The game will begin shortly</p>

        <div className="pulse-indicator"></div>
      </div>
    </div>
  );
}

export default WaitingRoom;
