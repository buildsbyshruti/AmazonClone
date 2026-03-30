import { useEffect, useState } from "react";
import "../styles/Toast.css";

export default function Toast({ message, show, type = "success", onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`amazon-toast ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === "success" ? "✓" : "!"}
        </span>
        <span className="toast-msg">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}
