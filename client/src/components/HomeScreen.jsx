import React, { useState, useEffect } from 'react';
import './HomeScreen.css';

function HomeScreen({ userData, healthData }) {
    const [activeTab, setActiveTab] = useState('home');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [capybaraMood, setCapybaraMood] = useState('happy');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const renderHomeContent = () => (
        <div className="home-main">
            <div className="welcome-banner">
                <div className="greeting-section">
                    <h2>{getGreeting()}, {userData?.fullName?.split(' ')[0] || 'Friend'}! 🌅</h2>
                    <div className="time-info">
                        <div className="time-display">{formatTime(currentTime)}</div>
                        <div className="date-display">{formatDate(currentTime)}</div>
                    </div>
                </div>
                <div className="weather-widget">
                    <div className="weather-icon">☀️</div>
                    <div className="weather-info">
                        <div className="temperature">72°F</div>
                        <div className="weather-desc">Sunny</div>
                    </div>
                </div>
            </div>

            <div className="capybara-hub">
                <div className="capybara-stage">
                    <div className="stage-background">
                        <div className="grass-layer"></div>
                        <div className="water-pool"></div>
                        <div className="tree-shade"></div>
                    </div>
                    <div className="capybara-character">
                        <img
                            src="/cappy.png"
                            alt="Capybara Pet"
                            className={`capybara-sprite ${capybaraMood}`}
                        />
                        <div className="mood-indicator">
                            <span className="mood-emoji">😊</span>
                            <span className="mood-text">Feeling Great!</span>
                        </div>
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

            <div className="health-dashboard">
                <div className="dashboard-header">
                    <h3>Today's Wellness Journey</h3>
                    <div className="progress-overview">
                        <div className="progress-ring">
                            <svg width="60" height="60" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(169, 132, 103, 0.2)" strokeWidth="4" />
                                <circle cx="30" cy="30" r="25" fill="none" stroke="var(--olivine)" strokeWidth="4"
                                    strokeDasharray="157" strokeDashoffset="47" transform="rotate(-90 30 30)" />
                            </svg>
                            <span className="progress-text">70%</span>
                        </div>
                    </div>
                </div>

                <div className="metric-grid">
                    <div className="metric-card hydration">
                        <div className="metric-icon">💧</div>
                        <div className="metric-content">
                            <h4>Hydration</h4>
                            <div className="metric-value">6/8 glasses</div>
                            <div className="metric-bar">
                                <div className="bar-fill" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="metric-card nutrition">
                        <div className="metric-icon">🥗</div>
                        <div className="metric-content">
                            <h4>Nutrition</h4>
                            <div className="metric-value">2/3 meals</div>
                            <div className="metric-bar">
                                <div className="bar-fill" style={{ width: '67%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="metric-card activity">
                        <div className="metric-icon">🚶</div>
                        <div className="metric-content">
                            <h4>Activity</h4>
                            <div className="metric-value">4,500 steps</div>
                            <div className="metric-bar">
                                <div className="bar-fill" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="metric-card sleep">
                        <div className="metric-icon">😴</div>
                        <div className="metric-content">
                            <h4>Sleep</h4>
                            <div className="metric-value">7.5 hours</div>
                            <div className="metric-bar">
                                <div className="bar-fill" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="quick-actions-panel">
                <h3>Quick Actions</h3>
                <div className="action-grid">
                    <button className="action-card primary-action">
                        <div className="action-icon">➕</div>
                        <div className="action-label">Log Meal</div>
                    </button>
                    <button className="action-card secondary-action">
                        <div className="action-icon">💧</div>
                        <div className="action-label">Add Water</div>
                    </button>
                    <button className="action-card secondary-action">
                        <div className="action-icon">📝</div>
                        <div className="action-label">Track Exercise</div>
                    </button>
                    <button className="action-card secondary-action">
                        <div className="action-icon">📊</div>
                        <div className="action-label">View Reports</div>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderNutritionContent = () => (
        <div className="tab-content nutrition-tab">
            <div className="tab-header">
                <h2>🍎 Nutrition Center</h2>
                <p>Track your daily nutrition and meal planning</p>
            </div>
            <div className="coming-soon">
                <div className="coming-soon-icon">🥗</div>
                <h3>Nutrition Dashboard</h3>
                <p>Coming soon - Track your meals, calories, and nutrition goals with detailed analytics</p>
            </div>
        </div>
    );

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

    const renderProfileContent = () => (
        <div className="tab-content profile-tab">
            <div className="tab-header">
                <h2>👤 Profile & Settings</h2>
                <p>Manage your account and preferences</p>
            </div>
            <div className="coming-soon">
                <div className="coming-soon-icon">👤</div>
                <h3>Profile Dashboard</h3>
                <p>Coming soon - Manage your profile and app settings with advanced customization</p>
            </div>
        </div>
    );

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
            default:
                return renderHomeContent();
        }
    };

    return (
        <div className="home-screen-container">
            {/* Top Navigation Bar */}
            <nav className="top-nav-bar">
                <div className="nav-content">
                    <div className="nav-brand">
                        <div className="brand-logo">🦫</div>
                        <h1 className="brand-name">CapyCare</h1>
                    </div>

                    <div className="nav-user">
                        <div className="user-profile">
                            <div className="user-avatar">
                                <span className="avatar-initial">
                                    {userData?.fullName?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="user-details">
                                <span className="user-name">{userData?.fullName || 'User'}</span>
                                <span className="user-status">● Online</span>
                            </div>
                        </div>
                        <button className="notification-btn">
                            <span className="notification-icon">🔔</span>
                            <span className="notification-badge">3</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="main-content-area">
                {renderContent()}
            </main>

            {/* Bottom Tab Navigation */}
            <nav className="bottom-tab-nav">
                <button
                    className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    <span className="tab-icon">🏠</span>
                    <span className="tab-label">Home</span>
                </button>

                <button
                    className={`tab-item ${activeTab === 'nutrition' ? 'active' : ''}`}
                    onClick={() => setActiveTab('nutrition')}
                >
                    <span className="tab-icon">🥗</span>
                    <span className="tab-label">Nutrition</span>
                </button>

                <button
                    className={`tab-item ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                >
                    <span className="tab-icon">🏃</span>
                    <span className="tab-label">Activity</span>
                </button>

                <button
                    className={`tab-item ${activeTab === 'health' ? 'active' : ''}`}
                    onClick={() => setActiveTab('health')}
                >
                    <span className="tab-icon">❤️</span>
                    <span className="tab-label">Health</span>
                </button>

                <button
                    className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <span className="tab-icon">👤</span>
                    <span className="tab-label">Profile</span>
                </button>
            </nav>
        </div>
    );
}

export default HomeScreen;
