// src/contexts/TaskContext.js
import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
        // Add more tasks as needed
    ]);

    // Add task function
    const addTask = (task) => setTasks([...tasks, task]);

    // Toggle task completion
    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion }}>
            {children}
        </TaskContext.Provider>
    );
};
