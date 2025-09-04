import { useState, useEffect } from 'react';

const usePersonalizedMessages = (activityLog, xpScore, context) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');

    // Load message history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('capybara-message-history');
        if (savedHistory) {
            setMessageHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save message history to localStorage
    useEffect(() => {
        if (messageHistory.length > 0) {
            localStorage.setItem('capybara-message-history', JSON.stringify(messageHistory));
        }
    }, [messageHistory]);

    // Generate personalized messages based on context and activity history
    const generatePersonalizedMessage = (context, state, activityLog, xpScore) => {
        const now = new Date();
        const today = now.toDateString();
        const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Get recent achievements (last 7 days) from both messageHistory and localStorage
        const recentAchievements = messageHistory.filter(msg => {
            const msgDate = new Date(msg.timestamp);
            const daysDiff = (now - msgDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7 && msg.type === 'achievement';
        });

        // Also check localStorage for achievements
        const storedAchievements = JSON.parse(localStorage.getItem('capybara-achievements') || '[]');
        const recentStoredAchievements = storedAchievements.filter(achievement => {
            const achievementDate = new Date(achievement.timestamp);
            const daysDiff = (now - achievementDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        });

        const allRecentAchievements = [...recentAchievements, ...recentStoredAchievements];

        // Context-specific messages with memory
        const messages = {
            nutrition: {
                eat: [
                    "Mmm, that looks delicious! 🥕",
                    "Remember when we had that amazing salad on Tuesday? Let's make today even better!",
                    "Your healthy choices are paying off! I can see the energy in your step!",
                    "That meal reminds me of when we crushed our nutrition goals last week!",
                    "Every bite is a step toward your best self! Keep it up!"
                ],
                idle: [
                    "Ready for some nutritious fuel? 🍎",
                    "I remember how great you felt after that balanced meal yesterday!",
                    "Let's plan something that'll make us both happy and healthy!",
                    "Your consistency with meals has been amazing lately!",
                    "Time to nourish that amazing body of yours!"
                ],
                sick: [
                    "I notice we haven't been eating much today... Let's fix that! 💪",
                    "Remember how energized you felt after that protein-rich breakfast last week?",
                    "Your body needs fuel to keep up with all your amazing activities!",
                    "Let's get back to those healthy habits that made you feel so good!",
                    "I believe in you! One healthy meal at a time! 🌟"
                ]
            },
            activity: {
                walk: [
                    "Look at you go! 🏃‍♀️",
                    "Remember when we hit 10k steps on Tuesday? That was incredible!",
                    "Your dedication to movement is inspiring! Keep that momentum!",
                    "I love seeing you active! It reminds me of that amazing workout last week!",
                    "Every step is progress! You're building such healthy habits!"
                ],
                idle: [
                    "Ready to get moving? 🚶‍♀️",
                    "I remember how great you felt after that walk yesterday!",
                    "Let's channel that energy from your awesome workout last week!",
                    "Your consistency with exercise has been amazing!",
                    "Time to show your body some love with movement!"
                ],
                sick: [
                    "I miss seeing you active! Let's get moving! 💪",
                    "Remember how energized you felt after that morning walk last week?",
                    "Your body is craving movement! Let's give it what it needs!",
                    "I believe in your ability to get back to those healthy habits!",
                    "One small step today can lead to big changes! 🌟"
                ]
            },
            health: {
                celebrate: [
                    "You're absolutely crushing it! 🎉",
                    "This reminds me of when you achieved that perfect health score last month!",
                    "Your dedication to wellness is paying off beautifully!",
                    "I'm so proud of how you've maintained these healthy habits!",
                    "You're an inspiration! Keep up this amazing work!"
                ],
                idle: [
                    "Your health journey is looking great! 💚",
                    "I remember how proud you were of your progress last week!",
                    "Every healthy choice you make adds up to something amazing!",
                    "Your consistency is building such a strong foundation!",
                    "Keep nurturing that wonderful body of yours!"
                ],
                sick: [
                    "I'm here to support you through this! 🤗",
                    "Remember how you bounced back stronger after that challenge last month?",
                    "Your resilience is incredible! You've overcome obstacles before!",
                    "Let's focus on small, positive steps forward!",
                    "I believe in your ability to get back to feeling amazing! 🌟"
                ]
            },
            home: {
                celebrate: [
                    "You're absolutely crushing it! 🎉",
                    "Your overall wellness is looking amazing today!",
                    "I love seeing you maintain such great health habits!",
                    "You're a wellness champion! Keep up this incredible work!",
                    "Your dedication to health is truly inspiring!"
                ],
                walk: [
                    "Great job staying active! 🏃‍♀️",
                    "Your exercise routine is really paying off!",
                    "I love seeing you move and stay healthy!",
                    "Your activity levels are looking fantastic!",
                    "Keep up that amazing momentum!"
                ],
                eat: [
                    "Your nutrition game is strong! 🥕",
                    "I love seeing you fuel your body well!",
                    "Your healthy eating habits are really showing!",
                    "Great job taking care of your nutrition!",
                    "Your body is thanking you for those healthy choices!"
                ],
                idle: [
                    "Ready to make today amazing? 💚",
                    "Let's work together to build some great habits!",
                    "Every small step counts toward your wellness goals!",
                    "I'm here to support you on your health journey!",
                    "Together we can achieve amazing things!"
                ]
            }
        };

        // Get context-specific messages
        const contextMessages = messages[context] || messages.nutrition;
        const stateMessages = contextMessages[state] || contextMessages.idle;

        // Add memory-based messages if we have recent achievements
        if (allRecentAchievements.length > 0) {
            const latestAchievement = allRecentAchievements[allRecentAchievements.length - 1];
            const memoryMessages = [
                `Remember when we ${latestAchievement.activity}? That was amazing!`,
                `Your ${latestAchievement.activity} last week was so inspiring!`,
                `I'm still thinking about how great you did with ${latestAchievement.activity}!`,
                `That ${latestAchievement.activity} really showed your dedication!`,
                `You've been so consistent with ${latestAchievement.activity}! Keep it up!`,
                `I love seeing your progress with ${latestAchievement.activity}!`
            ];
            stateMessages.push(...memoryMessages);
        }

        // Add XP-based encouragement
        if (xpScore >= 80) {
            stateMessages.push("Your XP score is incredible! You're a wellness champion!");
        } else if (xpScore >= 60) {
            stateMessages.push("You're doing great! Every point counts toward your goals!");
        }

        // Select a random message
        const selectedMessage = stateMessages[Math.floor(Math.random() * stateMessages.length)];

        // Save this message to history
        const newMessage = {
            message: selectedMessage,
            context,
            state,
            timestamp: now.toISOString(),
            type: 'encouragement'
        };

        setMessageHistory(prev => [...prev.slice(-19), newMessage]); // Keep last 20 messages

        return selectedMessage;
    };

    // Update message when context or state changes
    useEffect(() => {
        const message = generatePersonalizedMessage(context, 'idle', activityLog, xpScore);
        setCurrentMessage(message);
    }, [context, activityLog, xpScore]);

    // Log achievements for future reference
    const logAchievement = (activity, description) => {
        const achievement = {
            activity,
            description,
            timestamp: new Date().toISOString(),
            type: 'achievement'
        };
        setMessageHistory(prev => [...prev.slice(-19), achievement]);
    };

    return {
        currentMessage,
        logAchievement,
        messageHistory
    };
};

export default usePersonalizedMessages;
