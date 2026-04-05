import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Salad, Home, LogOut } from 'lucide-react';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar app-container" style={{ marginBottom: 0, padding: '1.5rem 2rem' }}>
            <div className="logo text-gradient">FitAI</div>
            
            <div className="nav-links">
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                    <Home size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> Dashboard
                </Link>
                <Link to="/meal-plan" className={location.pathname === '/meal-plan' ? 'active' : ''}>
                    <Salad size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> Meals
                </Link>
                <Link to="/workouts" className={location.pathname === '/workouts' ? 'active' : ''}>
                    <Activity size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> Workouts
                </Link>
                
                <button onClick={handleLogout} className="secondary" style={{ width: 'auto', padding: '0.4rem 1rem', marginLeft: '1rem' }}>
                    <LogOut size={16} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
