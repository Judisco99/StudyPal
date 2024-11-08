// SetGoal.js
import React, { useState } from 'react';
import './SetGoal.css';

const SetGoal = ({ dailyGoal, weeklyGoal, onSave }) => {
    const [newDailyGoal, setNewDailyGoal] = useState(dailyGoal);
    const [newWeeklyGoal, setNewWeeklyGoal] = useState(weeklyGoal);

    const handleSave = () => {
        onSave(newDailyGoal, newWeeklyGoal);
        alert("Goals updated successfully!");
    };

    return (
        <div className="set-goal">
            <h2>Set Your Study Goals</h2>
            <div className="goal-input">
                <label>Daily Study Goal (hours):</label>
                <input
                    type="number"
                    min="0"
                    value={newDailyGoal}
                    onChange={(e) => setNewDailyGoal(Number(e.target.value))}
                />
            </div>
            <div className="goal-input">
                <label>Weekly Study Goal (hours):</label>
                <input
                    type="number"
                    min="0"
                    value={newWeeklyGoal}
                    onChange={(e) => setNewWeeklyGoal(Number(e.target.value))}
                />
            </div>
            <button onClick={handleSave}>Save Goals</button>
        </div>
    );
};

export default SetGoal;