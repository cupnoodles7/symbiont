import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Login.css';

function Login({ onSwitchToSignup, onComplete }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Firebase authentication
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;
            console.log('Login successful:', user);

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            let userData = {};

            if (userDoc.exists()) {
                userData = userDoc.data();
                console.log('User data from Firestore:', userData);

                // Update last login time
                await updateDoc(doc(db, 'users', user.uid), {
                    lastLoginAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            } else {
                console.log('User document not found in Firestore');
            }

            // Call onComplete with user data
            if (onComplete) {
                onComplete({
                    uid: user.uid,
                    email: user.email,
                    ...userData
                });
            }

        } catch (err) {
            console.error('Login error:', err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="card-header">
                    <h1 className="card-title">Welcome Back!</h1>
                    <p className="card-subtitle">Sign in to your CapyCare account</p>
                </div>

                <div className="capybara-illustration">
                    <img
                        src="cappy.png"
                        alt="Capybara"
                        className="capybara-image"
                    />
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>

                    <div className="toggle-mode">
                        <p className="toggle-text">
                            Don't have an account?
                            <button type="button" onClick={onSwitchToSignup} className="link-button">
                                Sign Up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
