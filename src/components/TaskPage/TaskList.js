import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, toggleTaskCompletion }) => {
    return (
        <div className="task-list">
            {tasks.length > 0 ? tasks.map(task => (
                <TaskItem key={task.id} task={task} toggleTaskCompletion={toggleTaskCompletion} />
            )) : (
                <p>No tasks to display.</p>
            )}
        </div>
    );
};

export default TaskList;
