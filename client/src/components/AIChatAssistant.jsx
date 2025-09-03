import React, { useState, useRef, useEffect } from 'react';
import './AIChatAssistant.css';

function AIChatAssistant({ onClose }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: "Hi there! 👋 I'm your AI health companion. I can help you with nutrition tips, workout plans, wellness advice, and answer any health questions you have. What would you like to know?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isMinimized) {
            inputRef.current?.focus();
        }
    }, [isMinimized]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/gemini/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    context: `You are a specialized AI health assistant. You can ONLY answer questions related to:
                    - Health and wellness
                    - Nutrition and diet
                    - Exercise and fitness
                    - Mental health and stress
                    - Sleep and recovery
                    - Medical conditions (general advice only)
                    - Healthy lifestyle tips
                    
                    If someone asks about anything else (politics, technology, entertainment, etc.), politely redirect them back to health topics.
                    
                    Always provide evidence-based, helpful health advice. For serious medical concerns, recommend consulting healthcare professionals.
                    
                    Keep responses friendly, informative, and focused on health and wellness.`
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: data.response || "I'm sorry, I couldn't process your request. Please try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const quickQuestions = [
        "What should I eat for breakfast?",
        "How can I improve my sleep?",
        "What exercises should I do?",
        "How much water should I drink?"
    ];

    const handleQuickQuestion = (question) => {
        setInputMessage(question);
        setTimeout(() => sendMessage(), 100);
    };

    if (isMinimized) {
        return (
            <div className="ai-chat-minimized">
                <div className="minimized-header">
                    <div className="minimized-ai-info">
                        <div className="minimized-ai-avatar">🤖</div>
                        <span>AI Assistant</span>
                    </div>
                    <div className="minimized-controls">
                        <button
                            className="minimize-btn"
                            onClick={() => setIsMinimized(false)}
                        >
                            ↗
                        </button>
                        <button
                            className="close-mini-btn"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ai-chat-container">
            {/* Header */}
            <div className="ai-chat-header">
                <div className="ai-chat-title">
                    <div className="ai-avatar-large">🤖</div>
                    <div className="ai-title-text">
                        <h3>AI Health Assistant</h3>
                        <span className="ai-status-dot">●</span>
                        <span className="ai-status-text">Online</span>
                    </div>
                </div>
                <div className="ai-chat-controls">
                    <button
                        className="minimize-btn"
                        onClick={() => setIsMinimized(true)}
                        title="Minimize"
                    >
                        −
                    </button>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message-bubble ${message.type === 'user' ? 'user-bubble' : 'ai-bubble'}`}
                    >
                        {message.type === 'ai' && (
                            <div className="ai-avatar-small">🤖</div>
                        )}
                        <div className="message-content">
                            <div className="message-text">{message.content}</div>
                            <div className="message-time">{formatTime(message.timestamp)}</div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message-bubble ai-bubble">
                        <div className="ai-avatar-small">🤖</div>
                        <div className="message-content">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
                <div className="quick-questions">
                    <div className="quick-questions-title">Quick Questions:</div>
                    <div className="quick-questions-grid">
                        {quickQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="quick-question-btn"
                                onClick={() => handleQuickQuestion(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="ai-chat-input">
                <div className="input-wrapper">
                    <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about health, nutrition, or fitness"
                        rows="1"
                        disabled={isLoading}
                        className="message-input"
                    />
                    <button
                        className="send-button"
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                    >
                        <span className="send-icon">➤</span>
                    </button>
                </div>
                <div className="input-hint">
                    Press Enter to send • Shift+Enter for new line
                </div>
            </div>
        </div>
    );
}

export default AIChatAssistant;
