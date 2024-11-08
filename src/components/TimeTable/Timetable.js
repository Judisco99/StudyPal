import React, { useState, useContext } from 'react';
import { TimetableContext } from '../../contexts/TimetableContext'; // Import the context
import './Timetable.css';

const Timetable = () => {
    const { personalTimetable, classTimetable, addTimetableTask } = useContext(TimetableContext); // Use the context
    const [timetableType, setTimetableType] = useState('Personal');
    const [newTask, setNewTask] = useState({ day: '', course: '', time: '' });

    const handleTimetableTypeChange = (type) => {
        setTimetableType(type);
    };

    const handleAddTask = () => {
        if (newTask.day && newTask.course && newTask.time) {
            addTimetableTask(newTask, timetableType); // Use the add function from context
            setNewTask({ day: '', course: '', time: '' });
        }
    };

    // Group tasks by day
    const groupByDay = (tasks) => {
        return tasks.reduce((acc, task) => {
            if (!acc[task.day]) acc[task.day] = [];
            acc[task.day].push(task);
            return acc;
        }, {});
    };

    const timetable = timetableType === 'Personal' ? personalTimetable : classTimetable;
    const groupedTimetable = groupByDay(timetable);

    return (
        <div className="timetable-container">
            <h2>Weekly Timetable</h2>
            <div className="timetable-section">
                <button 
                    onClick={() => handleTimetableTypeChange('Personal')}
                    className={`timetable-button ${timetableType === 'Personal' ? 'active' : ''}`}>
                    Personal Timetable
                </button>
                <button 
                    onClick={() => handleTimetableTypeChange('Class')}
                    className={`timetable-button ${timetableType === 'Class' ? 'active' : ''}`}>
                    Class Timetable
                </button>
            </div>

            <div className="add-task-form">
                <h3>Add {timetableType} Task</h3>
                <select 
                    value={newTask.day} 
                    onChange={(e) => setNewTask({ ...newTask, day: e.target.value })}
                    className="add-task-input">
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
                <input 
                    type="text" 
                    placeholder="Course/Subject" 
                    value={newTask.course} 
                    onChange={(e) => setNewTask({ ...newTask, course: e.target.value })} 
                    className="add-task-input"
                />
                <input 
                    type="time" 
                    value={newTask.time} 
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })} 
                    className="add-task-input"
                />
                <button className="add-task-button" onClick={handleAddTask}>Add Task</button>
            </div>

            <div className="timetable-list">
                <h3>{timetableType} Timetable</h3>
                <div className="timetable-grid">
                    {Object.keys(groupedTimetable).map((day) => (
                        <div key={day} className="timetable-day">
                            <h4>{day}</h4>
                            {groupedTimetable[day].map((task, index) => (
                                <div key={index} className="timetable-item">
                                    {task.course} at {task.time}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timetable;