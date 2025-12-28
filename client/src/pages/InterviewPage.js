import React, { useState, useRef } from "react";
import CameraPreview from "../components/CameraPreview";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Browser speech synthesis helper
function speakQuestion(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (!text) return;

  // stop any previous speech
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-India";
  utter.rate = 1; // speed
  utter.pitch = 1; // tone
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

function InterviewPage({ token, domain }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [info, setInfo] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);


  const [qaList, setQaList] = useState([]);

  const [feedback, setFeedback] = useState(null);

  const recognitionRef = useRef(null);

  const MAX_QUESTIONS = 10;
  const getRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      setInfo("Answer captured from your voice.");
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setInfo("Could not capture voice. Please try again.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  const startRecording = () => {
    if (isRecording) return;

    const recognition = getRecognition();
    if (!recognition) {
      setInfo("Voice input is not supported in this browser.");
      return;
    }
    setInfo("Listening... speak your answer.");
    recognition.start();
  };

  const stopRecording = () => {
    const recognition = recognitionRef.current;
    if (recognition && isRecording) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const loadQuestion = async () => {
    try {

      if (question && answer) {
        setQaList((prev) => [
          ...prev,
          { question: question.text, answer },
        ]);
      }


      if (questionCount >= MAX_QUESTIONS) {
        setInfo(
          "Session complete. You answered all questions for this round. Generating feedback..."
        );


        const finalList = [...qaList];
        if (question && answer) {
          finalList.push({ question: question.text, answer });
        }


        await getFeedback(finalList);
        return;
      }

      setInfo("");

      const res = await fetch(`${API_URL}/api/ai/next-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          domain,
          lastQuestion: question?.text || "",
          lastAnswer: answer || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setInfo(data.message || "AI could not generate a question.");
        setQuestion(null);
        return;
      }

      const nextQ = data.questionText;
      setQuestion({ text: nextQ });
      setAnswer("");
      setQuestionCount((c) => c + 1);
      speakQuestion(nextQ);
    } catch (err) {
      console.error("AI question load error:", err);
      setInfo("Unable to contact AI. Please try again.");
    }
  };


  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    setInfo(
      "Answer submitted. AI feedback and scoring will be added in the next step."
    );


    setTimeout(() => {
      loadQuestion();
    }, 800);
  };


  const getFeedback = async (answersList) => {
    try {
      setInfo("Generating feedback for your session...");

      const finalList = answersList && answersList.length
        ? answersList
        : qaList;

      if (!finalList || finalList.length === 0) {
        setInfo("No answers to evaluate. Please answer at least one question.");
        return;
      }

      const res = await fetch(`${API_URL}/api/ai/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          domain,
          answers: finalList,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setInfo(data.message || "Could not generate feedback.");
        return;
      }

      setFeedback(data);
      setInfo("");
    } catch (err) {
      console.error("Feedback error:", err);
      setInfo("Unable to generate feedback. Please try again.");
    }
  };

  return (
    <div className="practice-layout">
      {/* LEFT: AI interview section */}
      <div className="practice-left">
        <h2 className="interview-title">AI Mock Interview</h2>
        {domain && (
          <p className="interview-domain">
            Domain: <span>{domain}</span>
          </p>
        )}

        <p className="interview-subtext">
          Click &quot;Start mock interview&quot; to get a domain‑specific
          question, then practice your answer.
        </p>

        <p className="interview-subtext">
          Question {questionCount + (question ? 0 : 1)} of {MAX_QUESTIONS}
        </p>

        <button className="btn-primary" onClick={loadQuestion}>
          {question ? "Next question" : "Start mock interview"}
        </button>




        {question && (
          <div className="question-block">
            <div className="question-header-row">
              <p className="question-label">Question</p>
              <button
                type="button"
                className="small-link-btn"
                onClick={() => speakQuestion(question.text)}
              >
                Repeat question
              </button>
            </div>

            <p className="question-text">{question.text}</p>

            <form onSubmit={handleSubmitAnswer} className="answer-form">
              <p className="answer-label">Your answer</p>

              <div className="answer-display">
                {answer ? (
                  <p>{answer}</p>
                ) : (
                  <p className="answer-placeholder">
                    Your spoken / typed answer will appear here...
                  </p>
                )}
              </div>

              <div className="answer-controls">
                <button
                  type="button"
                  className="btn-primary answer-record-btn"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? "Stop recording" : "Record answer"}
                </button>
              </div>

              {/* optional hidden input – testing kosam matrame */}
              <input
                className="hidden-text-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type here while testing..."
              />

              <button
                type="submit"
                className="btn-outline answer-submit-btn"
              >
                Submit answer
              </button>
            </form>
          </div>
        )}

        {/* Feedback card */}
        {feedback && (
          <div className="feedback-card">
            <h3 className="feedback-title">
              Session feedback · Score {feedback.score}/10
            </h3>
            {feedback.summary && (
              <p className="feedback-summary">{feedback.summary}</p>
            )}

            <div className="feedback-columns">
              <div className="feedback-column">
                <h4>What you did well</h4>
                <ul>
                  {feedback.strengths &&
                    feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="feedback-column">
                <h4>How to improve</h4>
                <ul>
                  {feedback.improvements &&
                    feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {info && <p className="info-text">{info}</p>}
      </div>

      {/* RIGHT: Camera preview */}
      <div className="practice-right">
        <CameraPreview />
      </div>
    </div>
  );
}

export default InterviewPage;
