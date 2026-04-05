import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container glass-card animate-fade-in">
            <h2 className="text-gradient">Welcome Back</h2>
            <p>Ready to crush your goals?</p>
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Log In</button>
            </form>
            
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)' }}>Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;
