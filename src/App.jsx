import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import RightPanel from './components/RightPanel';
import Login from './components/Login';
import Signup from './components/Signup';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#1F1D1B] flex items-center justify-center text-[#EAE0D5]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('All Tasks');

  return (
    <Layout>
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <MainDashboard activeCategory={activeCategory} />
      <RightPanel />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
