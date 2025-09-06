import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { API_ENDPOINTS } from '../config/api';
import './AIChatAssistant.css';

function AIChatAssistant({ onClose }) {
    const { userData } = useUser();
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: userData?.fullName
                ? `Hi ${userData.fullName}! 👋 I'm your personalized AI health assistant. I know your health profile and can provide tailored advice for your specific needs. What would you like to know?`
                : "Hi! 👋 I'm your AI health assistant. I can help with quick nutrition tips, exercise advice, and wellness questions. What would you like to know?",
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

    // Function to build personalized context based on user data
    const buildPersonalizedContext = () => {
        if (!userData) {
            return `You are a specialized AI health assistant. Provide CONCISE, TO-THE-POINT health advice in 2-3 sentences maximum. Focus on:
            - Quick, actionable health tips
            - Brief nutrition advice
            - Simple exercise suggestions
            - Short wellness tips
            
            Keep responses friendly but brief. Avoid long explanations. If someone asks about non-health topics, politely redirect to health.
            
            For serious medical concerns, recommend consulting healthcare professionals.
            
            Format: Give direct, brief answers with 1-2 key points only.`;
        }

        const healthData = userData.healthData || {};
        const personalInfo = {
            name: userData.fullName || 'User',
            age: healthData.age || 'unknown',
            gender: healthData.gender || 'unknown',
            weight: healthData.weight || 'unknown',
            height: healthData.height || 'unknown',
            activityLevel: healthData.activityLevel || 'unknown',
            dietaryRestrictions: healthData.dietaryRestrictions || [],
            healthGoals: healthData.healthGoals || [],
            medicalConditions: healthData.medicalConditions || [],
            allergies: healthData.allergies || [],
            medications: healthData.medications || [],
            fitnessLevel: healthData.fitnessLevel || 'unknown',
            sleepQuality: healthData.sleepQuality || 'unknown',
            stressLevel: healthData.stressLevel || 'unknown',
            smokingStatus: healthData.smokingStatus || 'unknown',
            alcoholConsumption: healthData.alcoholConsumption || 'unknown',
            familyHistory: healthData.familyHistory || [],
            emergencyContact: healthData.emergencyContact || {}
        };

        return `You are a specialized AI health assistant for ${personalInfo.name}. Provide CONCISE, TO-THE-POINT health advice in 2-3 sentences maximum.

        USER PROFILE:
        - Age: ${personalInfo.age}
        - Gender: ${personalInfo.gender}
        - Weight: ${personalInfo.weight} kg
        - Height: ${personalInfo.height} cm
        - Activity Level: ${personalInfo.activityLevel}
        - Fitness Level: ${personalInfo.fitnessLevel}
        - Sleep Quality: ${personalInfo.sleepQuality}
        - Stress Level: ${personalInfo.stressLevel}
        - Smoking: ${personalInfo.smokingStatus}
        - Alcohol: ${personalInfo.alcoholConsumption}

        DIETARY PREFERENCES:
        - Restrictions: ${personalInfo.dietaryRestrictions.join(', ') || 'None'}
        - Allergies: ${personalInfo.allergies.join(', ') || 'None'}

        HEALTH GOALS:
        - ${personalInfo.healthGoals.join(', ') || 'General wellness'}

        MEDICAL CONSIDERATIONS:
        - Conditions: ${personalInfo.medicalConditions.join(', ') || 'None'}
        - Medications: ${personalInfo.medications.join(', ') || 'None'}
        - Family History: ${personalInfo.familyHistory.join(', ') || 'None'}

        INSTRUCTIONS:
        - Use this personal health data to provide tailored, relevant advice
        - Consider their specific health goals, restrictions, and conditions
        - Keep responses brief (2-3 sentences max) and actionable
        - Focus on their specific needs based on their profile
        - For serious medical concerns, recommend consulting healthcare professionals
        - Be encouraging and supportive while being practical

        Format: Give personalized, direct answers that consider their specific health profile.`;
    };

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
            const response = await fetch(API_ENDPOINTS.GEMINI_CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    context: buildPersonalizedContext()
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
        userData?.healthData?.healthGoals?.includes('Weight Loss') ? "Weight loss tips for me?" : "Quick breakfast ideas?",
        userData?.healthData?.sleepQuality === 'Poor' ? "How to improve my sleep?" : "How to sleep better?",
        userData?.healthData?.fitnessLevel === 'Beginner' ? "Simple exercises for beginners?" : "Simple exercises?",
        userData?.healthData?.healthGoals?.includes('Muscle Building') ? "Protein-rich meal ideas?" : "Daily water intake?"
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
