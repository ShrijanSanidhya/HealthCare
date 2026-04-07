import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import MealPlan from './pages/MealPlan';
import Workouts from './pages/Workouts';
import Fitclips from './pages/Fitclips';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';

const ProtectedRouteWrapper = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
             <div className="loader-spinner"></div>
             <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>Booting Health Engine...</p>
        </div>
    );
    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1c1c21', color: '#e9e6df', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<div className="app-container"><Login /></div>} />
        <Route path="/signup" element={<div className="app-container"><Signup /></div>} />
        
        {/* Protected Routes (Wrapped in Layout) */}
        <Route path="/dashboard" element={<ProtectedRouteWrapper><Dashboard /></ProtectedRouteWrapper>} />
        <Route path="/onboarding" element={<ProtectedRouteWrapper><Onboarding /></ProtectedRouteWrapper>} />
        <Route path="/meal-plan" element={<ProtectedRouteWrapper><MealPlan /></ProtectedRouteWrapper>} />
        <Route path="/workouts" element={<ProtectedRouteWrapper><Workouts /></ProtectedRouteWrapper>} />
        <Route path="/fitclips" element={<ProtectedRouteWrapper><Fitclips /></ProtectedRouteWrapper>} />
        <Route path="/profile" element={<ProtectedRouteWrapper><Profile /></ProtectedRouteWrapper>} />
      </Routes>
      
      {user && <Chatbot />}
    </BrowserRouter>
  );
}

export default App;
