import React from 'react';

const TaskItem = ({ task, toggleTaskCompletion }) => {
    return (
        <div className="task-item">
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTaskCompletion(task.id)} 
            />
            <span className={task.completed ? 'completed' : ''}>{task.name}</span>
            <span className="due-date">{task.dueDate}</span>
        </div>
    );
};

export default TaskItem;
