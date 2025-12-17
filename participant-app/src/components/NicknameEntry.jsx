import { useState } from "react";
import "./NicknameEntry.css";

function NicknameEntry({ onJoin, error, participantCount }) {
  const [nickname, setNickname] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateNickname = (value) => {
    if (value.length < 3) {
      return "Too short - use at least 3 characters";
    }
    if (value.length > 15) {
      return "Too long - max 15 characters";
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
      return "Letters and numbers only";
    }
    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNickname(value);

    if (value) {
      const error = validateNickname(value);
      setValidationError(error);
    } else {
      setValidationError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = nickname.trim();
    const error = validateNickname(trimmed);

    if (error) {
      setValidationError(error);
      return;
    }

    onJoin(trimmed);
  };

  const isValid = nickname.length >= 3 && !validationError;

  return (
    <div className="nickname-entry">
      <div className="nickname-entry-content">
        <div className="logo">🌍</div>
        <h1>Where in the World?</h1>
        <p className="subtitle">Live Quiz - Monaco 2025</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Choose Your Nickname"
              value={nickname}
              onChange={handleChange}
              autoFocus
              maxLength={15}
              className={validationError || error ? "error" : ""}
            />
            <div className="input-hint">
              {nickname.length > 0 && `${nickname.length}/15`}
            </div>
          </div>

          {(validationError || error) && (
            <div className="error-message">❌ {validationError || error}</div>
          )}

          <button type="submit" className="join-button" disabled={!isValid}>
            JOIN GAME
          </button>
        </form>

        {participantCount > 0 && (
          <p className="participant-count">
            {participantCount} players already in
          </p>
        )}
      </div>
    </div>
  );
}

export default NicknameEntry;
