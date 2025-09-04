import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import './HomeScreen.css';
import NutritionTracker from './NutritionTracker';
import Community from './community'; // Ensure file is capitalized if named Community.js
import Profile from './Profile';
import AIChatAssistant from './AIChatAssistant';
<<<<<<< Updated upstream
import WorkoutAnalyzer from './WorkoutAnalyzer';
=======
import CapybaraSprite from './CapybaraSprite';
import useCapybaraState from '../hooks/useCapybaraState';
>>>>>>> Stashed changes

function HomeScreen() {
    const { userData } = useUser();
    const [activeTab, setActiveTab] = useState('home');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [capybaraState, setCapybaraState] = useState('idle');
    const [showAIChat, setShowAIChat] = useState(false);
<<<<<<< Updated upstream
    const [weatherData, setWeatherData] = useState(null);
    const [weatherSuggestion, setWeatherSuggestion] = useState('');
=======
    
    // Capybara state and XP system
    const { 
        xpScore, 
        currentState, 
        achievements, 
        activityLog, 
        logActivity, 
        getContextState,
        dailyGoals,
        getHealthStatus 
    } = useCapybaraState();
>>>>>>> Stashed changes

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchWeatherData();
        return () => clearInterval(timer);
    }, []);

    const fetchWeatherData = async () => {
        try {
            const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key';
            const city = userData?.location || 'New York';
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
            );

            if (response.ok) {
                const data = await response.json();
                setWeatherData(data);
                generateWeatherSuggestion(data);
            } else {
                // Fallback weather data
                const fallbackData = {
                    weather: [{ main: 'Clear', description: 'clear sky' }],
                    main: { temp: 22, humidity: 65 },
                    wind: { speed: 5 }
                };
                setWeatherData(fallbackData);
                generateWeatherSuggestion(fallbackData);
            }
        } catch (error) {
            console.error('Weather API error:', error);
            const fallbackData = {
                weather: [{ main: 'Clear', description: 'clear sky' }],
                main: { temp: 22, humidity: 65 },
                wind: { speed: 5 }
            };
            setWeatherData(fallbackData);
            generateWeatherSuggestion(fallbackData);
        }
    };

    const generateWeatherSuggestion = (weather) => {
        const condition = weather.weather[0].main;
        const temp = weather.main.temp;
        const humidity = weather.main.humidity;

        let suggestion = '';

        if (condition === 'Rain' || condition === 'Snow' || temp < 10) {
            suggestion = 'Indoor activities like yoga, stretching, or meditation are perfect for today\'s weather!';
        } else if (condition === 'Clear' && temp >= 15 && temp <= 25) {
            suggestion = 'Perfect weather for outdoor activities! Try a walk, jog, or outdoor workout.';
        } else if (temp > 25) {
            suggestion = 'Stay hydrated! Light indoor exercises or early morning outdoor activities are recommended.';
        } else if (humidity > 70) {
            suggestion = 'High humidity today. Indoor workouts or swimming would be ideal!';
        } else {
            suggestion = 'Moderate weather - mix of indoor and outdoor activities would work well today.';
        }

        setWeatherSuggestion(suggestion);
    };

    const getWeatherIcon = (weather) => {
        const icons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Snow': '❄️',
            'Thunderstorm': '⛈️',
            'Drizzle': '🌦️',
            'Mist': '🌫️',
            'Fog': '🌫️'
        };
        return icons[weather] || '🌤️';
    };

    const formatTime = (date) =>
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Determine the best animation based on user's current state
    const getHomeCapybaraState = () => {
        // Calculate scores for each area
        const nutritionScore = (activityLog.meals.count / dailyGoals.meals) * 100;
        const activityScore = (activityLog.exercise.count / dailyGoals.exercise) * 100;
        const healthScore = (nutritionScore + activityScore + (activityLog.water.count / dailyGoals.water) * 100) / 3;

        // Priority logic: Health > Activity > Nutrition
        if (healthScore >= 80) {
            return 'celebrate'; // Health is excellent
        } else if (activityScore >= 70) {
            return 'walk'; // Activity is good
        } else if (nutritionScore >= 60) {
            return 'eat'; // Nutrition is decent
        } else {
            return 'idle'; // Default state
        }
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
                        <span className="weather-icon">
                            {weatherData ? getWeatherIcon(weatherData.weather[0].main) : '☀️'}
                        </span>
                        <span className="temperature">
                            {weatherData ? `${Math.round(weatherData.main.temp)}°C` : '22°C'}
                        </span>
                    </div>
                </div>

                <div className="weather-suggestion-card">
                    <div className="suggestion-header">
                        <span className="suggestion-icon">💡</span>
                        <span className="suggestion-title">Today's Weather Tip</span>
                    </div>
                    <p className="suggestion-text">{weatherSuggestion}</p>
                </div>

                <div className="quick-stats-card">
                    <div className="quick-stats-title">Today's Progress</div>
                    <div className="stat-item">
                        <span className="stat-label">💧 Water</span>
                        <span className="stat-value">{activityLog.water.count}/{dailyGoals.water}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">🚶 Exercise</span>
                        <span className="stat-value">{activityLog.exercise.count}/{dailyGoals.exercise}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">😴 Sleep</span>
                        <span className="stat-value">{activityLog.sleep.hours}h/{dailyGoals.sleep}h</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">🥗 Meals</span>
                        <span className="stat-value">{activityLog.meals.count}/{dailyGoals.meals}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">⭐ XP Score</span>
                        <span className="stat-value">{xpScore}/100</span>
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
            </div>

            {/* Center Content - Capybara */}
            <div className="center-content">
                <div className="capybara-stage">
                    <CapybaraSprite
                        currentState={getHomeCapybaraState()}
                        size={150}
                        context="home"
                        showDescription={true}
                        className="main-capybara"
                        activityLog={activityLog}
                        xpScore={xpScore}
                    />
                    
                    {/* XP and Health Status */}
                    <div className="xp-display">
                        <div className="xp-bar">
                            <div className="xp-fill" style={{ width: `${xpScore}%` }}></div>
                        </div>
                        <span className="xp-text">XP: {xpScore}/100 ({getHealthStatus()})</span>
                    </div>
                    
                    {achievements.length > 0 && (
                        <div className="achievement-notification">
                            <span className="achievement-icon">🎉</span>
                            <span className="achievement-text">
                                Goals completed: {achievements.join(', ')}!
                            </span>
                        </div>
                    )}
                    
                    <div className="interaction-buttons">
                        <button 
                            className="interact-btn feed-btn" 
                            onClick={() => logActivity('meals')}
                        >
                            🥕 Feed
                        </button>
                        <button 
                            className="interact-btn exercise-btn" 
                            onClick={() => logActivity('exercise')}
                        >
                            🚶 Exercise
                        </button>
                        <button 
                            className="interact-btn water-btn" 
                            onClick={() => logActivity('water')}
                        >
                            💧 Water
                        </button>
                        <button 
                            className="interact-btn sleep-btn" 
                            onClick={() => logActivity('sleep', 8)}
                        >
                            😴 Sleep
                        </button>
                    </div>
                </div>

                {/* AI Chat Button - Integrated */}
                <div className="ai-chat-integrated">
                    <button
                        className="ai-chat-button-integrated"
                        onClick={() => setShowAIChat(true)}
                    >
                        <div className="ai-button-content-integrated">
                            <div className="ai-button-icon-integrated">🤖</div>
                            <div className="ai-button-text-integrated">
                                <span className="ai-button-title-integrated">AI Health Assistant</span>
                                <span className="ai-button-subtitle-integrated">Get personalized health advice</span>
                            </div>
                        </div>
                        <div className="ai-button-arrow-integrated">→</div>
                    </button>
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
                <CapybaraSprite
                    currentState="eat"
                    size={120}
                    context="nutrition"
                    showDescription={true}
                    className="tab-capybara"
                    activityLog={activityLog}
                    xpScore={xpScore}
                />
            </div>
            <NutritionTracker />
        </div>
    );

    // Activity Tab
    const renderActivityContent = () => (
        <div className="tab-content activity-tab">
<<<<<<< Updated upstream
            <WorkoutAnalyzer />
=======
            <div className="tab-header">
                <h2>🏃 Activity Hub</h2>
                <p>Monitor your physical activity and fitness progress</p>
                <CapybaraSprite
                    currentState="walk"
                    size={120}
                    context="activity"
                    showDescription={true}
                    className="tab-capybara"
                    activityLog={activityLog}
                    xpScore={xpScore}
                />
            </div>
            <div className="activity-content">
                <div className="activity-stats">
                    <h3>Today's Activity</h3>
                    <div className="activity-grid">
                        <div className="activity-card">
                            <span className="activity-icon">🚶</span>
                            <span className="activity-label">Exercise Sessions</span>
                            <span className="activity-value">{activityLog.exercise.count}/{dailyGoals.exercise}</span>
                        </div>
                        <div className="activity-card">
                            <span className="activity-icon">⭐</span>
                            <span className="activity-label">Activity XP</span>
                            <span className="activity-value">{Math.round((activityLog.exercise.count / dailyGoals.exercise) * 30)}/30</span>
                        </div>
                    </div>
                    <button 
                        className="log-exercise-btn"
                        onClick={() => logActivity('exercise')}
                    >
                        🏃 Log Exercise Session
                    </button>
                </div>
            </div>
>>>>>>> Stashed changes
        </div>
    );

    // Health Tab
    const renderHealthContent = () => (
        <div className="tab-content health-tab">
            <div className="tab-header">
                <h2>❤️ Health Monitor</h2>
                <p>Monitor your vital signs and health metrics</p>
                <CapybaraSprite
                    currentState="celebrate"
                    size={120}
                    context="health"
                    showDescription={true}
                    className="tab-capybara"
                    activityLog={activityLog}
                    xpScore={xpScore}
                />
            </div>
            <div className="health-content">
                <div className="health-overview">
                    <h3>Overall Health Status: {getHealthStatus()}</h3>
                    <div className="health-metrics">
                        <div className="health-metric">
                            <span className="metric-icon">⭐</span>
                            <span className="metric-label">XP Score</span>
                            <span className="metric-value">{xpScore}/100</span>
                        </div>
                        <div className="health-metric">
                            <span className="metric-icon">🍎</span>
                            <span className="metric-label">Nutrition</span>
                            <span className="metric-value">{activityLog.meals.count}/{dailyGoals.meals}</span>
                        </div>
                        <div className="health-metric">
                            <span className="metric-icon">💧</span>
                            <span className="metric-label">Hydration</span>
                            <span className="metric-value">{activityLog.water.count}/{dailyGoals.water}</span>
                        </div>
                        <div className="health-metric">
                            <span className="metric-icon">🏃</span>
                            <span className="metric-label">Exercise</span>
                            <span className="metric-value">{activityLog.exercise.count}/{dailyGoals.exercise}</span>
                        </div>
                        <div className="health-metric">
                            <span className="metric-icon">😴</span>
                            <span className="metric-label">Sleep</span>
                            <span className="metric-value">{activityLog.sleep.hours}h/{dailyGoals.sleep}h</span>
                        </div>
                    </div>
                </div>
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
                        <button
                            className="brand-logo-btn"
                            onClick={() => setActiveTab('home')}
                        >
                            <img src="/logo.png" alt="Aura Health Logo" className="brand-logo-img" />
                        </button>
                    </div>

                    <div className="nav-user">
                        <button
                            className={`community-btn ${activeTab === 'community' ? 'active' : ''}`}
                            onClick={() => setActiveTab('community')}
                        >
                            Community
                        </button>

                        <div className="user-profile">
                            <button
                                className="user-avatar-btn"
                                onClick={() => setActiveTab('profile')}
                            >
                                <div className="user-avatar">
                                    {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </button>
                            <div className="user-details">
                                <span className="user-name">
                                    {userData?.fullName || 'User'}
                                </span>
                                <span className="user-status">● Online</span>
                            </div>
                        </div>
                        <button className="notification-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
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
                    { id: 'home', label: 'Home' },
                    { id: 'nutrition', label: 'Nutrition' },
                    { id: 'activity', label: 'Activity' },
                    { id: 'health', label: 'Health' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}

export default HomeScreen;


