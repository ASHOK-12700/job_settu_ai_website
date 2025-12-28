import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    level: "beginner",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Login failed");
          return;
        }

        onLogin(data.token);
      } else {
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Registration failed");
          return;
        }

        setMessage("Account created. Please login.");
        setMode("login");
      }
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setMessage("Unable to connect to server. Please check if the server is running on port 5000.");
      } else {
        setMessage("Network error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="login-sub">
          {isLogin
            ? "Sign in to continue your AI interview practice."
            : "Start your AI interview practice in a few seconds."}
        </p>

        {!isLogin && (
          <>
            <label className="login-label">Name</label>
            <input
              className="login-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label className="login-label">Level</label>
            <select
              className="login-input"
              name="level"
              value={form.level}
              onChange={handleChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </>
        )}

        <label className="login-label">Email</label>
        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Processing..." : (isLogin ? "Login" : "Register")}
        </button>

        <p className="login-sub" style={{ marginTop: 12, fontSize: 12 }}>
          {isLogin ? "New here? " : "Already have an account? "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Create one" : "Login instead"}
          </span>
        </p>

        {message && <p className="login-error">{message}</p>}
      </form>
    </div>
  );
}

export default AuthPage;
