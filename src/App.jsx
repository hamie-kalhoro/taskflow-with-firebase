import React, { useState } from 'react';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import RightPanel from './components/RightPanel';
import { TaskProvider } from './context/TaskContext';

function App() {
  const [activeCategory, setActiveCategory] = useState('All Tasks');

  return (
    <TaskProvider>
      <Layout>
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <MainDashboard activeCategory={activeCategory} />
        <RightPanel />
      </Layout>
    </TaskProvider>
  );
}

export default App;
