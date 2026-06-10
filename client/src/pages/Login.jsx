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
