import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Play, Clock } from 'lucide-react';

const Workouts = () => {
    const { api } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);
    const [timeLimit, setTimeLimit] = useState(30);

    const fetchWorkouts = async () => {
        try {
            const res = await api.get(`/workouts?time=${timeLimit}`);
            setWorkouts(res.data);
        } catch(err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    return (
        <div className="animate-fade-in">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <div>
                     <h1 className="text-gradient">Suggested Activity</h1>
                     <p>Optimized routines perfectly aligned with your physical profile.</p>
                 </div>
                 <div style={{display:'flex', alignItems:'center', gap: '10px', background:'rgba(255,255,255,0.05)', padding:'0.5rem 1rem', borderRadius:'8px'}}>
                     <Clock size={20} color="var(--accent)"/>
                     <span style={{fontSize:'0.9rem', color:'var(--text-muted)'}}>Time Available:</span>
                     <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} style={{margin:0, width:'100px', padding:'0.3rem'}}>
                         <option value={10}>10 min</option>
                         <option value={15}>15 min</option>
                         <option value={30}>30 min</option>
                         <option value={45}>45 min</option>
                         <option value={60}>60+ min</option>
                     </select>
                     <button onClick={fetchWorkouts} style={{width:'auto', padding:'0.3rem 0.8rem', marginLeft:'10px'}}>Update</button>
                 </div>
             </div>

             <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                 {workouts.length > 0 ? workouts.map((w, i) => (
                      <div key={i} className="glass-card">
                           <div style={{display:'flex', justifyContent:'space-between'}}>
                               <span style={{background: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff'}}>{w.intensity}</span>
                               <span style={{color: 'var(--text-muted)'}}>{w.duration}</span>
                           </div>
                           <h3 style={{marginTop: '1.5rem'}}>{w.name}</h3>
                           <p style={{marginBottom: '1.5rem'}}>{w.type}</p>
                           
                           <button className="secondary" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
                               <Play size={16}/> Start Session
                           </button>
                      </div>
                 )) : <p style={{gridColumn: '1 / -1', color: 'var(--text-muted)'}}>We couldn't find sessions for this timeframe, try increasing available time.</p>}
             </div>
        </div>
    )
}
export default Workouts;
