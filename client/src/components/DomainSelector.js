import React from "react";

const DOMAINS = [
  "Full Stack MERN",
  "Full Stack Java",
  "Backend (Node.js)",
  "Backend (Java Spring)",
  "Frontend (React)",
  "Data Science / ML",
  "Data Analyst",
  "DevOps Engineer",
  "Cloud Engineer (AWS)",
  "Android Developer",
  "Flutter / Mobile Developer",
  "Database Engineer (SQL / MongoDB)",
  "Cybersecurity Engineer",
  "QA / Automation Tester",
  "AI Engineer / LLM",
  "Product Manager",
  "Business Analyst",
  "System Design / Architect",
  "UI / UX Designer",
  "Customer Support / Service Role",
];

function DomainSelector({ selectedDomain, onSelect, onBack }) {
  return (
    <div className="domain-page">
      <div className="domain-header">
        <button className="back-link" onClick={onBack}>
          ← Back
        </button>
        <h2>Select your interview domain</h2>
        <p>
          Choose the role you are preparing for. The AI will tailor questions
          to this domain.
        </p>
      </div>

      <div className="domain-grid">
        {DOMAINS.map((d) => (
          <button
            key={d}
            className={
              "domain-card" + (selectedDomain === d ? " domain-card-active" : "")
            }
            onClick={() => onSelect(d)}
          >
            <span className="domain-name">{d}</span>
            <span className="domain-tag">Practice</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DomainSelector;
