import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Profile.css';

function Profile() {
    const { userData, updateUserData } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        dateOfBirth: '',
        weight: '',
        height: '',
        medicalConditions: '',
        shareWithCaregiver: false,
        caregiverEmail: '',
        // Health Data fields
        age: '',
        gender: '',
        activityLevel: '',
        medications: [],
        allergies: [],
        surgeries: [],
        smokingStatus: '',
        alcoholConsumption: '',
        exerciseFrequency: '',
        sleepHours: '',
        dietaryRestrictions: [],
        foodAllergies: [],
        preferredCuisine: [],
        healthGoals: [],
        weightGoal: '',
        targetCalories: '',
        stressLevel: '',
        mentalHealthConditions: [],
        familyHistory: [],
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
        }
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                dateOfBirth: userData.dateOfBirth || '',
                weight: userData.weight || '',
                height: userData.height || '',
                medicalConditions: userData.medicalConditions || '',
                shareWithCaregiver: userData.shareWithCaregiver || false,
                caregiverEmail: userData.caregiverEmail || '',
                // Health Data fields
                age: userData.healthData?.age || '',
                gender: userData.healthData?.gender || '',
                activityLevel: userData.healthData?.activityLevel || '',
                medications: userData.healthData?.medications || [],
                allergies: userData.healthData?.allergies || [],
                surgeries: userData.healthData?.surgeries || [],
                smokingStatus: userData.healthData?.smokingStatus || '',
                alcoholConsumption: userData.healthData?.alcoholConsumption || '',
                exerciseFrequency: userData.healthData?.exerciseFrequency || '',
                sleepHours: userData.healthData?.sleepHours || '',
                dietaryRestrictions: userData.healthData?.dietaryRestrictions || [],
                foodAllergies: userData.healthData?.foodAllergies || [],
                preferredCuisine: userData.healthData?.preferredCuisine || [],
                healthGoals: userData.healthData?.healthGoals || [],
                weightGoal: userData.healthData?.weightGoal || '',
                targetCalories: userData.healthData?.targetCalories || '',
                stressLevel: userData.healthData?.stressLevel || '',
                mentalHealthConditions: userData.healthData?.mentalHealthConditions || [],
                familyHistory: userData.healthData?.familyHistory || [],
                emergencyContact: userData.healthData?.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: '',
                    email: ''
                }
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter(item => item !== value)
            }));
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        if (!userData?.uid) return;

        setSaving(true);
        setMessage('');

        try {
            // Update Firestore
            const userRef = doc(db, 'users', userData.uid);
            await updateDoc(userRef, {
                ...formData,
                weight: parseFloat(formData.weight) || 0,
                height: parseFloat(formData.height) || 0,
                healthData: {
                    age: formData.age,
                    gender: formData.gender,
                    activityLevel: formData.activityLevel,
                    medications: formData.medications,
                    allergies: formData.allergies,
                    surgeries: formData.surgeries,
                    smokingStatus: formData.smokingStatus,
                    alcoholConsumption: formData.alcoholConsumption,
                    exerciseFrequency: formData.exerciseFrequency,
                    sleepHours: formData.sleepHours,
                    dietaryRestrictions: formData.dietaryRestrictions,
                    foodAllergies: formData.foodAllergies,
                    preferredCuisine: formData.preferredCuisine,
                    healthGoals: formData.healthGoals,
                    weightGoal: formData.weightGoal,
                    targetCalories: formData.targetCalories,
                    stressLevel: formData.stressLevel,
                    mentalHealthConditions: formData.mentalHealthConditions,
                    familyHistory: formData.familyHistory,
                    emergencyContact: formData.emergencyContact,
                    updatedAt: new Date().toISOString()
                },
                updatedAt: new Date().toISOString()
            });

            // Update local context
            updateUserData(formData);

            setIsEditing(false);
            setMessage('Profile updated successfully!');

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                dateOfBirth: userData.dateOfBirth || '',
                weight: userData.weight || '',
                height: userData.height || '',
                medicalConditions: userData.medicalConditions || '',
                shareWithCaregiver: userData.shareWithCaregiver || false,
                caregiverEmail: userData.caregiverEmail || '',
                // Health Data fields
                age: userData.healthData?.age || '',
                gender: userData.healthData?.gender || '',
                activityLevel: userData.healthData?.activityLevel || '',
                medications: userData.healthData?.medications || [],
                allergies: userData.healthData?.allergies || [],
                surgeries: userData.healthData?.surgeries || [],
                smokingStatus: userData.healthData?.smokingStatus || '',
                alcoholConsumption: userData.healthData?.alcoholConsumption || '',
                exerciseFrequency: userData.healthData?.exerciseFrequency || '',
                sleepHours: userData.healthData?.sleepHours || '',
                dietaryRestrictions: userData.healthData?.dietaryRestrictions || [],
                foodAllergies: userData.healthData?.foodAllergies || [],
                preferredCuisine: userData.healthData?.preferredCuisine || [],
                healthGoals: userData.healthData?.healthGoals || [],
                weightGoal: userData.healthData?.weightGoal || '',
                targetCalories: userData.healthData?.targetCalories || '',
                stressLevel: userData.healthData?.stressLevel || '',
                mentalHealthConditions: userData.healthData?.mentalHealthConditions || [],
                familyHistory: userData.healthData?.familyHistory || [],
                emergencyContact: userData.healthData?.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: '',
                    email: ''
                }
            });
        }
        setIsEditing(false);
        setMessage('');
    };

    if (!userData) {
        return (
            <div className="profile-container">
                <div className="loading-message">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>👤 Profile & Settings</h2>
                <p>Manage your account and health preferences</p>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="profile-content">
                <div className="profile-section">
                    <div className="section-header">
                        <h3>Personal Information</h3>
                        {!isEditing && (
                            <button
                                className="edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                ✏️ Edit
                            </button>
                        )}
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={true} // Email cannot be changed
                                placeholder="Your email address"
                            />
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your weight"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your height"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Basic Health Information</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your age"
                                min="1"
                                max="120"
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Activity Level</label>
                            <select
                                name="activityLevel"
                                value={formData.activityLevel}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
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

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Medical Information</h3>
                    </div>

                    <div className="form-group full-width">
                        <label>Medical Conditions</label>
                        <textarea
                            name="medicalConditions"
                            value={formData.medicalConditions}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="List any medical conditions, allergies, or medications..."
                            rows="4"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Current Medications</label>
                        <textarea
                            name="medications"
                            value={Array.isArray(formData.medications) ? formData.medications.join(', ') : formData.medications}
                            onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value.split(',').map(m => m.trim()).filter(m => m) }))}
                            disabled={!isEditing}
                            placeholder="List your current medications (separated by commas)"
                            rows="3"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Allergies</label>
                        <textarea
                            name="allergies"
                            value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies}
                            onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a) }))}
                            disabled={!isEditing}
                            placeholder="List your allergies (separated by commas)"
                            rows="3"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Previous Surgeries</label>
                        <textarea
                            name="surgeries"
                            value={Array.isArray(formData.surgeries) ? formData.surgeries.join(', ') : formData.surgeries}
                            onChange={(e) => setFormData(prev => ({ ...prev, surgeries: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                            disabled={!isEditing}
                            placeholder="List any previous surgeries (separated by commas)"
                            rows="3"
                        />
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Lifestyle & Habits</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Smoking Status</label>
                            <select
                                name="smokingStatus"
                                value={formData.smokingStatus}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select smoking status</option>
                                <option value="never">Never smoked</option>
                                <option value="former">Former smoker</option>
                                <option value="current">Current smoker</option>
                                <option value="occasional">Occasional smoker</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Alcohol Consumption</label>
                            <select
                                name="alcoholConsumption"
                                value={formData.alcoholConsumption}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select alcohol consumption</option>
                                <option value="none">None</option>
                                <option value="occasional">Occasional (1-2 drinks/week)</option>
                                <option value="moderate">Moderate (3-7 drinks/week)</option>
                                <option value="heavy">Heavy (8+ drinks/week)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Exercise Frequency</label>
                            <select
                                name="exerciseFrequency"
                                value={formData.exerciseFrequency}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select exercise frequency</option>
                                <option value="never">Never</option>
                                <option value="rarely">Rarely (1-2 times/month)</option>
                                <option value="sometimes">Sometimes (1-2 times/week)</option>
                                <option value="regular">Regular (3-4 times/week)</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Average Sleep Hours</label>
                            <select
                                name="sleepHours"
                                value={formData.sleepHours}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
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

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Dietary Preferences</h3>
                    </div>

                    <div className="form-group full-width">
                        <label>Dietary Restrictions</label>
                        <div className="tag-selector">
                            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Low-Sodium', 'Halal', 'Kosher'].map(diet => (
                                <button
                                    key={diet}
                                    type="button"
                                    className={`tag ${formData.dietaryRestrictions.includes(diet) ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (!isEditing) return;
                                        const newRestrictions = formData.dietaryRestrictions.includes(diet)
                                            ? formData.dietaryRestrictions.filter(d => d !== diet)
                                            : [...formData.dietaryRestrictions, diet];
                                        setFormData(prev => ({ ...prev, dietaryRestrictions: newRestrictions }));
                                    }}
                                    disabled={!isEditing}
                                >
                                    {diet}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Food Allergies</label>
                        <textarea
                            name="foodAllergies"
                            value={Array.isArray(formData.foodAllergies) ? formData.foodAllergies.join(', ') : formData.foodAllergies}
                            onChange={(e) => setFormData(prev => ({ ...prev, foodAllergies: e.target.value.split(',').map(f => f.trim()).filter(f => f) }))}
                            disabled={!isEditing}
                            placeholder="List any food allergies (separated by commas)"
                            rows="3"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Preferred Cuisines</label>
                        <div className="tag-selector">
                            {['Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Mediterranean', 'American', 'Thai', 'French', 'Greek'].map(cuisine => (
                                <button
                                    key={cuisine}
                                    type="button"
                                    className={`tag ${formData.preferredCuisine.includes(cuisine) ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (!isEditing) return;
                                        const newCuisines = formData.preferredCuisine.includes(cuisine)
                                            ? formData.preferredCuisine.filter(c => c !== cuisine)
                                            : [...formData.preferredCuisine, cuisine];
                                        setFormData(prev => ({ ...prev, preferredCuisine: newCuisines }));
                                    }}
                                    disabled={!isEditing}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Health Goals</h3>
                    </div>

                    <div className="form-group full-width">
                        <label>Health Goals</label>
                        <div className="tag-selector">
                            {['Lose Weight', 'Gain Weight', 'Maintain Weight', 'Build Muscle', 'Improve Fitness', 'Better Sleep', 'Reduce Stress', 'Manage Diabetes', 'Lower Blood Pressure', 'Improve Mental Health'].map(goal => (
                                <button
                                    key={goal}
                                    type="button"
                                    className={`tag ${formData.healthGoals.includes(goal) ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (!isEditing) return;
                                        const newGoals = formData.healthGoals.includes(goal)
                                            ? formData.healthGoals.filter(g => g !== goal)
                                            : [...formData.healthGoals, goal];
                                        setFormData(prev => ({ ...prev, healthGoals: newGoals }));
                                    }}
                                    disabled={!isEditing}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Target Weight (kg)</label>
                            <input
                                type="number"
                                name="weightGoal"
                                value={formData.weightGoal}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter target weight"
                                min="30"
                                max="300"
                            />
                        </div>

                        <div className="form-group">
                            <label>Daily Calorie Target</label>
                            <input
                                type="number"
                                name="targetCalories"
                                value={formData.targetCalories}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter calorie target"
                                min="800"
                                max="5000"
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Mental Wellness</h3>
                    </div>

                    <div className="form-group">
                        <label>Stress Level</label>
                        <select
                            name="stressLevel"
                            value={formData.stressLevel}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select stress level</option>
                            <option value="low">Low stress</option>
                            <option value="moderate">Moderate stress</option>
                            <option value="high">High stress</option>
                            <option value="very-high">Very high stress</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Mental Health Conditions</label>
                        <div className="tag-selector">
                            {['Depression', 'Anxiety', 'ADHD', 'Bipolar Disorder', 'PTSD', 'OCD', 'Eating Disorders', 'None'].map(condition => (
                                <button
                                    key={condition}
                                    type="button"
                                    className={`tag ${formData.mentalHealthConditions.includes(condition) ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (!isEditing) return;
                                        const newConditions = formData.mentalHealthConditions.includes(condition)
                                            ? formData.mentalHealthConditions.filter(c => c !== condition)
                                            : [...formData.mentalHealthConditions, condition];
                                        setFormData(prev => ({ ...prev, mentalHealthConditions: newConditions }));
                                    }}
                                    disabled={!isEditing}
                                >
                                    {condition}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Family History</h3>
                    </div>

                    <div className="form-group full-width">
                        <label>Family History of Conditions</label>
                        <div className="tag-selector">
                            {['Diabetes', 'Heart Disease', 'Cancer', 'High Blood Pressure', 'Obesity', 'Depression', 'Anxiety', 'Alzheimer\'s', 'Stroke', 'None'].map(condition => (
                                <button
                                    key={condition}
                                    type="button"
                                    className={`tag ${formData.familyHistory.includes(condition) ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (!isEditing) return;
                                        const newHistory = formData.familyHistory.includes(condition)
                                            ? formData.familyHistory.filter(c => c !== condition)
                                            : [...formData.familyHistory, condition];
                                        setFormData(prev => ({ ...prev, familyHistory: newHistory }));
                                    }}
                                    disabled={!isEditing}
                                >
                                    {condition}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Emergency Contact</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Contact Name</label>
                            <input
                                type="text"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Relationship</label>
                            <input
                                type="text"
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="e.g., Spouse, Parent"
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="emergencyContact.phone"
                                value={formData.emergencyContact.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="emergencyContact.email"
                                value={formData.emergencyContact.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Email address"
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Caregiver Settings</h3>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="shareWithCaregiver"
                                checked={formData.shareWithCaregiver}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                            Share health data with caregiver
                        </label>
                    </div>

                    {formData.shareWithCaregiver && (
                        <div className="form-group">
                            <label>Caregiver Email</label>
                            <input
                                type="email"
                                name="caregiverEmail"
                                value={formData.caregiverEmail}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Caregiver's email address"
                            />
                        </div>
                    )}
                </div>

                {isEditing && (
                    <div className="action-buttons">
                        <button
                            className="save-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : '💾 Save Changes'}
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            ❌ Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
