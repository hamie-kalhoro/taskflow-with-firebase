import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, Flag, Clock } from 'lucide-react';
import './TaskItem.css';
import { useTasks } from '../context/TaskContext';
import EditTaskModal from './EditTaskModal';

const TaskItem = ({ task }) => {
    const { toggleTask, deleteTask, dispatch } = useTasks();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleToggle = async () => {
        await toggleTask(task.id, task.completed);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Delete this task?')) {
            await deleteTask(task.id);
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation();
        setIsEditModalOpen(true);
    };

    const today = new Date().toISOString().split('T')[0];
    const isOverdue = !task.completed && task.date < today;

    return (
        <>
            <div className={`task-item ${isOverdue ? 'overdue' : ''}`}>
                <div className={`category-bar ${task.category.toLowerCase()}`}></div>
                <div className="task-inner">
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
                                {isOverdue && (
                                    <div className="meta-item overdue-indicator">
                                        <Clock size={14} />
                                        <span>Overdue</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="task-actions">
                        <button className="icon-btn" onClick={handleEdit} title="Edit Task">
                            <Pencil size={18} />
                        </button>
                        <button className="icon-btn delete" onClick={handleDelete} title="Delete Task">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                task={task}
            />
        </>
    );
};

export default TaskItem;
