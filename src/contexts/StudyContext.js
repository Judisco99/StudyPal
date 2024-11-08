import React, { createContext, useState, useEffect } from 'react';

export const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
    const [todayStudyTime, setTodayStudyTime] = useState(0); // in hours
    const [weekStudyTime, setWeekStudyTime] = useState(0); // in hours

    // Helper function to get today's date string (for resetting daily progress)
    const getTodayDateString = () => new Date().toLocaleDateString();

    // Load initial study times and check date on mount
    useEffect(() => {
        const todayTime = parseFloat(localStorage.getItem('todayStudyTime')) || 0;
        const weekTime = parseFloat(localStorage.getItem('weekStudyTime')) || 0;
        const savedDate = localStorage.getItem('lastStudyDate');

        // If the saved date is today, use saved time; if not, reset today's study time
        if (savedDate === getTodayDateString()) {
            setTodayStudyTime(todayTime);
        } else {
            setTodayStudyTime(0);
            localStorage.setItem('todayStudyTime', 0); // reset storage if it's a new day
        }

        setWeekStudyTime(weekTime);
        localStorage.setItem('lastStudyDate', getTodayDateString()); // Save today's date to avoid repeated resets
    }, []);

    // Reset the week's study time at the start of each new week (e.g., Sunday)
    useEffect(() => {
        const savedWeekReset = localStorage.getItem('lastWeekReset');
        const currentDay = new Date().getDay();

        // If it is Sunday (day 0) and last reset was not today, reset weekly time
        if (currentDay === 0 && savedWeekReset !== getTodayDateString()) {
            setWeekStudyTime(0);
            localStorage.setItem('weekStudyTime', 0); // reset weekly time in storage
            localStorage.setItem('lastWeekReset', getTodayDateString()); // mark reset day
        }
    }, [todayStudyTime]); // Track weekly reset whenever today’s time updates

    // Update today's study time and persist in local storage
    const updateTodayStudyTime = (hours) => {
        const updatedToday = todayStudyTime + hours;
        setTodayStudyTime(updatedToday);
        localStorage.setItem('todayStudyTime', updatedToday);
    };

    // Update week's study time and persist in local storage
    const updateWeekStudyTime = (hours) => {
        const updatedWeek = weekStudyTime + hours;
        setWeekStudyTime(updatedWeek);
        localStorage.setItem('weekStudyTime', updatedWeek);
    };

    // Consolidated function to update both today and week study time
    const updateStudyTime = (hours) => {
        updateTodayStudyTime(hours);
        updateWeekStudyTime(hours);
    };

    return (
        <StudyContext.Provider value={{
            todayStudyTime,
            weekStudyTime,
            updateTodayStudyTime,
            updateWeekStudyTime,
            updateStudyTime
        }}>
            {children}
        </StudyContext.Provider>
    );
};

export default StudyProvider;