import React, { useState } from 'react';
import { LayoutGrid, Calendar, CheckCircle, Clock, Plus, Tag } from 'lucide-react';
import './Sidebar.css';
import AddTaskModal from './AddTaskModal';
import { useTasks } from '../context/TaskContext';

const Sidebar = () => {
    const { state, dispatch } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate counts dynamically
    const countTasks = (filter) => {
        if (filter === 'All Tasks') return state.tasks.filter(t => !t.completed).length;
        if (filter === 'Completed') return state.tasks.filter(t => t.completed).length;
        if (filter === 'Today') {
            const today = new Date().toISOString().split('T')[0];
            return state.tasks.filter(t => t.date === today && !t.completed).length;
        }
        if (filter === 'Upcoming') {
            const today = new Date().toISOString().split('T')[0];
            return state.tasks.filter(t => t.date > today && !t.completed).length;
        }
        // Category
        return state.tasks.filter(t => t.category === filter && !t.completed).length;
    };

    const handleNavClick = (filter) => {
        dispatch({ type: 'SET_FILTER', payload: filter });
    };

    // Calculate progress (globally)
    const totalTasks = state.tasks.length;
    const completedTasksCount = state.tasks.filter(t => t.completed).length;
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasksCount / totalTasks) * 100);
    const remainingTasks = totalTasks - completedTasksCount;

    const active = state.activeFilter;

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-circle">
                            <CheckCircle size={20} color="white" strokeWidth={3} />
                        </div>
                        <div className="app-name">
                            <h1>TaskFlow</h1>
                            <span className="subtitle">Get things done</span>
                        </div>
                    </div>
                </div>

                <div className="action-area">
                    <button className="btn-primary-large" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        <span>Add Task</span>
                    </button>
                </div>

                <nav className="nav-menu">
                    <button
                        className={`nav-item ${active === 'All Tasks' ? 'active' : ''}`}
                        onClick={() => handleNavClick('All Tasks')}
                    >
                        <LayoutGrid size={20} />
                        <span className="label">All Tasks</span>
                        <span className="count-badge active">{countTasks('All Tasks')}</span>
                    </button>
                    <button
                        className={`nav-item ${active === 'Today' ? 'active' : ''}`}
                        onClick={() => handleNavClick('Today')}
                    >
                        <Clock size={20} />
                        <span className="label">Today</span>
                        <span className="count-badge">{countTasks('Today')}</span>
                    </button>
                    <button
                        className={`nav-item ${active === 'Upcoming' ? 'active' : ''}`}
                        onClick={() => handleNavClick('Upcoming')}
                    >
                        <Calendar size={20} />
                        <span className="label">Upcoming</span>
                        <span className="count-badge">{countTasks('Upcoming')}</span>
                    </button>
                    <button
                        className={`nav-item ${active === 'Completed' ? 'active' : ''}`}
                        onClick={() => handleNavClick('Completed')}
                    >
                        <CheckCircle size={20} />
                        <span className="label">Completed</span>
                        <span className="count-badge">{countTasks('Completed')}</span>
                    </button>
                </nav>

                <div className="category-section">
                    <div className="section-header">
                        <Tag size={14} />
                        <span>CATEGORIES</span>
                    </div>
                    <ul className="category-list">
                        {['Work', 'Personal', 'Health', 'Shopping'].map(cat => (
                            <li
                                key={cat}
                                className={`category-item ${active === cat ? 'active' : ''}`}
                                onClick={() => handleNavClick(cat)}
                            >
                                <span className={`color-dot ${cat.toLowerCase()}`}></span>
                                <span className="label">{cat}</span>
                                <span className="count">{countTasks(cat)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="progress-card">
                    <div className="progress-info">
                        <span className="progress-label">Progress</span>
                        <span className="progress-fraction">{completedTasksCount}/{totalTasks}</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="progress-sub">{remainingTasks} tasks remaining</div>
                </div>
            </aside>

            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Sidebar;
