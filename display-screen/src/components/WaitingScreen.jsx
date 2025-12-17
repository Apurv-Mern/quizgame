import { QRCodeSVG } from "qrcode.react";
import "./WaitingScreen.css";

function WaitingScreen({ participantCount }) {
  // Get the participant app URL from environment or use default
  const participantUrl =
    import.meta.env.VITE_PARTICIPANT_URL || "http://localhost:5173";

  return (
    <div className="waiting-screen">
      <div className="waiting-content">
        <div className="logo-large">🌍</div>

        <h1 className="title">Where in the World?</h1>
        <p className="subtitle">Monaco Finance Conference 2025</p>

        <div style={{ display: "flex", gap: "80px" }}>
          <div className="join-section">
            <h2 className="join-title">Join the Game</h2>
            <p className="join-instruction">
              Scan the QR code to join on your mobile device
            </p>

            <div className="qr-code-container">
              <div className="qr-code-wrapper">
                <QRCodeSVG
                  value={participantUrl}
                  size={280}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#1e40af"
                />
              </div>
              <div className="url-display">{participantUrl}</div>
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <div className="waiting-message">
              <p className="message-main">Waiting for players to join...</p>
              <p className="message-sub">The quiz will begin shortly</p>
            </div>
            <div className="participant-display">
              <div className="participant-icon">👥</div>
              <div className="participant-number">{participantCount}</div>
              <div className="participant-label">Players Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingScreen;
