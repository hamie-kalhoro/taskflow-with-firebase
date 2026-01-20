import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

// Initial Data
const initialState = {
    tasks: [
        {
            id: 1,
            title: 'Complete project proposal',
            description: 'Finish the Q4 project proposal and send for review',
            category: 'Work',
            date: '2026-01-19', // Past date to test overdue logic
            priority: 'High',
            completed: false
        },
        {
            id: 2,
            title: 'Read book chapter',
            description: 'Chapter 5 of "Atomic Habits"',
            category: 'Personal',
            date: '2026-01-21',
            priority: 'Low',
            completed: false
        },
        {
            id: 3,
            title: 'Doctor appointment',
            description: 'Annual checkup at 3 PM',
            category: 'Health',
            date: '2026-01-22',
            priority: 'Low',
            completed: false
        },
        {
            id: 5,
            title: 'Buy groceries',
            description: 'Milk, eggs, bread, vegetables',
            category: 'Personal',
            date: '2026-01-19', // Today
            priority: 'Medium',
            completed: true
        },
    ],
    activeFilter: 'All Tasks', // 'All Tasks', 'Today', 'Upcoming', 'Completed', or Category Name
    searchQuery: ''
};

// Actions
const ADD_TASK = 'ADD_TASK';
const TOGGLE_TASK = 'TOGGLE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const SET_FILTER = 'SET_FILTER';
const SET_SEARCH = 'SET_SEARCH';

function taskReducer(state, action) {
    switch (action.type) {
        case ADD_TASK:
            return {
                ...state,
                tasks: [...state.tasks, action.payload]
            };
        case TOGGLE_TASK:
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload ? { ...task, completed: !task.completed } : task
                )
            };
        case DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload)
            };
        case SET_FILTER:
            return {
                ...state,
                activeFilter: action.payload
            };
        case SET_SEARCH:
            return {
                ...state,
                searchQuery: action.payload
            };
        default:
            return state;
    }
}

export function TaskProvider({ children }) {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    // Helper to get filtered tasks
    const getFilteredTasks = () => {
        let filtered = state.tasks;

        if (state.activeFilter === 'Completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (state.activeFilter === 'Today') {
            const today = new Date().toISOString().split('T')[0]; // Simple YYYY-MM-DD
            filtered = filtered.filter(t => t.date === today && !t.completed);
        } else if (state.activeFilter === 'Upcoming') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.date > today && !t.completed);
        } else if (state.activeFilter !== 'All Tasks') {
            // It's a category
            filtered = filtered.filter(t => t.category === state.activeFilter && !t.completed);
        }

        if (state.searchQuery) {
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(state.searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    return (
        <TaskContext.Provider value={{ state, dispatch, getFilteredTasks }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    return useContext(TaskContext);
}
