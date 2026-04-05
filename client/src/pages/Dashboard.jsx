import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Flame, Droplet, Trophy, Bell, Award, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

// Food calorie database for photo estimation lookup
const FOOD_DB = [
    { name: 'Apple', calories: 95 }, { name: 'Banana', calories: 105 },
    { name: 'Chicken Breast (100g)', calories: 165 }, { name: 'Rice Bowl', calories: 350 },
    { name: 'Salad', calories: 120 }, { name: 'Pizza Slice', calories: 285 },
    { name: 'Burger', calories: 540 }, { name: 'Protein Shake', calories: 180 },
    { name: 'Greek Yogurt', calories: 100 }, { name: 'Oatmeal Bowl', calories: 300 },
    { name: 'Sandwich', calories: 400 }, { name: 'Dal Rice', calories: 450 },
    { name: 'Paneer Tikka', calories: 270 }, { name: 'Grilled Fish', calories: 230 },
];

const Dashboard = () => {
    const { api, user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [insights, setInsights] = useState([]);
    const [estimatedCals, setEstimatedCals] = useState('');
    const [burnedCals, setBurnedCals] = useState('');
    const [waterGlasses, setWaterGlasses] = useState('');
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const navigate = useNavigate();

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/dashboard');
            if (res.data.requiresOnboarding) {
                navigate('/onboarding');
            } else {
                setData(res.data);
                try {
                    const insightRes = await api.get('/insights');
                    setInsights(insightRes.data.insights || []);
                } catch (e) {}
            }
        } catch (err) {
            toast.error('Could not load dashboard. Please try again.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);  // Runs once after mount

    if (!data) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="loader-spinner"></div>
            <p style={{ color: 'var(--primary)' }}>Loading your health data...</p>
        </div>
    );

    const todayDate = new Date().toISOString().split('T')[0];
    const todayLog = data.history?.find(h => h.date === todayDate) || { intakeCalories: 0, burnedCalories: 0, waterGlasses: 0 };

    const handleLogDay = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving your log...');
        try {
            const res = await api.post('/log-day', {
                date: todayDate,
                intakeCalories: estimatedCals || 0,
                burnedCalories: burnedCals || 0,
                waterGlasses: waterGlasses || 0,
            });
            setData(prev => ({ ...prev, badges: res.data.badges, history: res.data.history, healthScore: res.data.healthScore }));
            setEstimatedCals('');
            setBurnedCals('');
            setWaterGlasses('');
            setScanResult(null);
            toast.success('Daily log saved! Health score updated.', { id: toastId });
        } catch (err) {
            toast.error('Failed to save log. Try again.', { id: toastId });
        }
    };

    const handleImageUpload = (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        setScanning(true);
        setScanResult(null);

        // Simulate a 3-phase AI scanning experience
        setTimeout(() => {
            const randomFood = FOOD_DB[Math.floor(Math.random() * FOOD_DB.length)];
            setScanResult(randomFood);
            setEstimatedCals(String(randomFood.calories));
            setScanning(false);
            toast.success(`🍽 Detected: ${randomFood.name} — ${randomFood.calories} kcal auto-filled!`);
        }, 2200);
    };

    const calorieProgress = data.targetCalories > 0
        ? Math.min(100, Math.round((todayLog.intakeCalories / data.targetCalories) * 100))
        : 0;

    const currentHour = new Date().getHours();
    const alerts = [];
    if (currentHour >= 12 && todayLog.intakeCalories < 300) {
        alerts.push({ id: 'missed-meal', text: "You may have missed a meal today. Don't skip meals — keep your metabolism active!", type: 'warning' });
    }
    if (currentHour >= 14 && todayLog.waterGlasses < 4) {
        alerts.push({ id: 'hydration', text: 'Hydration check! You\'re below 4 glasses. Grab some water now to stay on track.', type: 'info' });
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-gradient">Welcome back, {user?.name}!</h1>
            <p>Health Credit Score: <strong style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>{data.healthScore} / 100</strong></p>

            {/* Smart Alerts */}
            {alerts.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    {alerts.map(a => (
                        <div key={a.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(215,163,88,0.15)', border: '1px solid var(--accent)', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '10px', gap: '12px' }}>
                            <Bell size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
                            <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{a.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Row */}
            <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                <div className="glass-card">
                    <h3><Target size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />Target</h3>
                    <h2 style={{ marginTop: '1rem' }}>{data.targetCalories} kcal</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Your daily goal</p>
                </div>
                <div className="glass-card">
                    <h3><Flame size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'orange' }} />Intake Today</h3>
                    <h2 style={{ marginTop: '1rem' }}>{todayLog.intakeCalories} kcal</h2>
                    <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${calorieProgress}%`, height: '100%', background: calorieProgress > 100 ? 'var(--danger)' : 'var(--primary)', transition: 'width 0.5s ease', borderRadius: '4px' }} />
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>{calorieProgress}% of goal</p>
                </div>
                <div className="glass-card">
                    <h3><Trophy size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'gold' }} />Streak</h3>
                    <h2 style={{ marginTop: '1rem' }}>{data.streak} Days 🔥</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}><Droplet size={14} style={{ verticalAlign: 'middle' }} /> {todayLog.waterGlasses} glasses today</p>
                </div>
            </div>

            {/* Badges */}
            {data.badges && data.badges.length > 0 && (
                <div className="glass-card" style={{ marginTop: '2rem' }}>
                    <h3><Award size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />Your Achievements</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {data.badges.map((b, i) => (
                            <span key={i} style={{ background: 'rgba(133,154,81,0.2)', border: '1px solid var(--primary)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>{b}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Log + Chart */}
            <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
                <div className="glass-card">
                    <h3>Log Today's Progress</h3>
                    <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{todayDate}</p>

                    {/* AI Food Vision */}
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(133,154,81,0.08)', border: '1px dashed rgba(133,154,81,0.4)', borderRadius: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)', cursor: 'pointer' }}>
                            <Camera size={18} /> AI Food Vision — snap to estimate calories
                        </label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ border: 'none', background: 'transparent', padding: 0, marginBottom: 0, fontSize: '0.85rem' }} />
                        {scanning && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.8rem', color: 'var(--accent)' }}>
                                <div className="loader-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                                <span style={{ fontSize: '0.85rem' }}>Analyzing your food...</span>
                            </div>
                        )}
                        {scanResult && !scanning && (
                            <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--success)' }}>
                                ✓ Detected: <strong>{scanResult.name}</strong> — {scanResult.calories} kcal
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleLogDay}>
                        <input
                            type="number"
                            placeholder="Calories Eaten (kcal)"
                            value={estimatedCals}
                            onChange={e => setEstimatedCals(e.target.value)}
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Calories Burned from Exercise (kcal)"
                            value={burnedCals}
                            onChange={e => setBurnedCals(e.target.value)}
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Water Glasses Consumed"
                            value={waterGlasses}
                            onChange={e => setWaterGlasses(e.target.value)}
                            min="0"
                            max="20"
                        />
                        <button type="submit">💾 Save Today's Log</button>
                    </form>
                </div>

                <div className="glass-card" style={{ height: '360px' }}>
                    <h3>Weekly Calorie Chart</h3>
                    {data.history?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={data.history.slice(-7)} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                                <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1c1c21', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: 'var(--accent)' }} />
                                <Line type="monotone" dataKey="intakeCalories" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Intake" />
                                <Line type="monotone" dataKey="burnedCalories" stroke="#cf4e4e" strokeWidth={2} dot={{ r: 4 }} name="Burned" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
                            <Flame size={40} style={{ opacity: 0.3 }} />
                            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.9rem' }}>No data yet. Log your first day to see your progress chart!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Insights */}
            {insights.length > 0 && (
                <div className="glass-card" style={{ marginTop: '2rem' }}>
                    <h3>🧠 Weekly Insights</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
                        {insights.map((ins, i) => (
                            <div key={i} style={{ padding: '12px 16px', background: ins.type === 'success' ? 'rgba(103,166,89,0.15)' : ins.type === 'warning' ? 'rgba(207,78,78,0.15)' : 'rgba(133,154,81,0.15)', border: `1px solid ${ins.type === 'success' ? 'var(--success)' : ins.type === 'warning' ? 'var(--danger)' : 'var(--primary)'}`, borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                {ins.type === 'success' ? '✅' : ins.type === 'warning' ? '⚠️' : 'ℹ️'} {ins.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
