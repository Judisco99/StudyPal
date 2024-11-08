import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TaskProvider } from './contexts/TaskContext';

ReactDOM.render(
    <TaskProvider>
        <App />
    </TaskProvider>,
    document.getElementById('root')
);
