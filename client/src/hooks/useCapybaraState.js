import { useState, useEffect } from 'react';

const useCapybaraState = () => {
    const [xpScore, setXpScore] = useState(100); // Start with neutral score
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [currentState, setCurrentState] = useState('idle');
    const [achievements, setAchievements] = useState([]);
    
    // Activity tracking
    const [activityLog, setActivityLog] = useState({
        meals: { count: 0, lastTime: null },
        water: { count: 0, lastTime: null },
        exercise: { count: 0, lastTime: null },
        sleep: { hours: 0, lastTime: null }
    });

    // XP thresholds for different states
    const XP_THRESHOLDS = {
        SICK: 30,      // Below 30 XP = sick
        IDLE: 70,      // 30-70 XP = idle
        CELEBRATE: 90  // Above 90 XP = celebrate
    };

    // Goals for the day
    const DAILY_GOALS = {
        meals: 3,
        water: 8,
        exercise: 1, // 1 workout session
        sleep: 8     // 8 hours
    };

    // Calculate XP based on activities and time decay
    const calculateXP = () => {
        const now = Date.now();
        const hoursInactive = (now - lastActivity) / (1000 * 60 * 60);
        
        // Start with base XP
        let newXP = 100;
        
        // Add points for completing activities
        const mealProgress = Math.min(activityLog.meals.count / DAILY_GOALS.meals, 1);
        const waterProgress = Math.min(activityLog.water.count / DAILY_GOALS.water, 1);
        const exerciseProgress = Math.min(activityLog.exercise.count / DAILY_GOALS.exercise, 1);
        const sleepProgress = Math.min(activityLog.sleep.hours / DAILY_GOALS.sleep, 1);
        
        // Calculate weighted score
        newXP = (
            mealProgress * 25 +      // 25 points for meals
            waterProgress * 25 +     // 25 points for water
            exerciseProgress * 30 +  // 30 points for exercise
            sleepProgress * 20       // 20 points for sleep
        );
        
        // Decay XP over time if inactive (lose 5 XP per hour of inactivity)
        newXP = Math.max(0, newXP - (hoursInactive * 5));
        
        return Math.round(newXP);
    };

    // Determine capybara state based on XP and recent activity
    const determineState = (xp, recentActivity = null) => {
        // Override states for specific activities
        if (recentActivity) {
            return recentActivity;
        }
        
        // Check if goals are met (celebrate)
        const goalsCompleted = Object.keys(DAILY_GOALS).filter(goal => {
            if (goal === 'sleep') return activityLog[goal].hours >= DAILY_GOALS[goal];
            return activityLog[goal].count >= DAILY_GOALS[goal];
        });
        
        if (goalsCompleted.length >= 3) {
            return 'celebrate';
        }
        
        // State based on XP
        if (xp <= XP_THRESHOLDS.SICK) return 'sick';
        if (xp >= XP_THRESHOLDS.CELEBRATE) return 'celebrate';
        return 'idle';
    };

    // Log an activity and update XP
    const logActivity = (activity, amount = 1) => {
        const now = Date.now();
        
        setActivityLog(prev => ({
            ...prev,
            [activity]: {
                count: activity === 'sleep' ? amount : prev[activity].count + amount,
                hours: activity === 'sleep' ? amount : prev[activity].hours,
                lastTime: now
            }
        }));
        
        setLastActivity(now);
        
        // Set temporary state for the activity
        const activityStates = {
            meals: 'eat',
            water: 'idle', // Water doesn't change state visually
            exercise: 'walk',
            sleep: 'idle'
        };
        
        if (activityStates[activity] && activityStates[activity] !== 'idle') {
            setCurrentState(activityStates[activity]);
            
            // Return to calculated state after animation
            setTimeout(() => {
                const newXP = calculateXP();
                setXpScore(newXP);
                setCurrentState(determineState(newXP));
            }, 3000);
        } else {
            // Immediately update XP and state
            const newXP = calculateXP();
            setXpScore(newXP);
            setCurrentState(determineState(newXP));
        }

        // Log achievement for personalized messages
        const achievementDescriptions = {
            meals: `had a healthy meal`,
            water: `stayed hydrated`,
            exercise: `completed an exercise session`,
            sleep: `got good rest`
        };

        if (achievementDescriptions[activity]) {
            // Store achievement in localStorage for the personalized messages system
            const achievements = JSON.parse(localStorage.getItem('capybara-achievements') || '[]');
            achievements.push({
                activity: achievementDescriptions[activity],
                timestamp: now,
                type: 'achievement'
            });
            // Keep only last 50 achievements
            localStorage.setItem('capybara-achievements', JSON.stringify(achievements.slice(-50)));
        }
    };

    // Get context-appropriate state for different screens
    const getContextState = (screenContext) => {
        switch (screenContext) {
            case 'nutrition':
                // Show eating animation if recently ate, otherwise based on nutrition score
                const nutritionScore = (activityLog.meals.count / DAILY_GOALS.meals) * 100;
                if (nutritionScore < 30) return 'sick';
                if (nutritionScore >= 80) return 'eat';
                return 'idle';
                
            case 'activity':
                // Show walking animation if recently exercised
                const activityScore = (activityLog.exercise.count / DAILY_GOALS.exercise) * 100;
                if (activityScore < 30) return 'sick';
                if (activityScore >= 80) return 'walk';
                return 'idle';
                
            case 'health':
                // Show celebrate animation if health is good, otherwise show current state
                const overallHealth = (activityLog.meals.count / DAILY_GOALS.meals + 
                                     activityLog.exercise.count / DAILY_GOALS.exercise + 
                                     activityLog.water.count / DAILY_GOALS.water) / 3;
                if (overallHealth >= 0.8) return 'celebrate';
                return currentState;
                
            case 'home':
            default:
                return currentState;
        }
    };

    // Update XP periodically
    useEffect(() => {
        const interval = setInterval(() => {
            const newXP = calculateXP();
            setXpScore(newXP);
            setCurrentState(determineState(newXP));
        }, 60000); // Update every minute
        
        return () => clearInterval(interval);
    }, [activityLog, lastActivity]);

    // Check for achievements
    useEffect(() => {
        const newAchievements = [];
        
        Object.keys(DAILY_GOALS).forEach(goal => {
            const current = goal === 'sleep' ? activityLog[goal].hours : activityLog[goal].count;
            if (current >= DAILY_GOALS[goal]) {
                newAchievements.push(goal);
            }
        });
        
        setAchievements(newAchievements);
    }, [activityLog]);

    return {
        xpScore,
        currentState,
        achievements,
        activityLog,
        logActivity,
        getContextState,
        dailyGoals: DAILY_GOALS,
        getHealthStatus: () => {
            if (xpScore <= XP_THRESHOLDS.SICK) return 'poor';
            if (xpScore <= XP_THRESHOLDS.IDLE) return 'fair';
            if (xpScore >= XP_THRESHOLDS.CELEBRATE) return 'excellent';
            return 'good';
        }
    };
};

export default useCapybaraState;

