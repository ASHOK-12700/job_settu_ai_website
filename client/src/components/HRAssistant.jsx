import React, { useState, useEffect, useRef } from 'react';
import './HRAssistant.css';

const HRAssistant = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am your Enterprise HR Assistant. Ask me about company policies, leave, or benefits.',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userQuery = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        // Add user message
        setMessages(prev => [...prev, {
            role: 'user',
            content: userQuery,
            timestamp: new Date()
        }]);

        try {
            const response = await fetch('http://localhost:8001/api/hr/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userQuery }),
            });

            if (!response.ok) {
                throw new Error('Backend unreachable');
            }

            const data = await response.json();

            let botResponse = data.answer;

            // Handle refusals nicely
            if (data.refused) {
                if (data.reason === 'action_request') {
                    botResponse = "⚠️ I cannot perform actions like approving requests. I can only explain policies.";
                } else if (data.reason === 'insufficient_policy_data') {
                    botResponse = "I couldn't find specific information about that in the company policies.";
                }
            }

            // Add bot message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: botResponse,
                sources: data.sources,
                timestamp: new Date()
            }]);

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "⚠️ Sorry, I'm having trouble connecting to the HR Policy Service (Port 8001). Please ensure the backend is running.",
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="ai-assistant-main" className="hr-assistant-section">
            <div className="hr-banner-gradient">
                <h1>HR AI Assistant – Ask, Practice, Get Hired</h1>
            </div>
            
            <div className="hr-full-chat-container">
                <div className="hr-chat-header">
                    <div className="hr-avatar-circle">
                        <span>AI</span>
                    </div>
                    <div>
                        <h2>HR AI Assistant – Ask, Practice, Get Hired</h2>
                        <p className="status-text">● Online</p>
                    </div>
                </div>

            <div className="hr-chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`hr-message-row ${msg.role === 'user' ? 'hr-user-row' : 'hr-bot-row'}`}>
                        <div className={`hr-message-bubble ${msg.role === 'user' ? 'hr-user-bubble' : 'hr-bot-bubble'}`}>
                            {msg.content}

                            {msg.sources && msg.sources.length > 0 && (
                                <div className="hr-sources-list">
                                    <small>Sources:</small>
                                    {msg.sources.map((s, i) => (
                                        <span key={i} className="hr-source-tag">{s.title}</span>
                                    ))}
                                </div>
                            )}

                            <div className="hr-time">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="hr-message-row hr-bot-row">
                        <div className="hr-message-bubble hr-bot-bubble typing">
                            <span>•</span><span>•</span><span>•</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="hr-chat-input-area" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Type your question about HR policies..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" disabled={!inputMessage.trim() || isLoading}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
        </section>
    );
};

export default HRAssistant;
