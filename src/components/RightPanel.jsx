import React from 'react';
import './RightPanel.css';
import './RightPanel.css';
import { useTasks } from '../context/TaskContext';
import CalendarWidget from './CalendarWidget';

const RightPanel = () => {
    const { state } = useTasks();
    const allTasks = state.tasks;
    const done = allTasks.filter(t => t.completed).length;
    const pending = allTasks.length - done;

    // Category counts
    const workCount = allTasks.filter(t => t.category === 'Work').length;
    const personalCount = allTasks.filter(t => t.category === 'Personal').length;
    const healthCount = allTasks.filter(t => t.category === 'Health').length;
    const shoppingCount = allTasks.filter(t => t.category === 'Shopping').length;
    const totalCat = workCount + personalCount + healthCount + shoppingCount;

    // Calculate percentages for donut chart
    const completionPercent = allTasks.length > 0 ? (done / allTasks.length) * 283 : 0;

    return (
        <div className="right-panel">
            <div className="right-panel-card">
                <div className="panel-header">
                    <h2>Task Distribution</h2>
                </div>

                <div className="charts-container">
                    <div className="charts-row">
                        {/* Completion Chart */}
                        <div className="chart-group">
                            <span className="chart-label">Completion</span>
                            <div className="donut-wrapper">
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="45" fill="transparent" stroke="#2C2C2C" strokeWidth="12" />
                                    <circle
                                        cx="60" cy="60" r="45"
                                        fill="transparent"
                                        stroke="#2ECC71"
                                        strokeWidth="12"
                                        strokeDasharray="283"
                                        strokeDashoffset={283 - completionPercent}
                                        strokeLinecap="round"
                                        transform="rotate(-90 60 60)"
                                    />
                                </svg>
                                <div className="donut-center">
                                    <span>{allTasks.length > 0 ? Math.round((done / allTasks.length) * 100) : 0}%</span>
                                </div>
                            </div>
                            <div className="mini-legend">
                                <div className="legend-item"><span className="dot" style={{ background: '#2ECC71' }}></span> Completed</div>
                                <div className="legend-item"><span className="dot" style={{ background: '#2C2C2C' }}></span> Pending</div>
                            </div>
                        </div>

                        {/* Category Chart */}
                        <div className="chart-group">
                            <span className="chart-label">By Category</span>
                            <div className="donut-wrapper">
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    {/* Base circle */}
                                    <circle cx="60" cy="60" r="45" fill="transparent" stroke="#2C2C2C" strokeWidth="12" />
                                    {/* Work - Orange */}
                                    <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--color-work)" strokeWidth="12"
                                        strokeDasharray={`${(workCount / Math.max(totalCat, 1)) * 283} 283`}
                                        strokeLinecap="round" transform="rotate(-90 60 60)" />
                                    {/* Personal - Purple */}
                                    <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--color-personal)" strokeWidth="12"
                                        strokeDasharray={`${(personalCount / Math.max(totalCat, 1)) * 283} 283`}
                                        strokeLinecap="round" transform={`rotate(${(workCount / Math.max(totalCat, 1)) * 360 - 90} 60 60)`} />
                                    {/* Health - Green */}
                                    <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--color-health)" strokeWidth="12"
                                        strokeDasharray={`${(healthCount / Math.max(totalCat, 1)) * 283} 283`}
                                        strokeLinecap="round" transform={`rotate(${((workCount + personalCount) / Math.max(totalCat, 1)) * 360 - 90} 60 60)`} />
                                    {/* Shopping - Teal */}
                                    <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--color-shopping)" strokeWidth="12"
                                        strokeDasharray={`${(shoppingCount / Math.max(totalCat, 1)) * 283} 283`}
                                        strokeLinecap="round" transform={`rotate(${((workCount + personalCount + healthCount) / Math.max(totalCat, 1)) * 360 - 90} 60 60)`} />
                                </svg>
                            </div>
                            <div className="mini-legend grid-2">
                                <div className="legend-item"><span className="dot" style={{ background: 'var(--color-work)' }}></span> Work</div>
                                <div className="legend-item"><span className="dot" style={{ background: 'var(--color-personal)' }}></span> Personal</div>
                                <div className="legend-item"><span className="dot" style={{ background: 'var(--color-health)' }}></span> Health</div>
                                <div className="legend-item"><span className="dot" style={{ background: 'var(--color-shopping)' }}></span> Shopping</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-panel-card">
                <div className="panel-header">
                    <h2>Calendar</h2>
                </div>
                <CalendarWidget />
            </div>
        </div>
    );
};

export default RightPanel;
