import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Award, Brain, Settings, Hash, Activity, Flame, ChevronRight } from 'lucide-react';
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
                <p style={{ color: 'var(--text-sub)' }}>Evaluating user telemetry...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2.4rem' }}>
                        <User size={32} /> User Profile
                    </h1>
                    <p style={{ margin: 0 }}>Review your personal milestones, settings, and algorithmic health insights.</p>
                </div>
            </div>

            <div className="grid-cols-2" style={{ marginBottom: '2.5rem' }}>
                {/* User Settings Info */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', marginBottom: '2rem', fontSize: '1.2rem' }}>
                        <Settings size={20} color="var(--primary)" /> Configuration Parameters
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 500 }}>Identity</p>
                                <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>{user?.name || '---'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--secondary)' }}>
                                <Hash size={20} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 500 }}>Demographics</p>
                                <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>{user?.age || '--'} YRS · {user?.gender?.toUpperCase() || '---'}</p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--success)' }}>
                                <Activity size={20} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 500 }}>Baseline Activity</p>
                                <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem', textTransform: 'capitalize' }}>{user?.activityLevel || '---'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <button className="secondary" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        Edit configuration <ChevronRight size={16} />
                    </button>
                </div>

                {/* Achievements / Badges */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                        <Award size={20} color="#f59e0b" /> Earned Milestones
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        {data?.badges && data.badges.length > 0 ? (
                            data.badges.map((b, i) => (
                                <span key={i} className="label-tag" style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', fontSize: '0.8rem', padding: '6px 12px' }}>
                                    <Flame size={14} style={{ marginRight: '6px' }} /> {b}
                                </span>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>Awaiting initial milestone completion. Stay consistent.</p>
                        )}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Health Index
                            </p>
                            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
                                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray={`${data?.healthScore || 0}, 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    {data?.healthScore || 0}
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ flex: 1, background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Active Sequence
                            </p>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--success)', margin: 0, lineHeight: 1 }}>
                                {data?.streak || 0}
                            </h2>
                            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', margin: '8px 0 0' }}>Consecutive Days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Insights */}
            {insights.length > 0 && (
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                        <Brain size={20} /> Machine Learning Insights
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '2rem' }}>Generated based on your weekly biometric telemetry</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {insights.map((ins, i) => (
                            <div key={i} className="stat-row" style={{ borderLeft: `4px solid ${ins.type === 'success' ? 'var(--success)' : ins.type === 'warning' ? 'var(--danger)' : 'var(--primary)'}` }}>
                                <Brain size={24} style={{ color: ins.type === 'success' ? 'var(--success)' : ins.type === 'warning' ? 'var(--danger)' : 'var(--primary)', flexShrink: 0 }} />
                                <span style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>{ins.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
