import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Flame, Droplet, Trophy } from 'lucide-react';

const Dashboard = () => {
    const { api, user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [insights, setInsights] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard');
                if(res.data.requiresOnboarding) {
                    navigate('/onboarding');
                } else {
                    setData(res.data);
                    try {
                        const insightRes = await api.get('/insights');
                        setInsights(insightRes.data.insights);
                    } catch(e) {}
                }
            } catch(err) {
                console.error(err);
            }
        };
        fetchDashboard();
    }, [api, navigate]);

    if(!data) return <div>Loading dashboard...</div>;

    const todayDate = new Date().toISOString().split('T')[0];
    const todayLog = data.history?.find(h => h.date === todayDate) || { intakeCalories: 0, burnedCalories: 0, waterGlasses: 0 };

    const handleLogDay = async (e) => {
        e.preventDefault();
        const intake = e.target.intake.value;
        const burned = e.target.burned.value;
        const water = e.target.water.value;
        
        const res = await api.post('/log-day', { date: todayDate, intakeCalories: intake, burnedCalories: burned, waterGlasses: water });
        setData(prev => ({...prev, history: res.data.history, healthScore: res.data.healthScore}));
        e.target.reset();
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-gradient">Welcome back, {user?.name}!</h1>
            <p>Your Health Credit Score: <strong style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>{data.healthScore} / 100</strong></p>

            <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                <div className="glass-card">
                    <h3><Target size={20} style={{verticalAlign:'middle', marginRight:'8px', color: 'var(--primary)'}} /> Target Calories</h3>
                    <h2 style={{marginTop: '1rem'}}>{data.targetCalories} kcal</h2>
                </div>
                <div className="glass-card">
                    <h3><Flame size={20} style={{verticalAlign:'middle', marginRight:'8px', color: 'orange'}} /> Today's Intake</h3>
                    <h2 style={{marginTop: '1rem'}}>{todayLog.intakeCalories} kcal</h2>
                </div>
                <div className="glass-card">
                    <h3><Trophy size={20} style={{verticalAlign:'middle', marginRight:'8px', color: 'gold'}} /> Current Streak</h3>
                    <h2 style={{marginTop: '1rem'}}>{data.streak} Days</h2>
                </div>
            </div>

            <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
                <div className="glass-card">
                    <h3>Log Today's Progress ({todayDate})</h3>
                    <form onSubmit={handleLogDay} style={{marginTop: '1rem'}}>
                        <input type="number" name="intake" placeholder="Calories Eaten (e.g. 1800)" />
                        <input type="number" name="burned" placeholder="Calories Burned (e.g. 300)" />
                        <input type="number" name="water" placeholder="Water Glasses (e.g. 8)" />
                        <button type="submit">Save Log</button>
                    </form>
                </div>
                
                <div className="glass-card" style={{ height: '300px' }}>
                    <h3>Weekly Calories Log</h3>
                    {data.history?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={data.history.slice(-7)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#888" tick={{fill: '#888', fontSize: 10}} />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{backgroundColor: '#18181c', border: 'none'}} />
                                <Line type="monotone" dataKey="intakeCalories" stroke="var(--primary)" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="burnedCalories" stroke="var(--danger)" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <p style={{marginTop: '2rem', color: 'var(--text-muted)'}}>No data to chart yet. Log your first day above!</p>}
                </div>
            </div>

            {insights.length > 0 && (
                <div className="glass-card" style={{ marginTop: '2rem' }}>
                    <h3>Weekly Intelligence Insights</h3>
                    <ul style={{ marginTop: '1rem', listStyle: 'none' }}>
                         {insights.map((ins, i) => (
                             <li key={i} style={{ marginBottom: '10px', padding: '10px', background: ins.type === 'success' ? 'var(--success)' : ins.type === 'warning' ? 'var(--danger)' : 'var(--primary)', color: 'white', borderRadius: '4px' }}>
                                 {ins.text}
                             </li>
                         ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default Dashboard;
