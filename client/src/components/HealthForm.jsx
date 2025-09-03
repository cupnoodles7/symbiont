import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './HealthForm.css';

function HealthForm({ onComplete, userData }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [healthData, setHealthData] = useState({
        // Basic Health Info
        age: '',
        gender: '',
        activityLevel: '',

        // Medical History
        medicalConditions: [],
        medications: [],
        allergies: [],
        surgeries: [],

        // Lifestyleimage.pngimage.png
        smokingStatus: '',
        alcoholConsumption: '',
        exerciseFrequency: '',
        sleepHours: '',

        // Dietary Preferences
        dietaryRestrictions: [],
        foodAllergies: [],
        preferredCuisine: [],

        // Goals
        healthGoals: [],
        weightGoal: '',
        targetCalories: '',

        // Mental Health
        stressLevel: '',
        mentalHealthConditions: [],

        // Family History
        familyHistory: [],

        // Emergency Contact
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
        }
    });

    const steps = [
        {
            title: "Basic Health Information",
            subtitle: "Let's start with the fundamentals",
            type: "basic",
            icon: "👤"
        },
        {
            title: "Medical History",
            subtitle: "Tell us about your health background",
            type: "medical",
            icon: "🏥"
        },
        {
            title: "Lifestyle & Habits",
            subtitle: "Understanding your daily routine",
            type: "lifestyle",
            icon: "🌱"
        },
        {
            title: "Dietary Preferences",
            subtitle: "What fuels your body?",
            type: "dietary",
            icon: "🍎"
        },
        {
            title: "Health Goals",
            subtitle: "What do you want to achieve?",
            type: "goals",
            icon: "🎯"
        },
        {
            title: "Mental Wellness",
            subtitle: "Taking care of your mind",
            type: "mental",
            icon: "🧠"
        },
        {
            title: "Family History",
            subtitle: "Understanding your genetic background",
            type: "family",
            icon: "👨‍👩‍👧‍👦"
        },
        {
            title: "Emergency Contact",
            subtitle: "Safety first - who should we contact?",
            type: "emergency",
            icon: "🆘"
        }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setHealthData(prev => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter(item => item !== value)
            }));
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setHealthData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setHealthData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Final step - store health data in Firestore
            try {
                console.log('Storing health data in Firestore...');
                console.log('User data:', userData);
                console.log('Health data:', healthData);

                // Prepare health data for Firestore
                const healthDataForFirestore = {
                    ...healthData,
                    completedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                // Update user document with health data
                const userRef = doc(db, 'users', userData.uid);
                await updateDoc(userRef, {
                    healthData: healthDataForFirestore,
                    healthFormComplete: true,
                    profileComplete: true,
                    updatedAt: new Date().toISOString()
                });

                console.log('Health data stored successfully in Firestore');

                // Call onComplete with combined data
                onComplete({
                    ...userData,
                    healthData: healthDataForFirestore
                });

            } catch (error) {
                console.error('Error storing health data:', error);
                // Still call onComplete even if Firestore fails
                onComplete({
                    ...userData,
                    healthData: healthData
                });
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderBasicStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">👤</div>
                <div className="step-decoration">
                    <div className="decoration-circle"></div>
                    <div className="decoration-line"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Personal Information</h3>

                <div className="form-grid">
                    <div className="form-field">
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={healthData.age}
                            onChange={handleInputChange}
                            placeholder="Enter your age"
                            min="1"
                            max="120"
                        />
                    </div>

                    <div className="form-field">
                        <label>Gender</label>
                        <select name="gender" value={healthData.gender} onChange={handleInputChange}>
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                <div className="form-field">
                    <label>Activity Level</label>
                    <select name="activityLevel" value={healthData.activityLevel} onChange={handleInputChange}>
                        <option value="">Select activity level</option>
                        <option value="sedentary">Sedentary (little or no exercise)</option>
                        <option value="lightly-active">Lightly active (light exercise 1-3 days/week)</option>
                        <option value="moderately-active">Moderately active (moderate exercise 3-5 days/week)</option>
                        <option value="very-active">Very active (hard exercise 6-7 days/week)</option>
                        <option value="extremely-active">Extremely active (very hard exercise, physical job)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderMedicalStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">🏥</div>
                <div className="step-decoration">
                    <div className="decoration-cross"></div>
                    <div className="decoration-dots"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Medical Conditions</h3>
                <div className="tag-selector">
                    {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'Depression', 'Anxiety', 'Obesity', 'High Cholesterol', 'Thyroid Issues'].map(condition => (
                        <button
                            key={condition}
                            type="button"
                            className={`tag ${healthData.medicalConditions.includes(condition) ? 'selected' : ''}`}
                            onClick={() => {
                                const newConditions = healthData.medicalConditions.includes(condition)
                                    ? healthData.medicalConditions.filter(c => c !== condition)
                                    : [...healthData.medicalConditions, condition];
                                setHealthData(prev => ({ ...prev, medicalConditions: newConditions }));
                            }}
                        >
                            {condition}
                        </button>
                    ))}
                </div>

                <div className="form-field">
                    <label>Current Medications</label>
                    <textarea
                        name="medications"
                        value={healthData.medications.join(', ')}
                        onChange={(e) => setHealthData(prev => ({ ...prev, medications: e.target.value.split(',').map(m => m.trim()).filter(m => m) }))}
                        placeholder="List your current medications (separated by commas)"
                        rows="3"
                    />
                </div>

                <div className="form-field">
                    <label>Allergies</label>
                    <textarea
                        name="allergies"
                        value={healthData.allergies.join(', ')}
                        onChange={(e) => setHealthData(prev => ({ ...prev, allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a) }))}
                        placeholder="List your allergies (separated by commas)"
                        rows="3"
                    />
                </div>
            </div>
        </div>
    );

    const renderLifestyleStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">🌱</div>
                <div className="step-decoration">
                    <div className="decoration-leaf"></div>
                    <div className="decoration-wave"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Lifestyle Habits</h3>

                <div className="form-field">
                    <label>Smoking Status</label>
                    <select name="smokingStatus" value={healthData.smokingStatus} onChange={handleInputChange}>
                        <option value="">Select smoking status</option>
                        <option value="never">Never smoked</option>
                        <option value="former">Former smoker</option>
                        <option value="current">Current smoker</option>
                        <option value="occasional">Occasional smoker</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Alcohol Consumption</label>
                    <select name="alcoholConsumption" value={healthData.alcoholConsumption} onChange={handleInputChange}>
                        <option value="">Select alcohol consumption</option>
                        <option value="none">None</option>
                        <option value="occasional">Occasional (1-2 drinks/week)</option>
                        <option value="moderate">Moderate (3-7 drinks/week)</option>
                        <option value="heavy">Heavy (8+ drinks/week)</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Exercise Frequency</label>
                    <select name="exerciseFrequency" value={healthData.exerciseFrequency} onChange={handleInputChange}>
                        <option value="">Select exercise frequency</option>
                        <option value="never">Never</option>
                        <option value="rarely">Rarely (1-2 times/month)</option>
                        <option value="sometimes">Sometimes (1-2 times/week)</option>
                        <option value="regular">Regular (3-4 times/week)</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Average Sleep Hours</label>
                    <select name="sleepHours" value={healthData.sleepHours} onChange={handleInputChange}>
                        <option value="">Select sleep hours</option>
                        <option value="less-than-6">Less than 6 hours</option>
                        <option value="6-7">6-7 hours</option>
                        <option value="7-8">7-8 hours</option>
                        <option value="8-9">8-9 hours</option>
                        <option value="more-than-9">More than 9 hours</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderDietaryStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">🍎</div>
                <div className="step-decoration">
                    <div className="decoration-fruit"></div>
                    <div className="decoration-seeds"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Dietary Preferences</h3>

                <div className="form-field">
                    <label>Dietary Restrictions</label>
                    <div className="tag-selector">
                        {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Low-Sodium', 'Halal', 'Kosher'].map(diet => (
                            <button
                                key={diet}
                                type="button"
                                className={`tag ${healthData.dietaryRestrictions.includes(diet) ? 'selected' : ''}`}
                                onClick={() => {
                                    const newRestrictions = healthData.dietaryRestrictions.includes(diet)
                                        ? healthData.dietaryRestrictions.filter(d => d !== diet)
                                        : [...healthData.dietaryRestrictions, diet];
                                    setHealthData(prev => ({ ...prev, dietaryRestrictions: newRestrictions }));
                                }}
                            >
                                {diet}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-field">
                    <label>Food Allergies</label>
                    <textarea
                        name="foodAllergies"
                        value={healthData.foodAllergies.join(', ')}
                        onChange={(e) => setHealthData(prev => ({ ...prev, foodAllergies: e.target.value.split(',').map(f => f.trim()).filter(f => f) }))}
                        placeholder="List any food allergies (separated by commas)"
                        rows="3"
                    />
                </div>

                <div className="form-field">
                    <label>Preferred Cuisines</label>
                    <div className="tag-selector">
                        {['Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Mediterranean', 'American', 'Thai', 'French', 'Greek'].map(cuisine => (
                            <button
                                key={cuisine}
                                type="button"
                                className={`tag ${healthData.preferredCuisine.includes(cuisine) ? 'selected' : ''}`}
                                onClick={() => {
                                    const newCuisines = healthData.preferredCuisine.includes(cuisine)
                                        ? healthData.preferredCuisine.filter(c => c !== cuisine)
                                        : [...healthData.preferredCuisine, cuisine];
                                    setHealthData(prev => ({ ...prev, preferredCuisine: newCuisines }));
                                }}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGoalsStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">🎯</div>
                <div className="step-decoration">
                    <div className="decoration-target"></div>
                    <div className="decoration-arrow"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Health Goals</h3>

                <div className="form-field">
                    <label>What are your health goals?</label>
                    <div className="tag-selector">
                        {['Lose Weight', 'Gain Weight', 'Maintain Weight', 'Build Muscle', 'Improve Fitness', 'Better Sleep', 'Reduce Stress', 'Manage Diabetes', 'Lower Blood Pressure', 'Improve Mental Health'].map(goal => (
                            <button
                                key={goal}
                                type="button"
                                className={`tag ${healthData.healthGoals.includes(goal) ? 'selected' : ''}`}
                                onClick={() => {
                                    const newGoals = healthData.healthGoals.includes(goal)
                                        ? healthData.healthGoals.filter(g => g !== goal)
                                        : [...healthData.healthGoals, goal];
                                    setHealthData(prev => ({ ...prev, healthGoals: newGoals }));
                                }}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label>Target Weight (kg)</label>
                        <input
                            type="number"
                            name="weightGoal"
                            value={healthData.weightGoal}
                            onChange={handleInputChange}
                            placeholder="Enter target weight"
                            min="30"
                            max="300"
                        />
                    </div>

                    <div className="form-field">
                        <label>Daily Calorie Target</label>
                        <input
                            type="number"
                            name="targetCalories"
                            value={healthData.targetCalories}
                            onChange={handleInputChange}
                            placeholder="Enter calorie target"
                            min="800"
                            max="5000"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMentalStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">🧠</div>
                <div className="step-decoration">
                    <div className="decoration-brain"></div>
                    <div className="decoration-thoughts"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Mental Wellness</h3>

                <div className="form-field">
                    <label>Stress Level</label>
                    <select name="stressLevel" value={healthData.stressLevel} onChange={handleInputChange}>
                        <option value="">Select stress level</option>
                        <option value="low">Low stress</option>
                        <option value="moderate">Moderate stress</option>
                        <option value="high">High stress</option>
                        <option value="very-high">Very high stress</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Mental Health Conditions</label>
                    <div className="tag-selector">
                        {['Depression', 'Anxiety', 'ADHD', 'Bipolar Disorder', 'PTSD', 'OCD', 'Eating Disorders', 'None'].map(condition => (
                            <button
                                key={condition}
                                type="button"
                                className={`tag ${healthData.mentalHealthConditions.includes(condition) ? 'selected' : ''}`}
                                onClick={() => {
                                    const newConditions = healthData.mentalHealthConditions.includes(condition)
                                        ? healthData.mentalHealthConditions.filter(c => c !== condition)
                                        : [...healthData.mentalHealthConditions, condition];
                                    setHealthData(prev => ({ ...prev, mentalHealthConditions: newConditions }));
                                }}
                            >
                                {condition}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFamilyStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">👨‍👩‍👧‍👦</div>
                <div className="step-decoration">
                    <div className="decoration-family"></div>
                    <div className="decoration-tree"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Family Medical History</h3>

                <div className="form-field">
                    <label>Family History of Conditions</label>
                    <div className="tag-selector">
                        {['Diabetes', 'Heart Disease', 'Cancer', 'High Blood Pressure', 'Obesity', 'Depression', 'Anxiety', 'Alzheimer\'s', 'Stroke', 'None'].map(condition => (
                            <button
                                key={condition}
                                type="button"
                                className={`tag ${healthData.familyHistory.includes(condition) ? 'selected' : ''}`}
                                onClick={() => {
                                    const newHistory = healthData.familyHistory.includes(condition)
                                        ? healthData.familyHistory.filter(c => c !== condition)
                                        : [...healthData.familyHistory, condition];
                                    setHealthData(prev => ({ ...prev, familyHistory: newHistory }));
                                }}
                            >
                                {condition}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEmergencyStep = () => (
        <div className="health-step-content">
            <div className="step-visual">
                <div className="floating-icon">🆘</div>
                <div className="step-decoration">
                    <div className="decoration-emergency"></div>
                    <div className="decoration-pulse"></div>
                </div>
            </div>

            <div className="step-form-section">
                <h3>Emergency Contact</h3>

                <div className="form-grid">
                    <div className="form-field">
                        <label>Contact Name</label>
                        <input
                            type="text"
                            name="emergencyContact.name"
                            value={healthData.emergencyContact.name}
                            onChange={handleInputChange}
                            placeholder="Full name"
                        />
                    </div>

                    <div className="form-field">
                        <label>Relationship</label>
                        <input
                            type="text"
                            name="emergencyContact.relationship"
                            value={healthData.emergencyContact.relationship}
                            onChange={handleInputChange}
                            placeholder="e.g., Spouse, Parent"
                        />
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="emergencyContact.phone"
                            value={healthData.emergencyContact.phone}
                            onChange={handleInputChange}
                            placeholder="Phone number"
                        />
                    </div>

                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="emergencyContact.email"
                            value={healthData.emergencyContact.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return renderBasicStep();
            case 1: return renderMedicalStep();
            case 2: return renderLifestyleStep();
            case 3: return renderDietaryStep();
            case 4: return renderGoalsStep();
            case 5: return renderMentalStep();
            case 6: return renderFamilyStep();
            case 7: return renderEmergencyStep();
            default: return renderBasicStep();
        }
    };

    return (
        <div className="health-form-wrapper">
            <div className="health-form-header">
                <div className="step-progress">
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="step-counter">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </div>

                <div className="current-step-info">
                    <div className="step-icon">{steps[currentStep].icon}</div>
                    <div className="step-text">
                        <h1>{steps[currentStep].title}</h1>
                        <p>{steps[currentStep].subtitle}</p>
                    </div>
                </div>
            </div>

            <div className="health-form-body">
                {renderStepContent()}
            </div>

            <div className="health-form-footer">
                <div className="navigation-buttons">
                    {currentStep > 0 && (
                        <button type="button" onClick={handleBack} className="nav-btn back-btn">
                            <span className="btn-icon">←</span>
                            <span>Back</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleNext}
                        className="nav-btn next-btn"
                    >
                        <span>{currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}</span>
                        <span className="btn-icon">{currentStep === steps.length - 1 ? '✓' : '→'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HealthForm;
