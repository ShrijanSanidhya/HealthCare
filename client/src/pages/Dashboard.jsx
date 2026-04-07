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
            <p style={{ color: 'var(--primary)' }}>Aggregating health telemetry...</p>
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
    const greeting = isMorning ? 'Analysis period: Morning' : isAfternoon ? 'Analysis period: Afternoon' : 'Analysis period: Evening';
    const GreetingIcon = isMorning ? Sun : isAfternoon ? Cloud : Moon;

    const alerts = [];
    if (currentHour >= 12 && todayLog.intakeCalories < 300) {
        alerts.push({ id: 'missed-meal', text: "Caloric Deficit Warning: Intake is significantly below the active threshold for this hour. Consider fueling up for optimal recovery.", type: 'warning' });
    }
    if (currentHour >= 14 && todayLog.waterGlasses < 4) {
        alerts.push({ id: 'hydration', text: 'Hydration Alert: Current water intake is suboptimal. Recommend consuming at least 500ml to maintain metabolic efficiency.', type: 'danger' });
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
        nextTitle = "Morning Mobility Flow";
        nextDesc = "Start your day by waking up your central nervous system.";
        nextTag = "Recovery";
        nextImg = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop";
    } else if (currentHour < 17) {
        nextTitle = "Anaerobic Execution";
        nextDesc = "Prime condition for high-intensity cardiovascular training.";
        nextTag = "Endurance";
        nextImg = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop";
    } else {
        nextTitle = "Evening Deep Stretch";
        nextDesc = "Prepare the body for optimal REM sleep cycles.";
        nextTag = "Flexibility";
        nextImg = "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop";
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GreetingIcon size={28} /> {greeting}, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Daily biometrics and metabolic progress tracking.</p>

            {alerts.length > 0 && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {alerts.map(a => (
                        <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', background: a.type==='danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(215,163,88,0.1)', border: `1px solid ${a.type==='danger' ? 'var(--danger)' : 'var(--accent)'}`, padding: '1rem', borderRadius: 'var(--radius-md)', gap: '12px' }}>
                            <Bell size={20} color={a.type==='danger' ? 'var(--danger)' : 'var(--accent)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>{a.text}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                        <Target size={18} color="var(--primary)" /> Caloric Target
                    </h3>
                    <h2 style={{ marginTop: '1rem', fontSize: '1.8rem' }}>~{data.targetCalories} kcal</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prescribed metabolic threshold</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                        <Flame size={18} color="var(--primary)" /> Current Intake
                    </h3>
                    <h2 style={{ marginTop: '1rem', fontSize: '1.8rem' }}>~{todayLog.intakeCalories} kcal</h2>
                    <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${calorieProgress}%`, height: '100%', background: calorieProgress > 100 ? 'var(--danger)' : 'var(--primary)', transition: 'width 0.6s ease', borderRadius: '4px' }} />
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{calorieProgress}% of capacity reached</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                        <Droplet size={18} color="var(--primary)" /> Hydration Level
                    </h3>
                    <h2 style={{ marginTop: '1rem', fontSize: '1.8rem' }}>{todayLog.waterGlasses} glasses</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{todayLog.waterGlasses >= 8 ? 'Optimal hydration maintained.' : `${8 - todayLog.waterGlasses} volume units remaining`}</p>
                </div>
            </div>

            <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <Activity size={20} color="var(--primary)" /> Macronutrient Breakdown
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Estimated composition of your daily intake.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Protein */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Beef size={14} color="#f43f5e" /> Protein</span>
                                <span style={{ color: 'var(--text-muted)' }}>{proteinEaten}g / {proteinGoal}g</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${pPct}%`, height: '100%', background: '#f43f5e', borderRadius: '4px' }} />
                            </div>
                        </div>
                        {/* Carbs */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Wheat size={14} color="#3b82f6" /> Carbohydrates</span>
                                <span style={{ color: 'var(--text-muted)' }}>{carbEaten}g / {carbGoal}g</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${cPct}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
                            </div>
                        </div>
                        {/* Fats */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Droplets size={14} color="#f59e0b" /> Fats</span>
                                <span style={{ color: 'var(--text-muted)' }}>{fatEaten}g / {fatGoal}g</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${fPct}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
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
                        border: '1px solid rgba(255,255,255,0.1)'
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
                        background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.4) 100%)',
                        zIndex: 1 
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 2, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <span style={{ display: 'inline-block', background: 'var(--primary)', color: 'var(--bg-dark)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem', width: 'fit-content' }}>
                            Up Next · {nextTag}
                        </span>
                        <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '8px' }}>{nextTitle}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{nextDesc}</p>
                        
                        <button onClick={() => navigate('/workouts')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: 'auto', alignSelf: 'flex-start' }}>
                            Begin Protocol <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                    <Activity size={20} color="var(--primary)" /> Longitudinal Analytics
                </h3>
                {data.history?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.history.slice(-7)} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                            <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: 'var(--primary)' }} />
                            <Line type="monotone" dataKey="intakeCalories" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Intake" />
                            <Line type="monotone" dataKey="burnedCalories" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Burned" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
                        <Activity size={40} style={{ opacity: 0.25 }} />
                        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.9rem' }}>Insufficient data. Chart generating post-activity detection.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

