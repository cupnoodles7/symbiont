import React, { useState, useEffect, useRef } from 'react';
import './NutritionTracker.css';

function NutritionTracker() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logSuccess, setLogSuccess] = useState(false);
    const [goalSuccess, setGoalSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [dailyCalories, setDailyCalories] = useState(0);
    const [weeklyCalories, setWeeklyCalories] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(2000); // Default daily calorie goal
    const [editingGoal, setEditingGoal] = useState(false);
    const [tempGoal, setTempGoal] = useState(2000);
    const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
    const [mealHistory, setMealHistory] = useState([]);
    const [netCalories, setNetCalories] = useState(0); // Calories consumed - burned

    // Refs for scrolling
    const searchResultsRef = useRef(null);
    const nutritionDetailsRef = useRef(null);

    // Load saved data when component mounts
    useEffect(() => {
        const savedMeals = localStorage.getItem('mealHistory');
        if (savedMeals) {
            const meals = JSON.parse(savedMeals);
            setMealHistory(meals);

            // Calculate daily and weekly calories
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const dailyTotal = meals
                .filter(meal => meal.date === today)
                .reduce((sum, meal) => sum + meal.food.calories, 0);

            const weeklyTotal = meals
                .filter(meal => meal.date >= weekAgo && meal.date <= today)
                .reduce((sum, meal) => sum + meal.food.calories, 0);

            setDailyCalories(dailyTotal);
            setWeeklyCalories(weeklyTotal);

            // Calculate net calories (assuming no exercise for now)
            setNetCalories(dailyTotal);
        }

        // Load saved goal
        const savedGoal = localStorage.getItem('dailyCalorieGoal');
        if (savedGoal) {
            const goal = parseInt(savedGoal);
            setDailyGoal(goal);
            setTempGoal(goal);
        }
    }, []);

    // Function to save user's daily calorie goal
    const saveUserGoal = () => {
        try {
            localStorage.setItem('dailyCalorieGoal', tempGoal.toString());
            setDailyGoal(tempGoal);
            setEditingGoal(false);
            setGoalSuccess(true);
            setSuccessMessage('Daily calorie goal updated successfully!');
            setTimeout(() => setGoalSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving user goal:', err);
            setError('Failed to save calorie goal. Please try again.');
        }
    };

    // Function to calculate daily calories
    const calculateDailyCalories = () => {
        const today = new Date().toISOString().split('T')[0];
        const dailyTotal = mealHistory
            .filter(meal => meal.date === today)
            .reduce((sum, meal) => sum + meal.food.calories, 0);
        setDailyCalories(dailyTotal);
        setNetCalories(dailyTotal); // Update net calories
    };

    // Function to calculate weekly calories
    const calculateWeeklyCalories = () => {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const weeklyTotal = mealHistory
            .filter(meal => meal.date >= weekAgo && meal.date <= today)
            .reduce((sum, meal) => sum + meal.food.calories, 0);
        setWeeklyCalories(weeklyTotal);
    };

    // Function to search for foods
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:4000/search?food=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to search foods');
            }

            setSearchResults(data.results || []);

            // Auto-scroll to search results after a short delay
            setTimeout(() => {
                if (searchResultsRef.current) {
                    searchResultsRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        } catch (err) {
            setError('Failed to search foods. Please try again.');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to get detailed nutrition info
    const handleGetNutrition = async (foodName) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:4000/nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: `1 ${foodName}` }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get nutrition info');
            }

            setSelectedFood(data.results[0]);

            // Auto-scroll to nutrition details after a short delay
            setTimeout(() => {
                if (nutritionDetailsRef.current) {
                    nutritionDetailsRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        } catch (err) {
            setError('Failed to get nutrition information. Please try again.');
            console.error('Nutrition error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to log food and update daily calories
    const handleLogFood = () => {
        try {
            setLoading(true);
            setError(null);
            setLogSuccess(false);

            if (!selectedFood) {
                throw new Error('No food selected to log');
            }

            const foodData = {
                food: {
                    name: selectedFood.food_name,
                    serving_qty: selectedFood.serving_qty || 1,
                    serving_unit: selectedFood.serving_unit || 'serving',
                    calories: Number(selectedFood.calories) || 0,
                    protein: Number(selectedFood.protein) || 0,
                    carbs: Number(selectedFood.carbohydrates) || 0,
                    fat: Number(selectedFood.total_fat) || 0,
                    fiber: Number(selectedFood.fiber) || 0,
                    sugar: Number(selectedFood.sugar) || 0
                },
                timestamp: new Date().toISOString(),
                date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
            };

            // Update meal history
            const updatedHistory = [...mealHistory, foodData];
            setMealHistory(updatedHistory);
            localStorage.setItem('mealHistory', JSON.stringify(updatedHistory));

            // Update calories
            if (viewMode === 'daily') {
                calculateDailyCalories();
            } else {
                calculateWeeklyCalories();
            }

            setLogSuccess(true);
            setSuccessMessage(`Food logged successfully! +${foodData.food.calories} calories added to ${viewMode === 'daily' ? "today's" : "this week's"} total.`);
            setTimeout(() => setLogSuccess(false), 3000);
        } catch (err) {
            console.error('Error logging food:', err);
            setError(err.message || 'Failed to log food. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate progress percentage
    const currentCalories = viewMode === 'daily' ? dailyCalories : weeklyCalories;
    const currentGoal = viewMode === 'daily' ? dailyGoal : dailyGoal * 7;
    const progressPercentage = Math.min((currentCalories / currentGoal) * 100, 100);
    const remainingCalories = Math.max(currentGoal - currentCalories, 0);



    return (
        <div className="nutrition-tracker">
            {/* Daily/Weekly Calorie Summary */}
            <div className="daily-summary">
                <div className="summary-header">
                    <div className="header-top">
                        <h2>📊 {viewMode === 'daily' ? "Today's" : "This Week's"} Nutrition Summary</h2>
                        <div className="header-controls">
                            <div className="view-toggle">
                                <button
                                    className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
                                    onClick={() => {
                                        setViewMode('daily');
                                        fetchDailyCalories();
                                    }}
                                >
                                    Daily
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                                    onClick={() => {
                                        setViewMode('weekly');
                                        fetchWeeklyCalories();
                                    }}
                                >
                                    Weekly
                                </button>
                            </div>
                            <button
                                className="goal-edit-btn"
                                onClick={() => setEditingGoal(!editingGoal)}
                                title="Edit daily calorie goal"
                            >
                                ⚙
                            </button>
                        </div>
                    </div>
                    <div className="date-display">
                        {viewMode === 'daily'
                            ? new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                            : `${new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                        }
                    </div>

                    {editingGoal && (
                        <div className="goal-editor">
                            <div className="goal-input-group">
                                <label htmlFor="calorieGoal">Daily Calorie Goal:</label>
                                <input
                                    type="number"
                                    id="calorieGoal"
                                    value={tempGoal}
                                    onChange={(e) => setTempGoal(parseInt(e.target.value) || 2000)}
                                    min="1000"
                                    max="5000"
                                    step="100"
                                    className="goal-input"
                                />
                                <div className="goal-actions">
                                    <button
                                        className="goal-save-btn"
                                        onClick={saveUserGoal}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="goal-cancel-btn"
                                        onClick={() => {
                                            setEditingGoal(false);
                                            setTempGoal(dailyGoal);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {goalSuccess && (
                                <div className="success-message">
                                    {successMessage}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="calorie-overview">
                    <div className="calorie-main">
                        <div className="calorie-display">
                            <span className="calorie-number">{currentCalories}</span>
                            <span className="calorie-unit">calories</span>
                        </div>
                        <div className="calorie-goal">
                            of {currentGoal} {viewMode === 'daily' ? 'daily' : 'weekly'} goal
                        </div>
                    </div>

                    <div className="calorie-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">
                            {progressPercentage.toFixed(1)}% of {viewMode === 'daily' ? 'daily' : 'weekly'} goal
                        </div>
                    </div>

                    <div className="calorie-stats">
                        <div className="calorie-remaining">
                            <span className="remaining-label">Remaining:</span>
                            <span className="remaining-value">{remainingCalories} calories</span>
                        </div>
                        <div className="net-calories">
                            <span className="net-label">Net Calories:</span>
                            <span className="net-value" style={{
                                color: netCalories > dailyGoal ? 'var(--error-color, #dc3545)' : 'var(--success-color, #28a745)'
                            }}>
                                {netCalories} calories
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="search-section">
                <h2>🔍 Search Foods</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a food (e.g., apple, chicken breast)"
                        className="search-input"
                    />
                    <button type="submit" className="search-button" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                {/* Ultra-minimal list layout search results */}
                {searchResults.length > 0 && (
                    <div className="search-results-container" ref={searchResultsRef}>
                        <h3>Search Results ({searchResults.length} found)</h3>

                        <div className="results-viewport">
                            <div className="results-list">
                                {searchResults.map((food, index) => (
                                    <div
                                        key={index}
                                        className="results-list-food-item"
                                        onClick={() => handleGetNutrition(food.food_name)}
                                    >
                                        <div className="food-item-info">
                                            <h4 className="food-name">{food.food_name}</h4>
                                            <div className="food-servings">
                                                {food.serving_qty} {food.serving_unit} • {food.calories} cal
                                            </div>
                                        </div>
                                        <div className="food-item-macros">
                                            <span className="macro-text">P: {food.protein_g}g</span>
                                            <span className="macro-text">C: {food.carbs_g}g</span>
                                            <span className="macro-text">F: {food.fat_g}g</span>
                                        </div>
                                        <button className="view-details-btn">
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pagination-info">
                            {searchResults.length} results found
                        </div>
                    </div>
                )}
            </div>

            {selectedFood && (
                <div className="nutrition-details" ref={nutritionDetailsRef}>
                    <h2>📊 Nutrition Facts</h2>
                    <div className="nutrition-card">
                        <div className="nutrition-header">
                            <h3>{selectedFood.food_name}</h3>
                            {selectedFood.brand_name && (
                                <span className="brand-name">{selectedFood.brand_name}</span>
                            )}
                        </div>

                        <div className="serving-info">
                            <p>Serving Size: {selectedFood.serving_qty} {selectedFood.serving_unit}
                                ({selectedFood.serving_weight_grams}g)</p>
                        </div>

                        <div className="nutrition-grid">
                            <div className="nutrition-item calories">
                                <span className="label">Calories</span>
                                <span className="value">{selectedFood.calories}</span>
                            </div>

                            <div className="nutrition-item">
                                <span className="label">Total Fat</span>
                                <span className="value">{selectedFood.total_fat}g</span>
                            </div>

                            <div className="nutrition-item">
                                <span className="label">Total Carbs</span>
                                <span className="value">{selectedFood.carbohydrates}g</span>
                            </div>

                            <div className="nutrition-item">
                                <span className="label">Protein</span>
                                <span className="value">{selectedFood.protein}g</span>
                            </div>

                            <div className="nutrition-item">
                                <span className="label">Fiber</span>
                                <span className="value">{selectedFood.fiber}g</span>
                            </div>

                            <div className="nutrition-item">
                                <span className="label">Sugar</span>
                                <span className="value">{selectedFood.sugar}g</span>
                            </div>
                        </div>

                        {logSuccess && (
                            <div className="success-message">
                                {successMessage}
                            </div>
                        )}
                        <button
                            className="log-food-button"
                            disabled={loading}
                            onClick={handleLogFood}
                        >
                            📝 Log This Food
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NutritionTracker;