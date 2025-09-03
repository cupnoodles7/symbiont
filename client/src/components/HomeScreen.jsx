import React, { useState, useEffect } from 'react';

function CappyHappyRedesign() {
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

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };





    const renderHomeContent = () => (
        <div className="home-layout">
            {/* Left Sidebar */}
            <div className="left-sidebar">
                <div className="greeting-card">
                    <div className="greeting-text">{getGreeting()}, Friend!</div>
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
            </div>

            {/* Center Content - Capybara */}
            <div className="center-content">
                <div className="capybara-stage">
                    <div className="capybara-sprite">
                        <img src="/cappy.png" alt="Capybara" />
                    </div>
                    <div className="mood-indicator">
                        <span className="mood-emoji">😊</span>
                        <span className="mood-text">Feeling Great!</span>
                    </div>
                    <div className="interaction-buttons">
                        <button
                            className="interact-btn feed-btn"
                            onClick={() => setCapybaraMood('eating')}
                        >
                            🥕 Feed
                        </button>
                        <button
                            className="interact-btn play-btn"
                            onClick={() => setCapybaraMood('playing')}
                        >
                            🎾 Play
                        </button>
                        <button
                            className="interact-btn pet-btn"
                            onClick={() => setCapybaraMood('loved')}
                        >
                            💝 Pet
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="right-sidebar">
                <div className="quick-actions-card">
                    <div className="quick-actions-title">Quick Actions</div>
                    <button
                        className="action-button primary-action"
                    >
                        ➕ Log Meal
                    </button>
                    <button
                        className="action-button"
                    >
                        💧 Add Water
                    </button>
                    <button
                        className="action-button"
                    >
                        🏃 Exercise
                    </button>
                    <button
                        className="action-button"
                    >
                        📊 Reports
                    </button>
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

    const renderTabContent = (tabName, icon, title, description) => (
        <div className="capybara-stage coming-soon">
            <div className="coming-soon-icon">{icon}</div>
            <h2 className="coming-soon-title">{title}</h2>
            <p className="coming-soon-description">{description}</p>
            <div className="coming-soon-construction">🚧</div>
            <h3 className="coming-soon-heading">Coming Soon</h3>
            <p className="coming-soon-message">This feature is under development and will be available soon!</p>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return renderHomeContent();
            case 'nutrition':
                return renderTabContent('nutrition', '🍎', 'Nutrition Center', 'Track your daily nutrition and meal planning');
            case 'activity':
                return renderTabContent('activity', '🏃', 'Activity Hub', 'Monitor your physical activity and fitness progress');
            case 'health':
                return renderTabContent('health', '❤️', 'Health Monitor', 'Monitor your vital signs and health metrics');
            case 'profile':
                return renderTabContent('profile', '👤', 'Profile & Settings', 'Manage your account and preferences');
            default:
                return renderHomeContent();
        }
    };

    return (
        <div className="home-container">
            {/* Top Navigation Bar */}
            <nav className="top-nav">
                <div className="nav-content">
                    <h1 className="brand-name">Cappy-Happy</h1>
                    <div className="nav-user">
                        <div className="user-profile">
                            <div className="user-avatar">U</div>
                            <div className="user-details">
                                <span className="user-name">User</span>
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
            <main className="main-content">
                {renderContent()}
            </main>

            {/* Bottom Tab Navigation */}
            <nav className="bottom-nav">
                {[
                    { id: 'home', icon: '🏠', label: 'Home' },
                    { id: 'nutrition', icon: '🥗', label: 'Nutrition' },
                    { id: 'activity', icon: '🏃', label: 'Activity' },
                    { id: 'health', icon: '❤️', label: 'Health' },
                    { id: 'profile', icon: '👤', label: 'Profile' }
                ].map(tab => (
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

export default CappyHappyRedesign;