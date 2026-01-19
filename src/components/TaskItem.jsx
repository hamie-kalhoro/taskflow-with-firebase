import React from 'react';
import { MoreHorizontal, Calendar, Flag } from 'lucide-react';
import './TaskItem.css';
import { useTasks } from '../context/TaskContext';

const TaskItem = ({ task }) => {
    const { dispatch } = useTasks();

    const handleToggle = () => {
        dispatch({ type: 'TOGGLE_TASK', payload: task.id });
    };

    const handleDelete = () => {
        if (window.confirm('Delete this task?')) {
            dispatch({ type: 'DELETE_TASK', payload: task.id });
        }
    }

    return (
        <div className="task-item">
            <div className="task-left">
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleToggle}
                    />
                    <span className="checkmark"></span>
                </label>

                <div className="task-content">
                    <div className="task-header">
                        <span className={`task-title ${task.completed ? 'completed-text' : ''}`}>
                            {task.title}
                        </span>
                        <span className={`category-badge ${task.category.toLowerCase()}`}>
                            {task.category}
                        </span>
                    </div>
                    {task.description && (
                        <p className="task-desc">{task.description}</p>
                    )}
                    <div className="task-meta">
                        <div className="meta-item">
                            <Calendar size={14} />
                            <span>{task.date}</span>
                        </div>
                        <div className={`meta-item priority ${task.priority.toLowerCase()}`}>
                            <Flag size={14} />
                            <span>{task.priority}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="task-actions">
                <button className="icon-btn" onClick={handleDelete} title="Delete Task">
                    <MoreHorizontal size={20} />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
