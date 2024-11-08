// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import StudyNow from './components/StudyNow/StudyNow';
import TaskPage from './components/TaskPage/TaskPage';
import SetGoal from './components/SetGoal/SetGoal';
import Timetable from './components/TimeTable/Timetable';
import FirstPage from './screens/FirstPage';
import { StudyProvider } from './contexts/StudyContext';
import TimetableProvider from './contexts/TimetableContext';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

function App() {
    const [dailyGoal, setDailyGoal] = useState(2); // Initial daily goal in hours
    const [weeklyGoal, setWeeklyGoal] = useState(10); // Initial weekly goal in hours

    const handleGoalUpdate = (newDailyGoal, newWeeklyGoal) => {
        setDailyGoal(newDailyGoal);
        setWeeklyGoal(newWeeklyGoal);
    };

    return (
        <AuthProvider> {/* Wrap with AuthProvider */}
            <StudyProvider>
                <TimetableProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<FirstPage />} /> {/* First page route */}
                            <Route 
                                path="/dashboard" 
                                element={<Dashboard dailyGoal={dailyGoal} weeklyGoal={weeklyGoal} />} 
                            />
                            <Route path="/study-now" element={<StudyNow />} />
                            <Route path="/tasks" element={<TaskPage />} />
                            <Route 
                                path="/set-goal" 
                                element={<SetGoal dailyGoal={dailyGoal} weeklyGoal={weeklyGoal} onSave={handleGoalUpdate} />} 
                            />
                            <Route path="/timetable" element={<Timetable />} />
                        </Routes>
                    </Router>
                </TimetableProvider>
            </StudyProvider>
        </AuthProvider>
    );
}

export default App;