import React, { useState } from "react";
import AuthPage from "./pages/AuthPage";
import InterviewPage from "./pages/InterviewPage";
import GrammarQuizPage from "./pages/GrammarQuizPage";
import DomainSelector from "./components/DomainSelector";
import ResumeSection from "./components/ResumeSection";
import GeminiPlacementChatbot from "./components/GeminiPlacementChatbot";
import "./App.css";

function HomePage({ onStartPractice }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-pill">AI Mock Interview · Beta</div>
          <h1>
            Face your next interview
            <span className="gradient-text"> with confidence.</span>
          </h1>
          <p className="hero-subtitle">
            Practice real‑world interview questions with an AI interviewer,
            get instant feedback, and track your progress — all from one clean
            dashboard.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onStartPractice}>
              Start Free Practice
            </button>
            <button className="btn-ghost" onClick={onStartPractice}>
              Go to Practice
            </button>
          </div>

          <ul className="hero-points">
            <li>Role‑based and level‑based questions.</li>
            <li>Structured feedback after every answer.</li>
            <li>Designed for students and job seekers.</li>
          </ul>
        </div>

        <div className="hero-right">
          <div className="glass-panel">
            <p className="panel-title">Live Interview Snapshot</p>
            <div className="panel-question">
              <span className="badge">Question 1</span>
              <p>“Tell me about a time you solved a difficult problem.”</p>
            </div>
            <div className="panel-metrics">
              <div>
                <span className="metric-label">Confidence</span>
                <span className="metric-value">7.8/10</span>
              </div>
              <div>
                <span className="metric-label">Clarity</span>
                <span className="metric-value">8.2/10</span>
              </div>
              <div>
                <span className="metric-label">Structure</span>
                <span className="metric-value">7.5/10</span>
              </div>
            </div>
            <p className="panel-footer">
              “Great story. Next time, add numbers to show impact.”
            </p>
          </div>
        </div>
      </section>

      {/* Resume section removed from home page - now only accessible via Resume tab */}

      {/* AI Placement Chatbot */}
      <GeminiPlacementChatbot />
    </div>
  );
}

function App() {
  // Initialize state from localStorage so login persists on refresh
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedDomain, setSelectedDomain] = useState("");
  // views: 'auth' | 'home' | 'grammar' | 'domain' | 'interview' | 'resume'
  const [view, setView] = useState(token ? "home" : "auth");

  const handleLogin = (t) => {
    localStorage.setItem("token", t); // Save to storage
    setToken(t);
    setView("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove from storage
    setToken(null);
    setView("auth");
    setSelectedDomain("");
  };

  return (
    <div className="app-root">
      {/* Top navbar */}
      <header className="navbar">
        <div className="navbar-left">
          <img
            src="https://i.postimg.cc/q77HP3QG/Gemini-Generated-Image-7t00uq7t00uq7t00.png"
            alt="Job Settu AI Logo"
            className="navbar-logo-img"
          />
          <span className="logo-mark">
            <i>J</i>ob
          </span>
          <span className="logo-text">
            <i>S</i>ettu AI
          </span>
        </div>

        <nav className="navbar-links">
          {token && (
            <>
              <button
                className={`nav-link ${view === "home" ? "nav-link-active" : ""
                  }`}
                onClick={() => setView("home")}
              >
                Home
              </button>

              <button
                className={`nav-link ${view === "grammar" ? "nav-link-active" : ""
                  }`}
                onClick={() => setView("grammar")}
              >
                Grammar Quiz
              </button>

              {/* Resume tab */}
              <button
                className={`nav-link ${view === "resume" ? "nav-link-active" : ""
                  }`}
                onClick={() => setView("resume")}
              >
                Resume
              </button>

              <button
                className={`nav-link ${view === "domain" || view === "interview"
                  ? "nav-link-active"
                  : ""
                  }`}
                onClick={() => {
                  setSelectedDomain("");
                  setView("domain");
                }}
              >
                Practice
              </button>
            </>
          )}

          {!token && (
            <button
              className={`nav-link ${view === "auth" ? "nav-link-active" : ""
                }`}
              onClick={() => setView("auth")}
            >
              Login
            </button>
          )}
        </nav>

        <div className="navbar-right">
          {token ? (
            <button className="btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="btn-outline"
              onClick={() => setView("auth")}
            >
              Get Started
            </button>
          )}
        </div>
      </header>

      {/* Main content area */}
      <main className="main-container">
        {/* Login / Register */}
        {view === "auth" && !token && (
          <div
            className="login-bg-wrapper"
            style={{
              backgroundImage:
                "url(https://pngtree.com/free-backgrounds-photos/blue-orange)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="card card-auth login-card-overlay">
              <AuthPage onLogin={handleLogin} />
            </div>
          </div>
        )}

        {/* Home – after login */}
        {token && view === "home" && (
          <HomePage onStartPractice={() => setView("domain")} />
        )}

        {/* Grammar quiz */}
        {token && view === "grammar" && (
          <div
            className="card card-interview"
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
            }}
          >
            <GrammarQuizPage />
          </div>
        )}

        {/* Resume full-page section */}
        {token && view === "resume" && (
          <div
            className="card card-interview"
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
          >
            <ResumeSection token={token} onStart={() => { }} />
          </div>
        )}

        {/* Practice Step 1: Domain selection */}
        {token && view === "domain" && (
          <DomainSelector
            selectedDomain={selectedDomain}
            onSelect={(d) => {
              setSelectedDomain(d);
              setView("interview");
            }}
            onBack={() => setView("home")}
          />
        )}

        {/* Practice Step 2: Interview */}
        {token && view === "interview" && (
          <div className="card card-interview">
            <InterviewPage token={token} domain={selectedDomain} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Job settu · Built for learners.</p>
      </footer>

      {/* AI Placement Chatbot - Passed token for instant visibility update */}
      <GeminiPlacementChatbot token={token} />
    </div>
  );
}

export default App;
