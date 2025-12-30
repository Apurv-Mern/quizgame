import { useEffect } from "react";
import "./Toast.css";

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - Type of toast: 'success', 'info', 'warning', 'error'
 * @param {boolean} props.show - Whether to show the toast
 * @param {Function} props.onClose - Callback when toast closes
 * @param {number} props.duration - Duration in milliseconds (default: 3000)
 */
function Toast({ message, type = "info", show, onClose, duration = 3000 }) {
  useEffect(() => {
    if (show && message) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, message, duration, onClose]);

  if (!show || !message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;

