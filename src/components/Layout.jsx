import React, { useState } from 'react';
import './Layout.css';
import Sidebar from './Sidebar';
import MainDashboard from './MainDashboard';
import AddTaskModal from './AddTaskModal';

const Layout = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar onAddTask={() => setShowAddModal(true)} />
            <MainDashboard />
            <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        </div>
    );
};

export default Layout;
