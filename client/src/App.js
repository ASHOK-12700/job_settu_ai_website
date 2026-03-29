import React, { useState } from "react";
import AuthPage from "./pages/AuthPage";
import InterviewPage from "./pages/InterviewPage";
import GrammarQuizPage from "./pages/GrammarQuizPage";
import DomainSelector from "./components/DomainSelector";
import ResumeSection from "./components/ResumeSection";
import HRAssistant from "./components/HRAssistant";
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
    </div>
  );
}

function App() {
  // Initialize state from localStorage so login persists on refresh
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedDomain, setSelectedDomain] = useState("");
  // views: 'auth' | 'home' | 'grammar' | 'domain' | 'interview' | 'resume' | 'hr-assistant'
  const [view, setView] = useState(token ? "hr-assistant" : "auth");

  const handleLogin = (t) => {
    localStorage.setItem("token", t); // Save to storage
    setToken(t);
    setView("hr-assistant");
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
            src="https://i.postimg.cc/658R7Dyy/Screenshot-20251229-124141-2.png"
            alt="VCUBE POLICY GUARD AI Logo"
            className="navbar-logo-img"
            style={{ borderRadius: '4px', height: '48px' }}
          />
          <span className="logo-mark" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
            <i>V</i>
          </span>
          <span className="logo-text">
            VCUBE POLICY GUARD AI
          </span>
        </div>

        <nav className="navbar-links">
          {token && (
            <>
              {/* HR AI Assistant Button (Primary) */}
              <button
                className={`nav-link ${view === "hr-assistant" ? "nav-link-active" : ""}`}
                onClick={() => setView("hr-assistant")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: view === "hr-assistant" ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: view === "hr-assistant" ? '#818cf8' : 'inherit'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                HR AI Assistant
              </button>

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
          <HomePage onStartPractice={() => {
            setSelectedDomain("");
            setView("domain");
          }} />
        )}

        {/* HR AI Assistant - Main Page */}
        {token && view === "hr-assistant" && <HRAssistant />}

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
        <p>© {new Date().getFullYear()} VCUBE POLICY GUARD AI · Enterprise Security.</p>
      </footer>
    </div>
  );
}

export default App;
