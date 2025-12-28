import React, { useState, useEffect, useRef } from "react";
import "./GeminiPlacementChatbot.css";

const GeminiPlacementChatbot = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your personal Assistant. How can I help you proceed in your career today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Check authentication from prop OR localStorage
    // The prop ensures instant update on login/logout from parent
    const storedToken = localStorage.getItem("token");
    setIsAuthenticated(!!token || !!storedToken);
  }, [token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    const userMsgObj = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsgObj]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/gemini-placement-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: [...messages, userMsgObj].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      } else {
        const errorMessage =
          data.message || "I encountered an issue. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorMessage,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error FULL OBJECT:", error);
      let errorMessage = "Connection error. Please check your network.";
      if (error.message?.includes("timeout")) {
        errorMessage = "Request timed out.";
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // If not authenticated, do not render anything
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Launcher */}
      <div className="chatbot-launcher">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`chatbot-launcher-btn ${isOpen ? 'is-open' : 'is-closed'}`}
        >
          {isOpen ? (
            <span style={{ fontSize: "28px", color: "#4f46e5", height: "fit-content" }}>✕</span>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#4f46e5" }}>
              {/* Elegant Chat/Sparkle Icon */}
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Main Chat Interface */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div>
              <h3 className="chatbot-title">
                Assistant
              </h3>
              <p className="chatbot-status">
                Online
              </p>
            </div>
            <div className="status-indicator"></div>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="messages-container glass-scroll"
          >
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div key={index} className={`message-wrapper ${isUser ? 'user' : 'bot'}`}>
                  <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
                    {msg.content}
                    <div className={`message-time ${isUser ? 'user' : 'bot'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="typing-indicator-container">
                <div className="typing-bubble">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="input-field"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className={`send-btn ${(!isLoading && inputMessage.trim()) ? 'active' : 'disabled'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiPlacementChatbot;
