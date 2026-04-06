import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import MealPlan from './pages/MealPlan';
import Workouts from './pages/Workouts';
import WorkoutReels from './pages/WorkoutReels';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return (
        <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
             <div className="loader-spinner"></div>
             <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>Booting Health Engine...</p>
        </div>
    );
    return user ? children : <Navigate to="/login" />;
};

import { Toaster } from 'react-hot-toast';

function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1c1c21', color: '#e9e6df', border: '1px solid rgba(255,255,255,0.1)' } }} />
      {user && <Navbar />}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/meal-plan" element={<ProtectedRoute><MealPlan /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
          <Route path="/workout-reels" element={<ProtectedRoute><WorkoutReels /></ProtectedRoute>} />
        </Routes>
      </div>
      {user && <Chatbot />}
    </BrowserRouter>
  );
}

export default App;
