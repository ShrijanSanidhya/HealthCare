import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Play, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import GuidedWorkout from '../components/GuidedWorkout';

const intensityColors = { Low: '#22c55e', Medium: '#f97316', High: '#ef4444' };
const typeIcons = { Cardio: '🏃', Strength: '💪', Flexibility: '🧘', HIIT: '⚡' };

const Workouts = () => {
    const { api, user } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);
    const [timeLimit, setTimeLimit] = useState(30);
    const [loading, setLoading] = useState(false);
    const [activeWorkout, setActiveWorkout] = useState(null);

    const fetchWorkouts = async (time) => {
        setLoading(true);
        try {
            const res = await api.get(`/workouts?time=${time || timeLimit}`);
            setWorkouts(res.data || []);
        } catch (err) {
            toast.error('Could not fetch workout suggestions.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts(30);
    }, []);

    const handleTimeChange = (e) => {
        const val = Number(e.target.value);
        setTimeLimit(val);
        fetchWorkouts(val);
    };

    const handleStartSession = (workout) => {
        setActiveWorkout(workout);
    };

    if (activeWorkout) {
        return <GuidedWorkout workout={activeWorkout} onEnd={() => setActiveWorkout(null)} />;
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-gradient">Suggested Workouts</h1>
                    <p>Optimized routines for your <strong style={{ color: 'var(--accent)' }}>{user?.activityLevel || 'lifestyle'}</strong> activity level and goal to <strong style={{ color: 'var(--accent)' }}>{user?.goal || 'get fit'}</strong>.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: '10px' }}>
                    <Clock size={18} color="var(--accent)" />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Time available:</span>
                    <select value={timeLimit} onChange={handleTimeChange} style={{ margin: 0, width: '100px', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                        <option value={10}>10 min</option>
                        <option value={15}>15 min</option>
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                        <option value={60}>60+ min</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="loader-spinner"></div>
                    <p style={{ color: 'var(--primary)' }}>Curating workouts for you...</p>
                </div>
            )}

            {!loading && workouts.length === 0 && (
                <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
                    <p>No workouts found for {timeLimit} min. Try increasing your available time.</p>
                </div>
            )}

            {!loading && (
                <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                    {workouts.map((w, i) => (
                        <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ background: intensityColors[w.intensity] || 'var(--primary)', padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', color: '#fff', fontWeight: '600' }}>
                                    {w.intensity}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{w.duration}</span>
                            </div>
                            <div style={{ marginTop: '1.25rem', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{typeIcons[w.type] || '🏃'}</div>
                                <h3 style={{ marginBottom: '4px' }}>{w.name}</h3>
                                <p style={{ fontSize: '0.85rem', margin: 0 }}>{w.type} Workout</p>
                            </div>
                            <button
                                onClick={() => handleStartSession(w)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.25rem' }}
                            >
                                <Play size={15} /> Start Session
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Workouts;
