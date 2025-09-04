import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Signup.css';

// Animation configuration using individual frame files - EXACT SAME AS LOGIN
const animations = {
  celebrate: {
    frames: ['capy_celebrate_000.png', 'capy_celebrate_001.png', 'capy_celebrate_002.png', 'capy_celebrate_003.png', 'capy_celebrate_004.png', 'capy_celebrate_005.png'],
    fps: 3
  },
  eat: {
    frames: ['capy_eat_000.png', 'capy_eat_001.png', 'capy_eat_002.png', 'capy_eat_003.png'],
    fps: 3
  },
  idle: {
    frames: ['capy_idle_000.png', 'capy_idle_001.png', 'capy_idle_002.png', 'capy_idle_003.png'],
    fps: 2
  },
  sick: {
    frames: ['capy_sick_000.png', 'capy_sick_001.png', 'capy_sick_002.png'],
    fps: 2
  },
  walk: {
    frames: ['capy_walk_000.png', 'capy_walk_001.png', 'capy_walk_002.png', 'capy_walk_003.png', 'capy_walk_004.png', 'capy_walk_005.png'],
    fps: 4
  }
};

// CapyAnimation Component using individual frames - EXACT SAME AS LOGIN
const CapyAnimation = ({ 
  state = 'idle', 
  size = 128, 
  className = '' 
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedFrames, setLoadedFrames] = useState(new Set());
  
  const currentAnimation = animations[state] || animations.idle;

  // Preload all frames for the current animation
  useEffect(() => {
    const loadFrames = async () => {
      const newLoadedFrames = new Set();
      
      for (const frame of currentAnimation.frames) {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `/frames_resized/${frame}`;
          });
          newLoadedFrames.add(frame);
        } catch (error) {
          console.error(`Failed to load frame: ${frame}`, error);
        }
      }
      
      setLoadedFrames(newLoadedFrames);
      setIsLoaded(newLoadedFrames.size === currentAnimation.frames.length);
    };

    loadFrames();
  }, [currentAnimation.frames]);

  // Animation loop
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % currentAnimation.frames.length);
    }, 1000 / currentAnimation.fps);

    return () => clearInterval(interval);
  }, [isLoaded, currentAnimation.fps, currentAnimation.frames.length]);

  // Reset frame when state changes
  useEffect(() => {
    setCurrentFrame(0);
  }, [state]);

  const currentFramePath = `/frames_resized/${currentAnimation.frames[currentFrame]}`;

  return (
    <img
      src={currentFramePath}
      alt={`Capybara ${state} animation`}
      width={size}
      height={size}
      className={className}
      style={{
        imageRendering: 'pixelated',
        imageRendering: '-moz-crisp-edges',
        imageRendering: 'crisp-edges',
        border: 'none',
        background: 'transparent',
        borderRadius: '0',
        transition: 'none'
      }}
    />
  );
};

