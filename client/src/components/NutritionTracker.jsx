import React, { useState } from 'react';
import './NutritionTracker.css';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function NutritionTracker() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logSuccess, setLogSuccess] = useState(false);

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
        } catch (err) {
            setError('Failed to get nutrition information. Please try again.');
            console.error('Nutrition error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nutrition-tracker">
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

                <div className="search-results">
                    {searchResults.map((food, index) => (
                        <div key={index} className="food-item" onClick={() => handleGetNutrition(food.food_name)}>
                            <div className="food-item-header">
                                <h3>{food.food_name}</h3>
                                {food.brand_name && <span className="brand-name">{food.brand_name}</span>}
                            </div>
                            <div className="food-item-details">
                                <span>
                                    {food.serving_qty} {food.serving_unit}
                                </span>
                                <span>
                                    {food.calories} cal
                                </span>
                            </div>
                            <div className="food-item-macros">
                                <div className="macro-item">
                                    <span className="macro-value">{food.protein_g}</span>
                                    <span className="macro-label">Protein</span>
                                </div>
                                <div className="macro-item">
                                    <span className="macro-value">{food.carbs_g}</span>
                                    <span className="macro-label">Carbs</span>
                                </div>
                                <div className="macro-item">
                                    <span className="macro-value">{food.fat_g}</span>
                                    <span className="macro-label">Fat</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedFood && (
                <div className="nutrition-details">
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
                                ✅ Food logged successfully!
                            </div>
                        )}
                        <button 
                            className="log-food-button"
                            disabled={loading}
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    setError(null);
                                    setLogSuccess(false);

                                    const user = auth.currentUser;
                                    if (!user) {
                                        throw new Error('Please sign in to log foods');
                                    }

                                    // Add to meals collection
                                    await addDoc(collection(db, 'meals'), {
                                        userId: user.uid,
                                        food: {
                                            name: selectedFood.food_name,
                                            serving_qty: selectedFood.serving_qty,
                                            serving_unit: selectedFood.serving_unit,
                                            calories: selectedFood.calories,
                                            protein: selectedFood.protein,
                                            carbs: selectedFood.carbohydrates,
                                            fat: selectedFood.total_fat,
                                            fiber: selectedFood.fiber,
                                            sugar: selectedFood.sugar
                                        },
                                        timestamp: serverTimestamp(),
                                        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
                                    });

                                    setLogSuccess(true);
                                    setTimeout(() => setLogSuccess(false), 3000); // Hide success message after 3 seconds
                                } catch (err) {
                                    console.error('Error logging food:', err);
                                    setError('Failed to log food. Please try again.');
                                } finally {
                                    setLoading(false);
                                }
                            }}
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
