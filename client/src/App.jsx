// client/src/App.jsx
import React, { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import HealthForm from './components/HealthForm';
import HomeScreen from './components/HomeScreen';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('signup'); // 'signup', 'login', 'health-form', 'home'
  const [userData, setUserData] = useState(null);
  const [healthData, setHealthData] = useState(null);

  const handleSignupComplete = (userInfo) => {
    console.log('handleSignupComplete called with:', userInfo);
    setUserData(userInfo);
    console.log('Setting currentView to health-form');
    setCurrentView('health-form');
  };

  const handleHealthFormComplete = (healthInfo) => {
    setHealthData(healthInfo);
    setCurrentView('home');
  };

  const handleLoginComplete = (userInfo) => {
    setUserData(userInfo);
    setCurrentView('home');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return <Signup onSwitchToLogin={() => setCurrentView('login')} onComplete={handleSignupComplete} />;
      case 'login':
        return <Login onSwitchToSignup={() => setCurrentView('signup')} onComplete={handleLoginComplete} />;
      case 'health-form':
        return <HealthForm onComplete={handleHealthFormComplete} userData={userData} />;
      case 'home':
        return <HomeScreen userData={userData} healthData={healthData} />;
      default:
        return <Signup onSwitchToLogin={() => setCurrentView('login')} onComplete={handleSignupComplete} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;