function Signup({ onSwitchToLogin, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        dateOfBirth: '',
        weight: '',
        height: '',
        medicalConditions: '',
        shareWithCaregiver: false,
        caregiverEmail: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const validatePasswords = () => {
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            return 'Passwords do not match.';
        }
        if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
            return 'Password must be at least 6 characters long.';
        }
        return '';
    };
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setError('');
        console.log('Form submitted, current step:', currentStep);
        console.log('Form data:', formData);

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            console.log('Password mismatch error');
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 6) {
            console.log('Password too short error');
            setError('Password must be at least 6 characters long.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            console.log('Invalid email error');
            setError('Please enter a valid email address.');
            return;
        }

        // Validate required fields for current step
        if (currentStep === 0) {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                console.log('Missing required fields error');
                setError('Please fill in all required fields.');
                return;
            }
        }

        if (currentStep === 1) {
            if (!formData.fullName || !formData.dateOfBirth || !formData.weight || !formData.height) {
                console.log('Missing profile fields error');
                setError('Please fill in all required fields.');
                return;
            }
        }

        console.log('All validations passed, proceeding to next step');
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            // Final step - create account
            setIsLoading(true);
            setError('');

            try {
                console.log('Starting Firebase authentication...');

                // Create user with Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                const user = userCredential.user;
                console.log('Firebase user created:', user);

                // Store user data in Firestore
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    fullName: formData.fullName,
                    dateOfBirth: formData.dateOfBirth,
                    weight: parseFloat(formData.weight),
                    height: parseFloat(formData.height),
                    medicalConditions: formData.medicalConditions,
                    shareWithCaregiver: formData.shareWithCaregiver,
                    caregiverEmail: formData.caregiverEmail,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    profileComplete: false, // Will be set to true after health form
                    healthFormComplete: false
                };

                console.log('Storing user data in Firestore:', userData);

                // Create user document in Firestore
                await setDoc(doc(db, 'users', user.uid), userData);

                console.log('User data stored successfully in Firestore');
                console.log('Calling onComplete callback...');

                // Call onComplete with user data
                if (onComplete) {
                    console.log('onComplete function exists, calling it...');
                    onComplete({
                        uid: user.uid,
                        email: user.email,
                        fullName: formData.fullName,
                        dateOfBirth: formData.dateOfBirth,
                        weight: formData.weight,
                        height: formData.height,
                        medicalConditions: formData.medicalConditions,
                        shareWithCaregiver: formData.shareWithCaregiver,
                        caregiverEmail: formData.caregiverEmail
                    });
                    console.log('onComplete callback executed');
                } else {
                    console.log('onComplete callback not provided');
                }


            } catch (err) {
                console.error('Signup error details:', err);
                console.error('Error code:', err.code);
                console.error('Error message:', err.message);

                if (err.code === 'auth/email-already-in-use') {
                    setError('An account with this email already exists.');
                } else if (err.code === 'auth/invalid-email') {
                    setError('Please enter a valid email address.');
                } else if (err.code === 'auth/weak-password') {
                    setError('Password is too weak. Please choose a stronger password.');
                } else if (err.code === 'auth/network-request-failed') {
                    setError('Network error. Please check your internet connection.');
                } else {
                    setError(`Failed to create account: ${err.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const steps = [
        {
            title: "Welcome to Aura Health!",
            subtitle: "Let's get started with your wellness journey",
            type: "welcome"
        },
        {
            title: "Tell us about yourself",
            subtitle: "Help us personalize your experience",
            type: "profile"
        },
        {
            title: "Health Profile",
            subtitle: "Review and confirm your information",
            type: "review"
        }
    ];

    const renderWelcomeStep = () => {
        const passwordError = validatePasswords();

        return (
            <div className="step-content">
                <div className="capybara-illustration">
                    <CapyAnimation
                        state="idle"
                        size={128}
                        className="capybara-sprite"
                    />
                </div>

                <div className="form-fields">
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email Address"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm Password"
                            className="form-input"
                            required
                        />
                    </div>

                    {passwordError && (
                        <div className="error-message">
                            {passwordError}
                        </div>
                    )}
                </div>

                <div className="welcome-actions">
                    <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="primary-button"
                        disabled={!formData.email || !formData.password || !formData.confirmPassword || !!passwordError}
                    >
                        Create Account
                    </button>
                    <p className="login-link">
                        Already have account? <button type="button" onClick={onSwitchToLogin} className="link-button">Log In</button>
                    </p>
                </div>
            </div>
        );
    };

    const renderProfileStep = () => (
        <div className="step-content">
            <div className="capybara-illustration">
                <CapyAnimation
                    state="eat"
                    size={128}
                    className="capybara-sprite"
                />
            </div>

            <div className="form-fields">
                <div className="form-group">
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        placeholder="Date of Birth"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Weight (kg)"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="Height (cm)"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleInputChange}
                        placeholder="Medical Conditions (e.g., Hypertension)"
                        className="form-input"
                    />
                </div>

                <div className="toggle-group">
                    <label className="toggle-label">
                        <span>Share with Caregiver/Family</span>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                name="shareWithCaregiver"
                                checked={formData.shareWithCaregiver}
                                onChange={handleInputChange}
                                className="toggle-input"
                            />
                            <span className="toggle-slider"></span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="step-actions">
                <button type="button" onClick={handleBack} className="secondary-button">
                    Back
                </button>
                <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="primary-button"
                    disabled={!formData.fullName || !formData.dateOfBirth || !formData.weight || !formData.height}
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );

    const renderReviewStep = () => (
        <div className="step-content">
            <div className="capybara-illustration">
                <CapyAnimation
                    state="celebrate"
                    size={128}
                    className="capybara-sprite"
                />
            </div>

            <div className="review-fields">
                <div className="review-group">
                    <label>Full Name</label>
                    <div className="review-value">{formData.fullName || 'Not provided'}</div>
                </div>

                <div className="review-group">
                    <label>Date of Birth</label>
                    <div className="review-value">{formData.dateOfBirth || 'Not provided'}</div>
                </div>

                <div className="review-group">
                    <label>Weight</label>
                    <div className="review-value">{formData.weight ? `${formData.weight} kg` : 'Not provided'}</div>
                </div>

                <div className="review-group">
                    <label>Height</label>
                    <div className="review-value">{formData.height ? `${formData.height} cm` : 'Not provided'}</div>
                </div>

                <div className="review-group">
                    <label>Medical Conditions</label>
                    <div className="review-value">{formData.medicalConditions || 'None specified'}</div>
                </div>

                <div className="review-group">
                    <label>Share with Caregiver</label>
                    <div className="review-value">{formData.shareWithCaregiver ? 'Yes' : 'No'}</div>
                </div>

                {formData.shareWithCaregiver && (
                    <div className="form-group">
                        <input
                            type="email"
                            name="caregiverEmail"
                            value={formData.caregiverEmail}
                            onChange={handleInputChange}
                            placeholder="Caregiver Email"
                            className="form-input"
                        />
                    </div>
                )}
            </div>

            <div className="step-actions">
                <button type="button" onClick={handleBack} className="secondary-button">
                    Back
                </button>
                <button type="submit" className="primary-button" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Complete Setup'}
                </button>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return renderWelcomeStep();
            case 1:
                return renderProfileStep();
            case 2:
                return renderReviewStep();
            default:
                return renderWelcomeStep();
        }
    };

    return (
        <div className="multi-step-container">
            <div className="steps-header">
                <div className="steps-indicator">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`step-indicator ${index <= currentStep ? 'active' : ''}`}
                        >
                            <div className="step-number">{index + 1}</div>
                            <div className="step-title">{step.title}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="main-content">
                <div className="content-card">
                    <div className="card-header">
                        <h1 className="card-title">{steps[currentStep].title}</h1>
                        <p className="card-subtitle">{steps[currentStep].subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="step-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        {console.log('Error state:', error)}
                        {renderStepContent()}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;