import React, { createContext, useContext, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const { documents: tasks, addDocument, deleteDocument, updateDocument, error } = useFirestore('tasks');

    // UI State
    const [activeFilter, setActiveFilter] = useState('All Tasks');
    const [searchQuery, setSearchQuery] = useState('');

    // Actions Wrapper
    const addTask = async (task) => {
        // Remove ID as Firestore generates it
        const { id, ...taskData } = task;
        await addDocument(taskData);
    };

    const toggleTask = async (id, currentStatus) => {
        await updateDocument(id, { completed: !currentStatus });
    };

    const deleteTask = async (id) => {
        await deleteDocument(id);
    };

    const editTask = async (id, updates) => {
        await updateDocument(id, updates);
    };

    // Helper to get filtered tasks
    const getFilteredTasks = () => {
        if (!tasks) return [];

        let filtered = tasks;

        if (activeFilter === 'Completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (activeFilter === 'Today') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.date === today && !t.completed);
        } else if (activeFilter === 'Upcoming') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.date > today && !t.completed);
        } else if (activeFilter !== 'All Tasks') {
            // It's a category
            filtered = filtered.filter(t => t.category === activeFilter && !t.completed);
        }

        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return filtered;
    };

    // Compatibility shim for dispatch if needed, but better to use direct functions
    const dispatch = (action) => {
        if (action.type === 'SET_FILTER') setActiveFilter(action.payload);
        if (action.type === 'SET_SEARCH') setSearchQuery(action.payload);
    };

    const value = {
        state: {
            tasks: tasks || [],
            activeFilter,
            searchQuery
        },
        dispatch, // For filter/search updates
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        getFilteredTasks,
        loading: !tasks && !error,
        error
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    return useContext(TaskContext);
}
