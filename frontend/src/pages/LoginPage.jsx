import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../services/api";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inlineMsg, setInlineMsg] = useState(null);
  const { login, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  function showInline(text, type = "success") {
    setInlineMsg({ text, type });
    if (type === "success") {
      setTimeout(() => setInlineMsg(null), 3500);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setInlineMsg(null);
    try {
      const userData = await apiLogin(email, password);
      login(userData);
      showInline(`Welcome back, ${userData.name}!`);
      setTimeout(() => navigate(from, { replace: true }), 500);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || (err.message === "Network Error" || err.code === "ECONNABORTED" ? "Cannot connect to server. Please ensure the backend API is running." : "Invalid email or password");
      showInline(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        {user ? (
          <div className="login-form-card">
            <h1>Your Account</h1>
            <p style={{ marginBottom: "15px", fontSize: "14px" }}>
              Hello, <strong>{user.name}</strong>. You are currently signed in with <strong>{user.email}</strong>.
            </p>
            <button
              className="login-submit-btn"
              onClick={() => {
                logout();
                showInline("Signed out successfully.");
              }}
            >
              Sign Out
            </button>
            <div className="login-help" style={{ marginTop: "15px" }}>
               <Link to="/orders">View your orders</Link>
            </div>
          </div>
        ) : (
          <form className="login-form-card" onSubmit={handleSubmit}>
            <h1>Sign in</h1>

            {inlineMsg && (
              <div className={`inline-msg inline-msg--${inlineMsg.type}`}>
                <span className="inline-msg-icon">{inlineMsg.type === "success" ? "✓" : "!"}</span>
                {inlineMsg.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email or mobile phone number</label>
              <input
                id="email"
                type="text"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Continue"}
            </button>
            <p className="login-agreement">
              By continuing, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
            </p>
            <div className="login-help">
              <a href="#">Need help?</a>
            </div>
          </form>
        )}

        <div className="new-to-amazon">
          <h5>New to Amazon?</h5>
          <button className="create-account-btn" onClick={() => navigate("/register")}>Create your Amazon account</button>
        </div>
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
