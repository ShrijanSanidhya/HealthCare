import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Info } from 'lucide-react';

const MealPlan = () => {
    const { api } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateMealPlan = async () => {
        setLoading(true);
        try {
            const res = await api.get('/meal-plan');
            setMeals(res.data.currentMeals);
        } catch(err) {
             console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
         // Auto gen on mount if empty, but we can just require user to generate
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <div>
                     <h1 className="text-gradient">Daily AI Meal Plan</h1>
                     <p>Personalized meals perfectly tailored to your dietary preference and goals.</p>
                 </div>
                 <button onClick={generateMealPlan} style={{width:'auto'}} disabled={loading}>
                     {loading ? 'Generating...' : 'Regenerate Plan'}
                 </button>
            </div>
            
            {meals.length === 0 && !loading && (
                <div className="glass-card" style={{marginTop: '2rem', textAlign: 'center'}}>
                    <p>Click "Regenerate Plan" to get your customized meals for the day.</p>
                </div>
            )}

            <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
                {meals.map((meal, index) => (
                    <div key={index} className="glass-card">
                         <div style={{display:'flex', justifyContent:'space-between'}}>
                             <strong style={{color: 'var(--accent)'}}>{meal.type}</strong>
                             <span>{meal.calories} kcal</span>
                         </div>
                         <h2 style={{marginTop: '1rem', fontSize: '1.2rem'}}>{meal.name}</h2>
                         
                         <div style={{marginTop:'1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', display:'flex', gap: '10px'}}>
                              <Info color="var(--primary)" size={20} />
                              <p style={{margin:0, fontSize: '0.9rem'}}>{meal.explanation}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealPlan;
