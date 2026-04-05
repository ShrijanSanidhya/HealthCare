import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import MealPlan from './pages/MealPlan';
import Workouts from './pages/Workouts';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="app-container"><h3>Loading...</h3></div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <BrowserRouter>
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
        </Routes>
      </div>
      {user && <Chatbot />}
    </BrowserRouter>
  );
}

export default App;
