import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRegister } from "../services/api";
import "../styles/LoginPage.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inlineMsg, setInlineMsg] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  function showInline(text, type = "success") {
    setInlineMsg({ text, type });
    if (type === "success") {
      setTimeout(() => setInlineMsg(null), 3500);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password !== confirmPassword) {
      showInline("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    setInlineMsg(null);
    try {
      const userData = await apiRegister(name, email, password);
      login(userData);
      showInline("Account created successfully. Welcome to Amazon!");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || (err.message === "Network Error" || err.code === "ECONNABORTED" ? "Cannot connect to server. Please ensure the backend API is running." : "Registration failed");
      showInline(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <form className="login-form-card" onSubmit={handleSubmit}>
          <h1>Create Account</h1>

          {}
          {inlineMsg && (
            <div className={`inline-msg inline-msg--${inlineMsg.type}`}>
              <span className="inline-msg-icon">{inlineMsg.type === "success" ? "✓" : "!"}</span>
              {inlineMsg.text}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Continue"}
          </button>
          <p className="login-agreement">
            By creating an account, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
          </p>
          <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
          <div className="login-help">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
      <footer className="login-footer">
        <div className="footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <p>© 1996-2024, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </main>
  );
}
