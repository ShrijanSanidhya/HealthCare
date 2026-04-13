import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Flame, Droplet, Bell, Sun, Cloud, Moon, Activity, ArrowRight, Beef, Wheat, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { api, user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/dashboard');
            if (res.data.requiresOnboarding) {
                navigate('/onboarding');
            } else {
                setData(res.data);
            }
        } catch (err) {
            toast.error('Could not load dashboard. Please try again.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (!data) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="loader-spinner"></div>
            <p style={{ color: 'var(--text-sub)' }}>Loading health data...</p>
        </div>
    );

    const todayDate = new Date().toISOString().split('T')[0];
    const todayLog = data.history?.find(h => h.date === todayDate) || { intakeCalories: 0, burnedCalories: 0, waterGlasses: 0 };

    const calorieProgress = data.targetCalories > 0
        ? Math.min(100, Math.round((todayLog.intakeCalories / data.targetCalories) * 100))
        : 0;

    const currentHour = new Date().getHours();
    const isMorning = currentHour < 12;
    const isAfternoon = currentHour >= 12 && currentHour < 17;
    const greeting = isMorning ? 'Good Morning' : isAfternoon ? 'Good Afternoon' : 'Good Evening';
    const GreetingIcon = isMorning ? Sun : isAfternoon ? Cloud : Moon;

    const alerts = [];
    if (currentHour >= 12 && todayLog.intakeCalories < 300) {
        alerts.push({ id: 'missed-meal', text: "Caloric Intake Low: You are significantly below your target for this time of day. Consider eating a balanced meal to maintain energy levels.", type: 'warning' });
    }
    if (currentHour >= 14 && todayLog.waterGlasses < 4) {
        alerts.push({ id: 'hydration', text: 'Hydration Alert: You are behind on your daily water goal. Try drinking a large glass now.', type: 'danger' });
    }

    // Macro Computations (estimated base off generic 30/40/30 split given total cals tracked)
    const proteinGoal = Math.round((data.targetCalories * 0.3) / 4) || 120; 
    const carbGoal = Math.round((data.targetCalories * 0.4) / 4) || 200; 
    const fatGoal = Math.round((data.targetCalories * 0.3) / 9) || 60; 

    const proteinEaten = Math.round((todayLog.intakeCalories * 0.3) / 4) || 0; 
    const carbEaten = Math.round((todayLog.intakeCalories * 0.4) / 4) || 0; 
    const fatEaten = Math.round((todayLog.intakeCalories * 0.3) / 9) || 0; 

    const pPct = Math.max(0, Math.min(100, Math.round((proteinEaten / proteinGoal) * 100))) || 0;
    const cPct = Math.max(0, Math.min(100, Math.round((carbEaten / carbGoal) * 100))) || 0;
    const fPct = Math.max(0, Math.min(100, Math.round((fatEaten / fatGoal) * 100))) || 0;

    // Next Action logic based on time
    let nextTitle, nextDesc, nextImg, nextTag;
    if (currentHour < 12) {
        nextTitle = "Morning Flow";
        nextDesc = "Start your day by waking up your body with a light 10-minute stretch.";
        nextTag = "Recovery";
        nextImg = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop";
    } else if (currentHour < 17) {
        nextTitle = "Endurance Run";
        nextDesc = "Perfect time for a steady-state cardio session to burn calories.";
        nextTag = "Endurance";
        nextImg = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop";
    } else {
        nextTitle = "Evening Wind Down";
        nextDesc = "A calming yoga routine to prepare you for deep, restorative sleep.";
        nextTag = "Flexibility";
        nextImg = "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop";
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '2.4rem' }}>
                        <GreetingIcon size={32} /> {greeting}, {user?.name?.split(' ')[0]}
                    </h1>
                    <p style={{ margin: 0 }}>Here's your daily metabolic progress.</p>
                </div>
            </div>

            {alerts.length > 0 && (
                <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {alerts.map(a => (
                        <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', background: a.type==='danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${a.type==='danger' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`, padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', gap: '12px' }}>
                            <Bell size={20} color={a.type==='danger' ? 'var(--danger)' : 'var(--warning)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>{a.text}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid-cols-3" style={{ marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Caloric Target</p>
                            <h2 style={{ margin: '8px 0 0', fontSize: '2rem' }}>{data.targetCalories} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>kcal</span></h2>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '12px', color: 'var(--secondary)' }}>
                            <Target size={24} />
                        </div>
                    </div>
                </div>
                <div className="glass-card" style={{ borderLeft: `4px solid ${calorieProgress > 100 ? 'var(--danger)' : 'var(--primary)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Current Intake</p>
                            <h2 style={{ margin: '8px 0 0', fontSize: '2rem' }}>{todayLog.intakeCalories} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>kcal</span></h2>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', color: 'var(--primary)' }}>
                            <Flame size={24} />
                        </div>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${calorieProgress}%`, background: calorieProgress > 100 ? 'var(--danger)' : 'linear-gradient(90deg, var(--secondary), var(--primary))' }} />
                    </div>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid #0ea5e9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Hydration</p>
                            <h2 style={{ margin: '8px 0 0', fontSize: '2rem' }}>{todayLog.waterGlasses} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 8 gl</span></h2>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '12px', color: '#0ea5e9' }}>
                            <Droplet size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-cols-2" style={{ marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                        <Activity size={20} color="var(--primary)" /> Macronutrient Breakdown
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: 'auto', marginBottom: 'auto' }}>
                        {/* Protein */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}><Beef size={16} color="#f43f5e" /> Protein</span>
                                <span style={{ color: 'var(--text-sub)' }}>{proteinEaten}g <span style={{ color: 'var(--text-muted)' }}>/ {proteinGoal}g</span></span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${pPct}%`, background: '#f43f5e' }} />
                            </div>
                        </div>
                        {/* Carbs */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}><Wheat size={16} color="#3b82f6" /> Carbohydrates</span>
                                <span style={{ color: 'var(--text-sub)' }}>{carbEaten}g <span style={{ color: 'var(--text-muted)' }}>/ {carbGoal}g</span></span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${cPct}%`, background: '#3b82f6' }} />
                            </div>
                        </div>
                        {/* Fats */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}><Droplets size={16} color="#f59e0b" /> Fats</span>
                                <span style={{ color: 'var(--text-sub)' }}>{fatEaten}g <span style={{ color: 'var(--text-muted)' }}>/ {fatGoal}g</span></span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${fPct}%`, background: '#f59e0b' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div 
                    className="glass-card" 
                    style={{ 
                        position: 'relative', 
                        overflow: 'hidden', 
                        padding: 0,
                        border: '1px solid var(--border)',
                        minHeight: '340px'
                    }}
                >
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        backgroundImage: `url(${nextImg})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        zIndex: 0 
                    }} />
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(to top, rgba(7,8,13,1) 0%, rgba(7,8,13,0.3) 100%)',
                        zIndex: 1 
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 2, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <span className="label-tag" style={{ background: 'var(--primary)', color: '#fff', marginBottom: '1rem', width: 'fit-content' }}>
                            Up Next · {nextTag}
                        </span>
                        <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '8px', fontWeight: 800 }}>{nextTitle}</h2>
                        <p style={{ color: 'rgba(241,245,249,0.85)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{nextDesc}</p>
                        
                        <button onClick={() => navigate('/workouts')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: 'auto', alignSelf: 'flex-start', padding: '0.8rem 2rem' }}>
                            Begin Protocol <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                    <Activity size={20} color="var(--primary)" /> Caloric History
                </h3>
                {data.history?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.history.slice(-7)} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-sub)', fontSize: 12 }} tickFormatter={d => d.slice(5)} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-sub)', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} 
                                itemStyle={{ fontWeight: 600 }}
                            />
                            <Line type="monotone" dataKey="intakeCalories" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-dark)', strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Intake" />
                            <Line type="monotone" dataKey="burnedCalories" stroke="var(--success)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-dark)', strokeWidth: 2 }} name="Burned" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-sub)' }}>
                        <Activity size={48} style={{ opacity: 0.1 }} />
                        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>No history array detected. Start logging your days to see trends.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
