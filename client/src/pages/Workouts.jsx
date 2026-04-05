import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Play } from 'lucide-react';

const Workouts = () => {
    const { api } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await api.get('/workouts');
                setWorkouts(res.data);
            } catch(err) {
                console.error(err);
            }
        };
        fetchWorkouts();
    }, [api]);

    return (
        <div className="animate-fade-in">
             <h1 className="text-gradient">Suggested Activity</h1>
             <p>Optimized routines perfectly aligned with your physical profile.</p>

             <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
                 {workouts.map((w, i) => (
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
                 ))}
             </div>
        </div>
    )
}
export default Workouts;
