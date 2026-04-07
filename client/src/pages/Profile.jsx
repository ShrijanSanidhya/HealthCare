import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Award, Brain, Settings, Hash, MapPin, Target, Activity, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { api, user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch dashboard data to get badges and streak
                const dashRes = await api.get('/dashboard');
                setData(dashRes.data);

                // Fetch insights
                try {
                    const insightRes = await api.get('/insights');
                    setInsights(insightRes.data.insights || []);
                } catch (e) {
                    console.error("Could not fetch insights", e);
                }
            } catch (err) {
                toast.error('Could not load profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <div className="loader-spinner"></div>
                <p style={{ color: 'var(--primary)' }}>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={28} /> Profile Overview
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your goals, view your achievements, and track your progress.</p>

            <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
                {/* User Settings Info */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                        <Settings size={20} /> Personal Info
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                <User size={18} color="var(--text-muted)" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Name</p>
                                <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-main)' }}>{user?.name || '---'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                <Hash size={18} color="var(--text-muted)" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age & Gender</p>
                                <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-main)' }}>{user?.age || '--'} yrs · {user?.gender || '---'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                <Target size={18} color="var(--text-muted)" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Goal</p>
                                <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-main)', textTransform: 'capitalize' }}>{user?.goal || '---'}</p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                <Activity size={18} color="var(--text-muted)" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Activity Level</p>
                                <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-main)', textTransform: 'capitalize' }}>{user?.activityLevel || '---'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements / Badges */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '1.5rem' }}>
                        <Award size={20} /> Your Achievements
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {data?.badges && data.badges.length > 0 ? (
                            data.badges.map((b, i) => (
                                <span key={i} style={{ background: 'rgba(220,163,88,0.15)', border: '1px solid var(--accent)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Flame size={16} color="var(--accent)" /> {b}
                                </span>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No achievements yet. Keep logging your days!</p>
                        )}
                    </div>

                    <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Health Score</span>
                            <strong style={{ color: 'var(--primary)' }}>{data?.healthScore || 0} / 100</strong>
                        </p>
                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.8rem 0' }} />
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Active Streak</span>
                            <strong style={{ color: 'var(--accent)' }}>{data?.streak || 0} Days</strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* Weekly Insights */}
            {insights.length > 0 && (
                <div className="glass-card" style={{ marginTop: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '1rem' }}>
                        <Brain size={20} /> AI Health Insights
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Based on your activity this week</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {insights.map((ins, i) => (
                            <div key={i} style={{ padding: '14px 18px', background: ins.type === 'success' ? 'rgba(103,166,89,0.1)' : ins.type === 'warning' ? 'rgba(207,78,78,0.1)' : 'rgba(59,130,246,0.1)', borderLeft: `4px solid ${ins.type === 'success' ? 'var(--success)' : ins.type === 'warning' ? 'var(--danger)' : '#3b82f6'}`, borderRadius: '4px 8px 8px 4px', fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Brain size={18} style={{ color: ins.type === 'success' ? 'var(--success)' : ins.type === 'warning' ? 'var(--danger)' : '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                                <span>{ins.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
