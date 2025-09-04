import { useState } from 'react';

const useHealthMetrics = () => {
    const [healthMetrics, setHealthMetrics] = useState({
        hydration: 75, // percentage (0-100)
        nutrition: 67, // percentage (0-100)
        activity: 60,  // percentage (0-100)
        sleep: 85,     // percentage (0-100)
        steps: 4500,   // actual steps
        water: 6,      // glasses of water
        meals: 2,      // meals eaten today
        sleepHours: 7.5 // hours of sleep
    });

    const [goals] = useState({
        hydration: 80,
        nutrition: 80,
        activity: 75,
        sleep: 80,
        steps: 8000,
        water: 8,
        meals: 3,
        sleepHours: 8
    });

    // Calculate percentages based on actual values vs goals
    const calculatePercentages = () => {
        return {
            hydration: Math.min(100, (healthMetrics.water / goals.water) * 100),
            nutrition: Math.min(100, (healthMetrics.meals / goals.meals) * 100),
            activity: Math.min(100, (healthMetrics.steps / goals.steps) * 100),
            sleep: Math.min(100, (healthMetrics.sleepHours / goals.sleepHours) * 100)
        };
    };

    // Increment a metric (for quick actions)
    const incrementMetric = (metric, amount = 1) => {
        setHealthMetrics(prev => ({
            ...prev,
            [metric]: prev[metric] + amount
        }));
    };

    // Get health warnings (metrics that are critically low)
    const getHealthWarnings = () => {
        const percentages = calculatePercentages();
        const warnings = [];
        
        Object.entries(percentages).forEach(([metric, percentage]) => {
            if (percentage < 30) {
                warnings.push({
                    metric,
                    percentage,
                    severity: 'critical'
                });
            } else if (percentage < 50) {
                warnings.push({
                    metric,
                    percentage,
                    severity: 'warning'
                });
            }
        });
        
        return warnings;
    };

    // Check if any goals were just achieved
    const checkGoalAchievements = () => {
        const percentages = calculatePercentages();
        const achievements = [];
        
        Object.entries(percentages).forEach(([metric, percentage]) => {
            if (percentage >= 100) {
                achievements.push(metric);
            }
        });
        
        return achievements;
    };

    return {
        healthMetrics,
        percentages: calculatePercentages(),
        goals,
        achievements: checkGoalAchievements(),
        warnings: getHealthWarnings(),
        incrementMetric
    };
};

export default useHealthMetrics;

