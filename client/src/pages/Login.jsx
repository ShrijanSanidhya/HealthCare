import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Dumbbell } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Login failed';
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <div className="auth-split-layout animate-fade-in">
            <div className="auth-split-image">
                <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1500&auto=format&fit=crop" alt="Fitness Training" />
                <div style={{ position: 'absolute', bottom: '10%', left: '10%', zIndex: 10, maxWidth: '400px' }}>
                    <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                        Push past your limits.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginTop: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        Intelligent analytics for peak performance.
                    </p>
                </div>
            </div>

            <div className="auth-split-form">
                <div className="glass-card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px var(--primary-glow)' }}>
                            <Dumbbell size={24} />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>FitAI</span>
                    </div>

                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 700 }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', marginBottom: '2rem' }}>Ready to crush your goals?</p>
                    
                    {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
                    
                    <button className="auth-social-btn" type="button" onClick={() => toast('Google Login mock')}>
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span style={{ padding: '0 1rem', fontSize: '0.85rem' }}>OR EMAIL</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 500 }}>Email Address</label>
                            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 0 }} />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 500 }}>Password</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: 0 }} />
                        </div>
                        <button type="submit" style={{ padding: '1rem', fontSize: '1rem' }}>Log In</button>
                    </form>
                    
                    <p style={{ marginTop: '2rem', fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-sub)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
