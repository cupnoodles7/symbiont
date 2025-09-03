# 🔥 Firestore Database Structure

## 📊 Collections

### `users` Collection
Stores user profile and health information.

**Document ID**: `{user.uid}` (Firebase Auth UID)

**Fields**:
```javascript
{
  // Basic Profile
  uid: string,
  email: string,
  fullName: string,
  dateOfBirth: string,
  weight: number,
  height: number,
  medicalConditions: string,
  shareWithCaregiver: boolean,
  caregiverEmail: string,
  
  // Timestamps
  createdAt: string, // ISO date string
  updatedAt: string, // ISO date string
  lastLoginAt: string, // ISO date string
  
  // Completion Status
  profileComplete: boolean,
  healthFormComplete: boolean,
  
  // Detailed Health Data (from HealthForm)
  healthData: {
    // Basic Health Info
    age: number,
    gender: string,
    activityLevel: string,
    
    // Medical History
    medicalConditions: string[],
    medications: string[],
    allergies: string[],
    surgeries: string[],
    
    // Lifestyle
    smokingStatus: string,
    alcoholConsumption: string,
    exerciseFrequency: string,
    sleepHours: string,
    
    // Dietary Preferences
    dietaryRestrictions: string[],
    foodAllergies: string[],
    preferredCuisine: string[],
    
    // Goals
    healthGoals: string[],
    weightGoal: string,
    targetCalories: string,
    
    // Mental Health
    stressLevel: string,
    mentalHealthConditions: string[],
    
    // Family History
    familyHistory: string[],
    
    // Emergency Contact
    emergencyContact: {
      name: string,
      relationship: string,
      phone: string,
      email: string
    },
    
    // Timestamps
    completedAt: string, // ISO date string
    updatedAt: string // ISO date string
  }
}
```

## 🔄 Data Flow

1. **Signup**: Creates user document in `users` collection
2. **Health Form**: Updates user document with `healthData` field
3. **Login**: Updates `lastLoginAt` timestamp
4. **App State**: UserContext provides access to user data throughout the app

## 🛡️ Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Usage Examples

### Get User Data
```javascript
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { userData } = useUser();
  
  if (userData?.healthData) {
    console.log('User health goals:', userData.healthData.healthGoals);
  }
}
```

### Update User Data
```javascript
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { updateUserData } = useUser();
  
  const updateWeight = (newWeight) => {
    updateUserData({ weight: newWeight });
  };
}
```
