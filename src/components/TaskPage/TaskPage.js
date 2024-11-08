import React, { useState, useContext } from 'react';
import { TaskContext } from '../../contexts/TaskContext';
import './TaskPage.css';

const TaskPage = () => {
    const { tasks, addTask, toggleTaskCompletion } = useContext(TaskContext);
    const [newTask, setNewTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Check if the task is expired
    const isExpired = (task) => {
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        return !task.completed && taskDate < today;
    };

    const handleAddTask = () => {
        if (newTask.trim() && dueDate) {
            addTask({
                id: tasks.length + 1,
                title: newTask,
                completed: false,
                dueDate: dueDate,
            });
            setNewTask('');
            setDueDate('');
        }
    };

    const toggleView = () => {
        setShowCompleted(!showCompleted);
    };

    return (
        <div className="task-page">
            <h2>Tasks</h2>

            <div className="task-controls">
                <button onClick={toggleView} className="toggle-button">
                    {showCompleted ? 'Show Upcoming Tasks' : 'Show Completed Tasks'}
                </button>
                <button onClick={() => setShowForm(!showForm)} className="add-task-button">
                    {showForm ? 'Close' : 'Add Task'}
                </button>
            </div>

            {showForm && (
                <div className="task-form">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="New task"
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <button onClick={handleAddTask}>Add Task</button>
                </div>
            )}

            <h3>{showCompleted ? 'Completed Tasks' : 'Upcoming Tasks'}</h3>
            <ul className="tasks-list">
                {tasks
                    .filter(task => task.completed === showCompleted || (!showCompleted && isExpired(task)))
                    .map(task => (
                        <li key={task.id} className="task-item">
                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.title}
                            </span>
                            {task.dueDate && (
                                <span className="due-date">
                                    {isExpired(task) ? ' (Expired)' : ` (Due: ${task.dueDate})`}
                                </span>
                            )}
                            <button onClick={() => toggleTaskCompletion(task.id)}>
                                {task.completed ? 'Undo' : 'Complete'}
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default TaskPage;
