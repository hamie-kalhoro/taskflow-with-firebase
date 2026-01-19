import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import './CalendarWidget.css';
import { useTasks } from '../context/TaskContext';

const CalendarWidget = () => {
    const { state } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Get days from previous month to fill the first week
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const formatDate = (y, m, d) => {
        return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    };

    const handleDayClick = (day, isCurrentMonth = true) => {
        if (isCurrentMonth) {
            setSelectedDate(new Date(year, month, day));
        }
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const renderDays = () => {
        const days = [];
        const todayStr = new Date().toISOString().split('T')[0];

        // Previous month days (muted)
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push(
                <div key={`prev-${day}`} className="calendar-day other-month">
                    <span className="day-number">{day}</span>
                </div>
            );
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = formatDate(year, month, d);
            const isToday = dateStr === todayStr;
            const isSelected = d === selectedDate.getDate() &&
                month === selectedDate.getMonth() &&
                year === selectedDate.getFullYear();

            // Find tasks for this day
            const dayTasks = state.tasks.filter(t => t.date === dateStr);
            const hasTasks = dayTasks.length > 0;

            let dotColor = null;
            if (hasTasks) {
                if (dayTasks.some(t => t.priority === 'High')) dotColor = 'var(--color-high)';
                else if (dayTasks.some(t => t.priority === 'Medium')) dotColor = 'var(--color-medium)';
                else dotColor = 'var(--color-low)';
            }

            days.push(
                <div
                    key={d}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected && !isToday ? 'selected' : ''}`}
                    onClick={() => handleDayClick(d)}
                >
                    <span className="day-number">{d}</span>
                    {hasTasks && (
                        <span className="task-dot" style={{ backgroundColor: dotColor }}></span>
                    )}
                </div>
            );
        }
        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // Format selected date for display
    const formatDisplayDate = (date) => {
        const day = date.getDate();
        const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
            day === 2 || day === 22 ? 'nd' :
                day === 3 || day === 23 ? 'rd' : 'th';
        return `${monthNames[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
    };

    // Get tasks for selected date
    const selectedDateStr = formatDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const selectedTasks = state.tasks.filter(t => t.date === selectedDateStr);

    return (
        <div className="calendar-widget">
            <div className="calendar-nav">
                <button onClick={prevMonth} className="nav-arrow"><ChevronLeft size={20} /></button>
                <h3 className="month-year">{monthNames[month]} {year}</h3>
                <button onClick={nextMonth} className="nav-arrow"><ChevronRight size={20} /></button>
            </div>

            <div className="calendar-grid">
                <div className="day-name">Su</div>
                <div className="day-name">Mo</div>
                <div className="day-name">Tu</div>
                <div className="day-name">We</div>
                <div className="day-name">Th</div>
                <div className="day-name">Fr</div>
                <div className="day-name">Sa</div>
                {renderDays()}
            </div>

            {/* Selected Date Info */}
            <div className="date-info-header">
                <span className="selected-date-text">{formatDisplayDate(selectedDate)}</span>
                <span className="task-count-pill">{selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="selected-tasks-list">
                {selectedTasks.length > 0 ? (
                    selectedTasks.map(task => (
                        <div key={task.id} className="mini-task-card">
                            <div className={`mini-task-indicator ${task.priority.toLowerCase()}`}></div>
                            <span className="mini-task-title">{task.title}</span>
                        </div>
                    ))
                ) : (
                    <div className="mini-task-empty">No tasks for this day</div>
                )}
            </div>
        </div>
    );
};

export default CalendarWidget;
