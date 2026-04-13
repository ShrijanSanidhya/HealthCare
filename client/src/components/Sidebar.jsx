import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Salad, Home, LogOut, Smartphone, User, PlusCircle, Dumbbell } from 'lucide-react';
import LogActivityModal from './LogActivityModal';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Dumbbell size={20} />
                    </div>
                    FitAI
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link to="/meal-plan" className={location.pathname === '/meal-plan' ? 'active' : ''}>
                        <Salad size={20} /> Meals
                    </Link>
                    <Link to="/workouts" className={location.pathname === '/workouts' ? 'active' : ''}>
                        <Activity size={20} /> Workouts
                    </Link>
                    <Link to="/fitclips" className={location.pathname === '/fitclips' ? 'active' : ''}>
                        <Smartphone size={20} /> Fitclips
                    </Link>
                    <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                        <User size={20} /> Profile
                    </Link>
                </nav>

                <div className="sidebar-bottom">
                    <button onClick={() => setIsLogModalOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <PlusCircle size={18} /> Log Day
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', marginTop: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150" 
                                alt="User Avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '600' }}>
                                    {user?.name?.split(' ')[0] || 'User'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                                    Free Plan
                                </span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="secondary" style={{ width: 'auto', padding: '0.4rem', border: 'none', background: 'transparent' }} title="Logout">
                            <LogOut size={18} color="var(--text-sub)" />
                        </button>
                    </div>
                </div>
            </aside>

            {isLogModalOpen && (
                <LogActivityModal onClose={() => setIsLogModalOpen(false)} />
            )}
        </>
    );
};

export default Sidebar;
