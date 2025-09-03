import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyDNSy_MRASKCdiHCA9N3KsJkimQUnS8SFE",
    authDomain: "cappy-happy-ae5e3.firebaseapp.com",
    projectId: "cappy-happy-ae5e3",
    storageBucket: "cappy-happy-ae5e3.firebasestorage.app",
    messagingSenderId: "61677299459",
    appId: "1:61677299459:web:47e7aed2a69997a642ab36",
    measurementId: "G-6D5RD5HFXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
