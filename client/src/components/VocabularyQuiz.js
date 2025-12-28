import React, { useState, useEffect } from "react";
import "./VocabularyQuiz.css";

// A large pool of vocabulary words (Intermediate to Advanced)
// Logic: Component will pick 5 random words from this list every time it mounts or restarts.
const VOCAB_POOL = [
    { word: "Serendipity", options: ["Bad luck", "Happy accident", "Planned event", "Sorrow"], correct: 1 },
    { word: "Ephemeral", options: ["Lasting forever", "Short-lived", "Heavy", "Bright"], correct: 1 },
    { word: "Obfuscate", options: ["To clarify", "To confuse", "To build", "To destroy"], correct: 1 },
    { word: "Resilient", options: ["Weak", "Flexible", "Recovering quickly", "Rigid"], correct: 2 },
    { word: "Ubiquitous", options: ["Rare", "Everywhere", "Unique", "Hidden"], correct: 1 },
    { word: "Cacophony", options: ["Harmony", "Harsh noise", "Silence", "Melody"], correct: 1 },
    { word: "Meticulous", options: ["Careless", "Very careful", "Fast", "Lazy"], correct: 1 },
    { word: "Pragmatic", options: ["Dreamy", "Practical", "Theoretical", "Emotional"], correct: 1 },
    { word: "Benevolent", options: ["Cruel", "Kind", "Neutral", "Angry"], correct: 1 },
    { word: "Eloquent", options: ["Silent", "Fluent & expressive", "Confused", "Rude"], correct: 1 },
    { word: "Lethargic", options: ["Energetic", "Sluggish", "Happy", "Angry"], correct: 1 },
    { word: "Nostalgia", options: ["Fear of future", "Longing for past", "Anger at present", "Joy of now"], correct: 1 },
    { word: "Paradox", options: ["Simple truth", "Contradiction", "Lie", "Story"], correct: 1 },
    { word: "Quintessential", options: ["Worst example", "Typical example", "Rare case", "Fake copy"], correct: 1 },
    { word: "Stoic", options: ["Emotional", "Indifferent to pain", "Excited", "Weak"], correct: 1 },
    { word: "Vivid", options: ["Dull", "Bright & clear", "Dark", "Blurry"], correct: 1 },
    { word: "Zealous", options: ["Bored", "Passionate", "Tired", "Calm"], correct: 1 },
    { word: "Alleviate", options: ["To worsen", "To lessen", "To ignore", "To create"], correct: 1 },
    { word: "Candid", options: ["Secretive", "Honest", "Planned", "Fake"], correct: 1 },
    { word: "Dubious", options: ["Certain", "Doubtful", "Happy", "Sad"], correct: 1 },
    { word: "Enigma", options: ["Clear answer", "Mystery", "Friend", "Enemy"], correct: 1 },
    { word: "Frugal", options: ["Wasteful", "Thrifty", "Rich", "Poor"], correct: 1 },
    { word: "Gregarious", options: ["Shy", "Sociable", "Angry", "Sad"], correct: 1 },
    { word: "Impeccable", options: ["Flawed", "Flawless", "Dirty", "Broken"], correct: 1 },
    { word: "Lucid", options: ["Confused", "Clear", "Dark", "Cloudy"], correct: 1 },
    { word: "Maverick", options: ["Follower", "Independent", "Leader", "Coward"], correct: 1 },
    { word: "Nuance", options: ["Obvious fact", "Subtle difference", "Loud noise", "Big change"], correct: 1 },
    { word: "Opulent", options: ["Poor", "Luxurious", "Simple", "Ugly"], correct: 1 },
    { word: "Perseverance", options: ["Giving up", "Persistence", "Laziness", "Speed"], correct: 1 },
    { word: "Quaint", options: ["Modern", "Old-fashioned charm", "Ugly", "Dangerous"], correct: 1 }
];

const QUESTIONS_PER_ROUND = 5;

const VocabularyQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null); // Reviewing answer state
    const [isAnimating, setIsAnimating] = useState(false);

    // Initialize randomized quiz
    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        // Fischer-Yates Shuffle
        const shuffled = [...VOCAB_POOL];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setQuestions(shuffled.slice(0, QUESTIONS_PER_ROUND));
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
        setSelectedOption(null);
    };

    const handleOptionClick = (optionIndex) => {
        if (selectedOption !== null || isAnimating) return; // Prevent double clicks

        setSelectedOption(optionIndex);
        const isCorrect = optionIndex === questions[currentIndex].correct;

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        // Wait a brief moment to show green/red feedback, then move on
        setIsAnimating(true);
        setTimeout(() => {
            if (currentIndex < QUESTIONS_PER_ROUND - 1) {
                setCurrentIndex((prev) => prev + 1);
                setSelectedOption(null);
                setIsAnimating(false);
            } else {
                setIsFinished(true);
                setIsAnimating(false);
            }
        }, 1000);
    };

    if (questions.length === 0) return null; // Loading state

    if (isFinished) {
        return (
            <div className="vocab-section">
                <div className="vocab-card">
                    <div className="vocab-header">
                        <div className="vocab-title">
                            <h3>Vocabulary Challenge</h3>
                            <p className="vocab-subtitle">Round Complete</p>
                        </div>
                    </div>
                    <div className="vocab-result">
                        <span className="result-emoji">
                            {score === QUESTIONS_PER_ROUND ? "🏆" : score >= 3 ? "👏" : "📚"}
                        </span>
                        <h2 className="result-title">You scored {score} / {QUESTIONS_PER_ROUND}</h2>
                        <p className="result-text">
                            {score === QUESTIONS_PER_ROUND
                                ? "Perfect! You're a word wizard."
                                : "Great practice! Keep building your lexicon."}
                        </p>
                        <button className="vocab-restart-btn" onClick={startNewRound}>
                            Play New Round
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="vocab-section">
            <div className="vocab-card">
                {/* Header */}
                <div className="vocab-header">
                    <div className="vocab-title">
                        <h3>Vocabulary Puzzle Challenge</h3>
                        <p className="vocab-subtitle">Complete the word puzzle</p>
                    </div>
                    <div className="vocab-score-pill">
                        Puzzle: {currentIndex + 1} / {QUESTIONS_PER_ROUND}
                    </div>
                </div>

                {/* Content */}
                <div className="vocab-content">
                    <div className="vocab-word-label">DEFINITION FOR:</div>
                    <h1 className="vocab-word">{currentQ.word}</h1>

                    <div className="vocab-options">
                        {currentQ.options.map((opt, idx) => {
                            let btnClass = "vocab-option-btn";
                            if (selectedOption !== null) {
                                if (idx === currentQ.correct) btnClass += " correct";
                                if (idx === selectedOption && idx !== currentQ.correct) btnClass += " wrong";
                            }

                            return (
                                <button
                                    key={idx}
                                    className={btnClass}
                                    onClick={() => handleOptionClick(idx)}
                                    disabled={selectedOption !== null}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VocabularyQuiz;
