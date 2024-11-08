// src/contexts/TimetableContext.js
import React, { createContext, useState } from 'react';

// Create Timetable Context
export const TimetableContext = createContext();

const TimetableProvider = ({ children }) => {
    const [personalTimetable, setPersonalTimetable] = useState([]);
    const [classTimetable, setClassTimetable] = useState([]);

    // Add task to the appropriate timetable (Personal or Class)
    const addTimetableTask = (task, timetableType) => {
        const taskWithId = { ...task, id: Date.now() }; // Add unique ID to the task
        if (timetableType === 'Personal') {
            setPersonalTimetable([...personalTimetable, taskWithId]);
        } else {
            setClassTimetable([...classTimetable, taskWithId]);
        }
    };

    // Update a task in the timetable (used for editing tasks)
    const updateTimetableTask = (taskId, updatedTask, timetableType) => {
        const updatedTaskWithId = { ...updatedTask, id: taskId }; // Preserve the original task ID
        if (timetableType === 'Personal') {
            setPersonalTimetable(personalTimetable.map(task => task.id === taskId ? updatedTaskWithId : task));
        } else {
            setClassTimetable(classTimetable.map(task => task.id === taskId ? updatedTaskWithId : task));
        }
    };

    // Remove task from the timetable (Personal or Class)
    const removeTimetableTask = (taskId, timetableType) => {
        if (timetableType === 'Personal') {
            setPersonalTimetable(personalTimetable.filter(task => task.id !== taskId));
        } else {
            setClassTimetable(classTimetable.filter(task => task.id !== taskId));
        }
    };

    return (
        <TimetableContext.Provider value={{
            personalTimetable,
            classTimetable,
            addTimetableTask,
            updateTimetableTask,
            removeTimetableTask
        }}>
            {children}
        </TimetableContext.Provider>
    );
};

// Export TimetableProvider as the default export
export default TimetableProvider;