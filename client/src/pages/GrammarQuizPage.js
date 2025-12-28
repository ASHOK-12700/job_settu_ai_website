import React, { useState } from "react";
import "./GrammarQuizPage.css";
import VocabularyQuiz from "../components/VocabularyQuiz";

const QUESTIONS = [
  {
    text: "I ___ a student.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    level: "A1",
  },
  {
    text: "She ___ to the gym every day.",
    options: ["go", "goes", "going", "gone"],
    correct: 1,
    level: "A1",
  },
  {
    text: "They ___ English very well.",
    options: ["speaks", "speak", "speaking", "spoken"],
    correct: 1,
    level: "A2",
  },
  {
    text: "We ___ to Hyderabad last week.",
    options: ["go", "goes", "went", "gone"],
    correct: 2,
    level: "A2",
  },
  {
    text: "If it rains, we ___ at home.",
    options: ["will stay", "stayed", "stays", "are stay"],
    correct: 0,
    level: "B1",
  },
  {
    text: "This is the book ___ I told you about.",
    options: ["who", "which", "what", "where"],
    correct: 1,
    level: "B1",
  },
  {
    text: "She has been working here ___ 2020.",
    options: ["for", "since", "from", "in"],
    correct: 1,
    level: "B2",
  },
  {
    text: "I wish I ___ more time to practice.",
    options: ["have", "had", "will have", "am having"],
    correct: 1,
    level: "B2",
  },
  {
    text: "The film was ___ than I expected.",
    options: ["interesting", "more interesting", "most interesting", "interest"],
    correct: 1,
    level: "B1",
  },
  {
    text: "By this time tomorrow, they ___ the project.",
    options: [
      "complete",
      "will complete",
      "will have completed",
      "have completed",
    ],
    correct: 2,
    level: "B2",
  },
  {
    text: "He asked me where I ___.",
    options: ["live", "lived", "am living", "have lived"],
    correct: 1,
    level: "B2",
  },
  {
    text: "There isn’t ___ sugar left in the jar.",
    options: ["many", "much", "few", "a few"],
    correct: 1,
    level: "A2",
  },
  {
    text: "She didn’t come, ___ was disappointing.",
    options: ["who", "which", "that", "what"],
    correct: 1,
    level: "B1",
  },
  {
    text: "He finished the test ___ than anyone else.",
    options: ["quick", "more quickly", "quicker", "most quickly"],
    correct: 2,
    level: "B1",
  },
  {
    text: "I’m not used to ___ in front of many people.",
    options: ["speak", "speaking", "spoke", "to speak"],
    correct: 1,
    level: "B2",
  },
];

function getLevelFromScore(score, total) {
  const percent = (score / total) * 100;

  if (percent < 40) return "A1 (Beginner)";
  if (percent < 60) return "A2 (Elementary)";
  if (percent < 80) return "B1 (Intermediate)";
  return "B2 (Upper‑intermediate)";
}

const GrammarQuizPage = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[index];

  const handleOptionClick = (i) => {
    setSelected(i);
  };

  const handleNext = () => {
    if (selected === null) return;

    if (selected === current.correct) {
      setScore((s) => s + 1);
    }

    if (index === QUESTIONS.length - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  // RENDER UPDATED UI
  return (
    <div className="grammar-page-container">
      {/* 1. HERO HEADER (User Requested) */}
      {/* 2. GRAMMAR QUIZ CARD */}
      <div className="grammar-quiz-card">
        {finished ? (
          <div className="score-container">
            <h2 className="quiz-title" style={{ color: '#fff' }}>Assessment Complete</h2>
            <div className="score-display">
              {score} <span style={{ fontSize: '2rem', color: '#64748b' }}>/ {QUESTIONS.length}</span>
            </div>
            <p className="score-level">
              Level: {getLevelFromScore(score, QUESTIONS.length)}
            </p>
            <div style={{ marginBottom: '30px' }}>
              <span className="level-badge">Practice Mode</span>
            </div>
            <button className="grammar-next-btn" onClick={handleRestart}>
              Retake Assessment
            </button>
          </div>
        ) : (
          <>
            <div className="quiz-header-premium">
              <div className="grammar-header-title">
                <h3>Grammar Mastery</h3>
                <p className="grammar-header-subtitle">Complete the sentence</p>
              </div>
              <div className="quiz-progress-text">
                Question: {index + 1} / {QUESTIONS.length}
              </div>
            </div>

            <div className="grammar-content-wrapper">
              <h2 className="grammar-question">{current.text}</h2>

              <div className="grammar-options-grid">
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`grammar-option-btn ${selected === i ? "selected" : ""
                      }`}
                    onClick={() => handleOptionClick(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-footer">
              <button
                className="grammar-next-btn"
                onClick={handleNext}
                disabled={selected === null}
              >
                {index === QUESTIONS.length - 1 ? "Finish" : "Next Question"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3. VOCABULARY SECTION (Kept as is) */}
      <div style={{ marginTop: '60px' }}>
        <VocabularyQuiz />
      </div>
    </div>
  );
}

export default GrammarQuizPage;
