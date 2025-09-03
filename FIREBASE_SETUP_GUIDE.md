# 🔥 Firebase & Firestore Setup Guide

## Step 1: Firebase Console Setup

### 1.1 Create/Select Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Select your existing project or create a new one

### 1.2 Enable Firestore Database
1. In left sidebar, click **"Firestore Database"**
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (for development)
4. Select **location** (closest to your users)
5. Click **"Enable"**

### 1.3 Set Security Rules
1. In Firestore Database, click **"Rules"** tab
2. Replace with these rules:
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
3. Click **"Publish"**

## Step 2: Get Firebase Config

### 2.1 Project Settings
1. Click **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll to **"Your apps"** section

### 2.2 Add Web App (if needed)
1. Click **"Add app"** → **"Web"**
2. Register app with a nickname
3. Copy the config values

### 2.3 Config Values Needed
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 3: Environment Variables

### 3.1 Create .env File
Create `client/.env` file with:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3.2 Replace Values
Replace `your_*` values with actual values from Firebase Console.

## Step 4: Enable Authentication

### 4.1 Enable Email/Password Auth
1. In Firebase Console, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

## Step 5: Test Setup

### 5.1 Start Your App
```bash
cd client
npm run dev
```

### 5.2 Test Signup
1. Go to your app
2. Try to create a new account
3. Check Firebase Console → Firestore Database
4. You should see a new document in `users` collection

## 🔍 Verification Checklist

- [ ] Firestore Database created
- [ ] Security rules published
- [ ] Web app added to Firebase project
- [ ] Environment variables set
- [ ] Authentication enabled
- [ ] App can create users in Firestore

## 🚨 Common Issues

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check your API key in `.env` file

### Issue: "Missing or insufficient permissions"
**Solution**: Check Firestore security rules

### Issue: "Firestore is not enabled"
**Solution**: Enable Firestore Database in Firebase Console

## 📊 Database Structure

After setup, your Firestore will have:
- **Collection**: `users`
- **Document ID**: User's Firebase Auth UID
- **Fields**: Profile data, health data, timestamps

## 🎯 Next Steps

1. Complete the setup steps above
2. Test signup/login flow
3. Verify data appears in Firestore Console
4. Check that health form data is stored
