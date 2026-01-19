import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, TrendingUp, CheckCircle, Clock, AlertCircle, ListFilter, ArrowUpDown } from 'lucide-react';
import TaskItem from './TaskItem';
import RightPanel from './RightPanel';
import AddTaskModal from './AddTaskModal';
import './MainDashboard.css';
import { useTasks } from '../context/TaskContext';

const MainDashboard = () => {
    const { state, getFilteredTasks, dispatch } = useTasks();
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    let filteredTasks = getFilteredTasks();

    // Apply priority filter
    if (priorityFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
    }

    // Apply sorting
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'priority') {
            const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sortBy === 'title') {
            comparison = a.title.localeCompare(b.title);
        } else if (sortBy === 'created') {
            comparison = a.id - b.id;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const inProgressTasks = sortedTasks.filter(t => !t.completed);
    const completedTasks = sortedTasks.filter(t => t.completed);

    // Calculate Stats based on ALL tasks
    const allTasks = state.tasks;
    const total = allTasks.length;
    const done = allTasks.filter(t => t.completed).length;
    const today = new Date().toISOString().split('T')[0];
    const dueToday = allTasks.filter(t => t.date === today && !t.completed).length;
    const overdue = allTasks.filter(t => t.date < today && !t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

    // Get time-based greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const handlePriorityFilter = (priority) => {
        setPriorityFilter(priority);
        setShowFilterMenu(false);
    };

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <header className="top-navbar">
                <div className="nav-greeting">
                    <h1>{greeting}, Alex</h1>
                    <p>You have <span className="highlight">{dueToday}</span> tasks due today</p>
                </div>

                <div className="nav-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={state.searchQuery}
                        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                    />
                </div>

                <div className="nav-actions">
                    <button
                        className="nav-icon-btn"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    >
                        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button className="nav-icon-btn" title="Notifications">
                        <Bell size={20} />
                    </button>
                    <div className="nav-avatar">
                        <img src="https://i.pravatar.cc/100?img=5" alt="User" />
                    </div>
                </div>
            </header>

            {/* Stats Row */}
            <section className="stats-row">
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Total Tasks</span>
                        <span className="stat-value">{total}</span>
                        <span className="stat-sub">All your tasks</span>
                    </div>
                    <div className="stat-icon orange"><TrendingUp size={24} /></div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{done}</span>
                        <span className="stat-sub">{percentage}% done</span>
                    </div>
                    <div className="stat-icon green"><CheckCircle size={24} /></div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Due Today</span>
                        <span className="stat-value">{dueToday}</span>
                        <span className="stat-sub">Tasks for today</span>
                    </div>
                    <div className="stat-icon yellow"><Clock size={24} /></div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Overdue</span>
                        <span className="stat-value">{overdue}</span>
                        <span className="stat-sub">Need attention</span>
                    </div>
                    <div className="stat-icon red"><AlertCircle size={24} /></div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="main-content">
                {/* Tasks Section */}
                <section className="tasks-section">
                    <div className="tasks-container">
                        <div className="tasks-header">
                            <div className="tasks-title-area">
                                <h2>{state.activeFilter}</h2>
                                <p className="task-count-sub">{sortedTasks.length} tasks</p>
                            </div>
                            <div className="tasks-controls">
                                {/* Sort Dropdown */}
                                <div className="dropdown-wrapper">
                                    <button
                                        className={`control-btn ${showSortMenu ? 'active' : ''}`}
                                        onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
                                    >
                                        <ArrowUpDown size={16} />
                                        Sort
                                    </button>
                                    {showSortMenu && (
                                        <div className="dropdown-menu sort-menu">
                                            <div className="dropdown-header">Sort by</div>
                                            <button
                                                className={`dropdown-item ${sortBy === 'date' ? 'selected' : ''}`}
                                                onClick={() => setSortBy('date')}
                                            >
                                                Due Date
                                            </button>
                                            <button
                                                className={`dropdown-item ${sortBy === 'priority' ? 'selected' : ''}`}
                                                onClick={() => setSortBy('priority')}
                                            >
                                                Priority
                                            </button>
                                            <button
                                                className={`dropdown-item ${sortBy === 'title' ? 'selected' : ''}`}
                                                onClick={() => setSortBy('title')}
                                            >
                                                Title
                                            </button>
                                            <button
                                                className={`dropdown-item ${sortBy === 'created' ? 'selected' : ''}`}
                                                onClick={() => setSortBy('created')}
                                            >
                                                Created Date
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <button
                                                className={`dropdown-item toggle-item`}
                                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            >
                                                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Filter Dropdown */}
                                <div className="dropdown-wrapper">
                                    <button
                                        className={`control-btn ${showFilterMenu ? 'active' : ''} ${priorityFilter !== 'all' ? 'has-filter' : ''}`}
                                        onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
                                    >
                                        <ListFilter size={16} />
                                        Filter
                                    </button>
                                    {showFilterMenu && (
                                        <div className="dropdown-menu">
                                            <button
                                                className={`dropdown-item ${priorityFilter === 'all' ? 'selected' : ''}`}
                                                onClick={() => handlePriorityFilter('all')}
                                            >
                                                All Priorities
                                            </button>
                                            <button
                                                className={`dropdown-item ${priorityFilter === 'High' ? 'selected' : ''}`}
                                                onClick={() => handlePriorityFilter('High')}
                                            >
                                                <span className="priority-dot high"></span> High Priority
                                            </button>
                                            <button
                                                className={`dropdown-item ${priorityFilter === 'Medium' ? 'selected' : ''}`}
                                                onClick={() => handlePriorityFilter('Medium')}
                                            >
                                                <span className="priority-dot medium"></span> Medium Priority
                                            </button>
                                            <button
                                                className={`dropdown-item ${priorityFilter === 'Low' ? 'selected' : ''}`}
                                                onClick={() => handlePriorityFilter('Low')}
                                            >
                                                <span className="priority-dot low"></span> Low Priority
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {inProgressTasks.length > 0 && (
                            <div className="task-group">
                                <h3 className="group-title">IN PROGRESS ({inProgressTasks.length})</h3>
                                <div className="task-list">
                                    {inProgressTasks.map(task => (
                                        <TaskItem key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {completedTasks.length > 0 && (
                            <div className="task-group">
                                <h3 className="group-title">COMPLETED ({completedTasks.length})</h3>
                                <div className="task-list">
                                    {completedTasks.map(task => (
                                        <TaskItem key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {inProgressTasks.length === 0 && completedTasks.length === 0 && (
                            <div className="empty-state styled">
                                <div className="empty-icon-container">
                                    <CheckCircle size={48} />
                                </div>
                                <h3>No tasks found</h3>
                                <p>You haven't {state.activeFilter === 'Completed' ? 'completed' : 'created'} any tasks yet. Keep going!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Right Panel - Charts */}
                <aside className="charts-section">
                    <RightPanel />
                </aside>
            </div>

            <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        </div>
    );
};

export default MainDashboard;
