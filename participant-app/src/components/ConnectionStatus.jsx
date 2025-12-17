import "./ConnectionStatus.css";

function ConnectionStatus({ status }) {
  if (status === "connected") return null;

  const getStatusConfig = () => {
    switch (status) {
      case "connecting":
        return {
          icon: "⟳",
          text: "Connecting...",
          className: "connecting",
        };
      case "reconnecting":
        return {
          icon: "🔄",
          text: "Reconnecting...",
          className: "reconnecting",
        };
      case "disconnected":
        return {
          icon: "⚠️",
          text: "Disconnected",
          className: "disconnected",
        };
      case "error":
        return {
          icon: "❌",
          text: "Connection Error",
          className: "error",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`connection-status ${config.className}`}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-text">{config.text}</span>
    </div>
  );
}

export default ConnectionStatus;
