// src/screens/FirstPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../firebase'; // Import Firebase functions
import { FaHome, FaUser } from 'react-icons/fa'; // Correct import for FontAwesome icons
import './FirstPage.css'; // Import CSS for styling

function FirstPage() {
    const navigate = useNavigate();

    const handleContinue = async () => {
        try {
            // Sign in with Google using Firebase
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get the ID token from Firebase and send it to the backend
            const token = await user.getIdToken();
            await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            });

            // Store user name in localStorage
            localStorage.setItem("userName", user.displayName);

            // Redirect to the Dashboard after successful login
            navigate('/dashboard');
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    return (
        <div className="first-page">
            <h1 className="app-name">StudyPal</h1>
            <p className="tagline">Your Ultimate Study Companion, Anytime, Anywhere</p>
            <button className="continue-button" onClick={handleContinue}>
                Continue with Google
            </button>
        </div>
    );
}

export default FirstPage;
