import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import './HomeScreen.css';
import NutritionTracker from './NutritionTracker';
import Community from './community'; // Ensure file is capitalized if named Community.js
import Profile from './Profile';
import AIChatAssistant from './AIChatAssistant';

function HomeScreen() {
    const { userData } = useUser();
    const [activeTab, setActiveTab] = useState('home');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [capybaraMood, setCapybaraMood] = useState('happy');
    const [showAIChat, setShowAIChat] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Home Tab Content
    const renderHomeContent = () => (
        <div className="home-layout">
            {/* Left Sidebar */}
            <div className="left-sidebar">
                <div className="greeting-card">
                    <div className="greeting-text">
                        {getGreeting()}, {userData?.fullName ? userData.fullName.split(' ')[0] : 'Friend'}!
                    </div>
                    <div className="time-text">{formatTime(currentTime)}</div>
                    <div className="weather-widget">
                        <span className="weather-icon">☀️</span>
                        <span className="temperature">72°F</span>
                    </div>
                </div>

                <div className="quick-stats-card">
                    <div className="quick-stats-title">Today's Progress</div>
                    <div className="stat-item">
                        <span className="stat-label">💧 Water</span>
                        <span className="stat-value">6/8</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">🚶 Steps</span>
                        <span className="stat-value">4.5k</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">😴 Sleep</span>
                        <span className="stat-value">7.5h</span>
                    </div>
                </div>

                <div className="medicine-tracker-card">
                    <div className="medicine-tracker-header">
                        <h3>Medicine Streak 💊</h3>
                        <div className="streak-info">
                            <span className="current-streak">Current: 7 days</span>
                            <span className="longest-streak">Longest: 14 days</span>
                        </div>
                    </div>
                    
                    <div className="medicine-calendar">
                        {Array.from({ length: 30 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - i);
                            // Dummy pattern: Taken on all days except weekends and random 2 days
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            const skipDays = [5, 12]; // Randomly missed on 5th and 12th day
                            const taken = !isWeekend && !skipDays.includes(i);
                            
                            return (
                                <div 
                                    key={i} 
                                    className={`calendar-day ${taken ? 'taken' : 'missed'}`}
                                    title={`${date.toLocaleDateString()}: ${taken ? 'Taken' : 'Missed'}`}
                                >
                                    <span className="day-tooltip">
                                        {date.getDate()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="medicine-stats">
                        <div className="medicine-stat-item">
                            <span className="stat-label">This Month</span>
                            <span className="stat-value">22/30 days</span>
                        </div>
                        <div className="medicine-stat-item">
                            <span className="stat-label">Adherence</span>
                            <span className="stat-value">73%</span>
                        </div>
                    </div>

                    <div className="medicine-legend">
                        <div className="legend-item">
                            <div className="legend-color taken"></div>
                            <span>Taken</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color missed"></div>
                            <span>Missed</span>
                        </div>
                    </div>

                    <button className="mark-taken-btn">
                        Mark Today's Medicines as Taken ✓
                    </button>
                </div>

                {/* AI Assistant Card */}
                <div className="ai-assistant-card">
                    <div className="ai-card-header">
                        <div className="ai-icon">🤖</div>
                        <div className="ai-info">
                            <h4>AI Health Assistant</h4>
                            <p>Get personalized health advice</p>
                        </div>
                    </div>
                    <button
                        className="ai-chat-btn"
                        onClick={() => setShowAIChat(true)}
                    >
                        <span>💬 Start Chat</span>
                        <span className="ai-arrow">→</span>
                    </button>
                </div>
            </div>

            {/* Center Content - Capybara */}
            <div className="center-content">
                <div className="capybara-stage">
                    <div className="capybara-sprite">
                        <img src="/cappy.png" alt="Capybara" />
                    </div>
                    <div className="mood-indicator">
                        <span className="mood-emoji">
                            {capybaraMood === 'eating' ? '🥕' : capybaraMood === 'playing' ? '🎾' : capybaraMood === 'loved' ? '💝' : '😊'}
                        </span>
                        <span className="mood-text">
                            {capybaraMood === 'eating'
                                ? 'Eating happily!'
                                : capybaraMood === 'playing'
                                    ? 'Having fun!'
                                    : capybaraMood === 'loved'
                                        ? 'Feeling loved!'
                                        : 'Feeling Great!'}
                        </span>
                    </div>
                    <div className="interaction-buttons">
                        <button className="interact-btn feed-btn" onClick={() => setCapybaraMood('eating')}>
                            🥕 Feed
                        </button>
                        <button className="interact-btn play-btn" onClick={() => setCapybaraMood('playing')}>
                            🎾 Play
                        </button>
                        <button className="interact-btn pet-btn" onClick={() => setCapybaraMood('loved')}>
                            💝 Pet
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="right-sidebar">
                <div className="quick-actions-card">
                    <div className="quick-actions-title">Quick Actions</div>
                    <button className="action-button primary-action">➕ Log Meal</button>
                    <button className="action-button">💧 Add Water</button>
                    <button className="action-button">🏃 Exercise</button>
                    <button className="action-button">📊 Reports</button>
                </div>

                <div className="health-metrics-card">
                    <div className="metrics-title">Health Metrics</div>
                    <div className="metric-item">
                        <span className="metric-icon">💧</span>
                        <div className="metric-content">
                            <div className="metric-label">Hydration</div>
                            <div className="metric-value">75%</div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <span className="metric-icon">🥗</span>
                        <div className="metric-content">
                            <div className="metric-label">Nutrition</div>
                            <div className="metric-value">67%</div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <span className="metric-icon">🚶</span>
                        <div className="metric-content">
                            <div className="metric-label">Activity</div>
                            <div className="metric-value">60%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Nutrition Tab
    const renderNutritionContent = () => (
        <div className="tab-content nutrition-tab">
            <div className="tab-header">
                <h2>🍎 Nutrition Center</h2>
                <p>Track your daily nutrition and meal planning</p>
            </div>
            <NutritionTracker />
        </div>
    );

    // Activity Tab
    const renderActivityContent = () => (
        <div className="tab-content activity-tab">
            <div className="tab-header">
                <h2>🏃 Activity Hub</h2>
                <p>Monitor your physical activity and fitness progress</p>
            </div>
            <div className="coming-soon">
                <div className="coming-soon-icon">🏃</div>
                <h3>Activity Dashboard</h3>
                <p>Coming soon - Track your workouts, steps, and fitness goals with personalized insights</p>
            </div>
        </div>
    );

    // Health Tab
    const renderHealthContent = () => (
        <div className="tab-content health-tab">
            <div className="tab-header">
                <h2>❤️ Health Monitor</h2>
                <p>Monitor your vital signs and health metrics</p>
            </div>
            <div className="coming-soon">
                <div className="coming-soon-icon">❤️</div>
                <h3>Health Dashboard</h3>
                <p>Coming soon - Track your vital signs and health metrics with real-time monitoring</p>
            </div>
        </div>
    );

    // Profile Tab
    const renderProfileContent = () => (
        <div className="tab-content profile-tab">
            <Profile />
        </div>
    );

    // Community Tab
    const renderCommunityContent = () => (
        <div className="tab-content community-tab">
            <Community />
        </div>
    );

    // Tab Switcher
    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return renderHomeContent();
            case 'nutrition':
                return renderNutritionContent();
            case 'activity':
                return renderActivityContent();
            case 'health':
                return renderHealthContent();
            case 'profile':
                return renderProfileContent();
            case 'community':
                return renderCommunityContent();
            default:
                return renderHomeContent();
        }
    };

    return (
        <div className="home-screen-container">
            {/* AI Chat Assistant Modal */}
            {showAIChat && (
                <AIChatAssistant
                    onClose={() => setShowAIChat(false)}
                />
            )}

            {/* Top Navigation Bar */}
            <nav className="top-nav-bar">
                <div className="nav-content">
                    <div className="nav-brand">
                        <h1 className="brand-name">Aura Health</h1>
                    </div>

                    <div className="nav-user">
                        <button
                            className={`community-btn ${activeTab === 'community' ? 'active' : ''}`}
                            onClick={() => setActiveTab('community')}
                        >
                            🌍 Community
                        </button>

                        <div className="user-profile">
                            <div className="user-avatar">
                                {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{userData?.fullName || 'User'}</span>
                                <span className="user-status">● Online</span>
                            </div>
                        </div>
                        <button className="notification-btn">
                            <span>🔔</span>
                            <span className="notification-badge">3</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="main-content-area">{renderContent()}</main>

            {/* Bottom Tab Navigation */}
            <nav className="bottom-tab-nav">
                {[
                    { id: 'home', icon: '🏠', label: 'Home' },
                    { id: 'nutrition', icon: '🥗', label: 'Nutrition' },
                    { id: 'activity', icon: '🏃', label: 'Activity' },
                    { id: 'health', icon: '❤️', label: 'Health' },
                    { id: 'profile', icon: '👤', label: 'Profile' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}

export default HomeScreen;
