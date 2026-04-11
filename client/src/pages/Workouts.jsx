import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Play, Clock, Dumbbell, Activity, Flame, SearchX } from 'lucide-react';
import toast from 'react-hot-toast';
import GuidedWorkout from '../components/GuidedWorkout';

const intensityColors = { Low: '#22c55e', Medium: '#f97316', High: '#ef4444' };

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
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        <Dumbbell size={36} /> AI Workouts
                    </h1>
                    <p style={{ fontSize: '1.1rem', maxWidth: '600px' }}>Curated routines for your <strong style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>{user?.activityLevel || 'lifestyle'}</strong> level — goal: <strong style={{ color: '#f97316', textTransform: 'lowercase' }}>{user?.goal || 'get fit'}</strong>.</p>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                        <Clock size={20} color="var(--primary)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Available</span>
                        <select value={timeLimit} onChange={handleTimeChange} style={{ margin: 0, padding: '0', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600', outline: 'none', cursor: 'pointer', appearance: 'none', minWidth: '110px' }}>
                            <option value={10}>10 Minutes</option>
                            <option value={15}>15 Minutes</option>
                            <option value={30}>30 Minutes</option>
                            <option value={45}>45 Minutes</option>
                            <option value={60}>60+ Minutes</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6rem', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="loader-spinner" style={{ width: '60px', height: '60px', borderWidth: '5px' }}></div>
                    <p style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: '500', animation: 'pulse 1.5s infinite' }}>Analyzing profile & building workouts...</p>
                </div>
            )}

            {!loading && workouts.length === 0 && (
                <div className="glass-card" style={{ marginTop: '3rem', textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
                    <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '50%' }}>
                            <SearchX size={56} style={{ opacity: 0.6 }} />
                        </div>
                    </div>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>No routines fit the {timeLimit} min window</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>Try adjusting your available time. Sometimes a slightly longer session unlocks high-intensity options.</p>
                </div>
            )}

            {!loading && workouts.length > 0 && (
                <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                    {workouts.map((w, i) => (
                        <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', borderTop: `4px solid ${intensityColors[w.intensity] || 'var(--primary)'}`, position: 'relative', overflow: 'hidden' }}>
                            {/* Decorative background glow based on intensity */}
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: intensityColors[w.intensity] || 'var(--primary)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                                <span style={{ background: `linear-gradient(135deg, ${intensityColors[w.intensity] || 'var(--primary)'}, transparent)`, border: `1px solid ${intensityColors[w.intensity]}40`, padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: '#fff', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    {w.intensity} INT &bull; {w.type}
                                </span>
                                <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                                    <Clock size={16} color="var(--accent)" /> {w.duration}
                                </span>
                            </div>
                            
                            <div style={{ marginTop: '2rem', flex: 1, zIndex: 1 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                                    <Activity size={28} color="var(--primary)" />
                                </div>
                                <h3 style={{ marginBottom: '12px', fontSize: '1.4rem', fontWeight: '700', lineHeight: '1.3' }}>{w.name}</h3>
                                
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}>
                                    <span style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: '8px', color: '#f97316', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                                        <Flame size={14} /> ~{w.intensity === 'High' ? '300–450' : w.intensity === 'Medium' ? '180–280' : '90–150'} kcal est.
                                    </span>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => handleStartSession(w)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '2rem', padding: '1rem', fontSize: '1rem', letterSpacing: '0.02em', zIndex: 1, textTransform: 'uppercase', fontWeight: '700' }}
                            >
                                <Play size={20} fill="currentColor" /> Start Session
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Workouts;
