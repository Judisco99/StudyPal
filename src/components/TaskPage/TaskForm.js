import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = {
            id: Date.now(),
            name: taskName,
            dueDate: dueDate,
            completed: false
        };
        addTask(newTask);
        setTaskName('');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input 
                type="text" 
                placeholder="Task name" 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
                required 
            />
            <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                required 
            />
            <button type="submit" className="add-task-button">Add Task</button>
        </form>
    );
};

export default TaskForm;
