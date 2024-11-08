// src/components/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { FaClock, FaCheck, FaCalendarAlt, FaTasks, FaBullseye, FaFire } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { StudyContext } from '../contexts/StudyContext';
import { TaskContext } from '../contexts/TaskContext';
import { TimetableContext } from '../contexts/TimetableContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import './Dashboard.css';

const Dashboard = ({ dailyGoal = 2, weeklyGoal = 10 }) => {
    const { todayStudyTime, weekStudyTime } = useContext(StudyContext);
    const { tasks } = useContext(TaskContext);
    const { personalTimetable, classTimetable } = useContext(TimetableContext);
    const { currentUser } = useAuth(); // Get currentUser from AuthContext
    const navigate = useNavigate();

    // State variables
    const [showUpcomingTasks, setShowUpcomingTasks] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [todayTimetableTasks, setTodayTimetableTasks] = useState([]);
    const [streak, setStreak] = useState(0);

    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    const completedTasks = tasks.filter(task => task.completed);
    const upcomingTasks = tasks.filter(task => !task.completed);
    const dailyProgress = (todayStudyTime / dailyGoal) * 100;
    const weeklyProgress = (weekStudyTime / weeklyGoal) * 100;

    // Load timetable tasks and update streak
    useEffect(() => {
        const todaysPersonalTasks = personalTimetable.filter(task => task.day === today);
        const todaysClassTasks = classTimetable.filter(task => task.day === today);
        setTodayTimetableTasks([...todaysPersonalTasks, ...todaysClassTasks]);

        const savedStreak = parseInt(localStorage.getItem('streak'), 10) || 0;
        setStreak(savedStreak);

        if (dailyProgress >= 100 && todayStudyTime >= dailyGoal) {
            const newStreak = savedStreak + 1;
            setStreak(newStreak);
            localStorage.setItem('streak', newStreak);
        }

        const checkTime = () => {
            const now = new Date();
            if (now.getHours() === 6 && now.getMinutes() === 0) {
                const notificationMessage = todaysPersonalTasks.concat(todaysClassTasks)
                    .map(task => `${task.course} at ${task.time}`)
                    .join('\n');
                if (notificationMessage) alert(`Today's Timetable:\n${notificationMessage}`);
            }
        };
        const intervalId = setInterval(checkTime, 60000);
        return () => clearInterval(intervalId);
    }, [dailyProgress, todayStudyTime, personalTimetable, classTimetable, today]);

    // Calculate progress color
    const getProgressColor = (progress) => progress < 50 ? 'red' : progress < 80 ? 'yellow' : 'green';

    // Show alert when daily or weekly goal is reached
    useEffect(() => {
        if (dailyProgress >= 100) {
            alert("Congratulations! You've reached your daily study goal!");
        }
        if (weeklyProgress >= 100) {
            alert("Congratulations! You've reached your weekly study goal!");
        }
    }, [dailyProgress, weeklyProgress]);

    // Navigate to add task page
    const handleAddTask = () => navigate('/tasks');

    return (
        <div className="dashboard">
            <h2>Welcome, {currentUser ? currentUser.displayName || "User" : "Guest"}</h2>
            <p className="streak-counter"><FaFire /> Study Streak: {streak} days</p>

            <div className="dashboard-item">
                <button className="study-now-button" onClick={() => navigate('/study-now')}>Study Now</button>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-item">
                    <FaClock className="icon" />
                    <h3>Today's Study Time</h3>
                    <p>{todayStudyTime.toFixed(2)} hour(s)</p>
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{
                                width: `${dailyProgress}%`,
                                backgroundColor: getProgressColor(dailyProgress)
                            }}
                        ></div>
                    </div>
                    <p className="goal-text">{dailyGoal} hours goal</p>
                </div>

                <div className="dashboard-item">
                    <FaClock className="icon" />
                    <h3>This Week's Study Time</h3>
                    <p>{weekStudyTime.toFixed(2)} hours</p>
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{
                                width: `${weeklyProgress}%`,
                                backgroundColor: getProgressColor(weeklyProgress)
                            }}
                        ></div>
                    </div>
                    <p className="goal-text">{weeklyGoal} hours goal</p>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-item">
                    <FaCheck className="icon" />
                    <h3>Completed Tasks</h3>
                    <p>{completedTasks.length} tasks</p>
                    <button onClick={() => setShowCompletedTasks(!showCompletedTasks)}>
                        {showCompletedTasks ? "Hide Tasks" : "View Tasks"}
                    </button>
                    {showCompletedTasks && (
                        <div className="tasks-list">
                            {completedTasks.map(task => (
                                <p key={task.id}>{task.title}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-item">
                    <FaTasks className="icon" />
                    <h3>Upcoming Tasks</h3>
                    <p>{upcomingTasks.length + todayTimetableTasks.length} tasks</p>
                    <button onClick={() => setShowUpcomingTasks(!showUpcomingTasks)}>
                        {showUpcomingTasks ? "Hide Tasks" : "View Tasks"}
                    </button>
                    {showUpcomingTasks && (
                        <div className="tasks-list">
                            {upcomingTasks.map(task => (
                                <p key={task.id}>{task.title}</p>
                            ))}
                            {todayTimetableTasks.map((task, index) => (
                                <p key={`timetable-task-${index}`}>{task.course} at {task.time} (Timetable)</p>
                            ))}
                        </div>
                    )}
                    <button onClick={handleAddTask} className="add-task-button">Add Task</button>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-item timetable">
                    <FaCalendarAlt className="icon" />
                    <h3>Timetable</h3>
                    <p><span className="timetable-link" onClick={() => navigate('/timetable')}>View/Edit</span></p>
                </div>
                
                <div className="dashboard-item">
                    <FaBullseye className="icon" />
                    <h3>Set Study Goal</h3>
                    <button onClick={() => navigate('/set-goal')}>Set Goal</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;