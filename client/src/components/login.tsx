import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import CapyCanvas from './CapyCanvas';
import './Login.css';


// Main Login Component
interface LoginProps {
  onComplete?: (userData: any) => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }

    if (!isLoginMode) {
      if (!formData.name) {
        setError('Please enter your name.');
        return false;
      }
      if (!formData.confirmPassword) {
        setError('Please confirm your password.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      let userCredential;
      
      if (isLoginMode) {
        // Login
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        // Signup
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        });
      }

      const user = userCredential.user;
      console.log(`${isLoginMode ? 'Login' : 'Signup'} successful:`, user);

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

    } catch (err: any) {
      console.error(`${isLoginMode ? 'Login' : 'Signup'} error:`, err);
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError(`${isLoginMode ? 'Login' : 'Signup'} failed. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <h1 className="card-title">
            {isLoginMode ? 'Welcome Back!' : 'Join CapyCare!'}
          </h1>
          <p className="card-subtitle">
            {isLoginMode 
              ? 'Sign in to your CapyCare account' 
              : 'Create your account to start caring for your capybara'
            }
          </p>
        </div>

        <div className="capybara-illustration">
          <CapyCanvas 
            state="idle" 
            size={128}
            className="capybara-sprite"
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-fields">
            {!isLoginMode && (
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="form-input"
                  required={!isLoginMode}
                  disabled={isLoading}
                />
              </div>
            )}

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

            {!isLoginMode && (
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="form-input"
                  required={!isLoginMode}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={isLoading}
            >
              {isLoading 
                ? (isLoginMode ? 'Signing In...' : 'Creating Account...') 
                : (isLoginMode ? 'Sign In' : 'Create Account')
              }
            </button>
          </div>

          <div className="toggle-mode">
            <p className="toggle-text">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button" 
                onClick={toggleMode} 
                className="link-button"
                disabled={isLoading}
              >
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
