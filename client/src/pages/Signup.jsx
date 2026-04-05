import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate('/onboarding');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="auth-container glass-card animate-fade-in">
            <h2 className="text-gradient">Join FitAI</h2>
            <p>Your intelligent health journey starts here.</p>
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Create Account</button>
            </form>
            
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Log in</Link>
            </p>
        </div>
    );
};
export default Signup;
