import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Info, RefreshCw, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const mealColors = {
    Breakfast: '#f97316',
    Lunch: '#22c55e',
    Dinner: '#6366f1',
    Snack: '#eab308'
};

const MealPlan = () => {
    const { api, user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCals, setTotalCals] = useState(0);

    const generateMealPlan = async () => {
        setLoading(true);
        const toastId = toast.loading('Crafting your personalized meal plan...');
        try {
            const res = await api.get('/meal-plan');
            const fetchedMeals = res.data.currentMeals || [];
            setMeals(fetchedMeals);
            setTotalCals(fetchedMeals.reduce((sum, m) => sum + (m.calories || 0), 0));
            toast.success('Meal plan generated!', { id: toastId });
        } catch (err) {
            toast.error('Could not generate meal plan. Make sure your profile is set up.', { id: toastId });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-load on first visit
    useEffect(() => {
        generateMealPlan();
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-gradient">AI Meal Plan</h1>
                    <p>Personalized for your <strong style={{ color: 'var(--accent)' }}>{user?.diet || 'balanced'}</strong> diet to help you <strong style={{ color: 'var(--accent)' }}>{user?.goal || 'reach your goal'}</strong>.</p>
                </div>
                <button onClick={generateMealPlan} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    {loading ? 'Generating...' : 'Regenerate Plan'}
                </button>
            </div>

            {totalCals > 0 && (
                <div className="glass-card" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Utensils size={22} color="var(--accent)" />
                    <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Plan Calories</p>
                        <strong style={{ fontSize: '1.4rem', color: 'var(--accent)' }}>{totalCals} kcal</strong>
                    </div>
                </div>
            )}

            {loading && meals.length === 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="loader-spinner"></div>
                    <p style={{ color: 'var(--primary)' }}>Analyzing your profile...</p>
                </div>
            )}

            {!loading && meals.length === 0 && (
                <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
                    <Utensils size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>Click "Regenerate Plan" to get your personalized meals.</p>
                    <p style={{ fontSize: '0.85rem' }}>Make sure you have completed your health profile first.</p>
                </div>
            )}

            <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
                {meals.map((meal, index) => (
                    <div key={index} className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ background: mealColors[meal.type] || 'var(--primary)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', color: '#fff', fontWeight: '600' }}>
                                {meal.type}
                            </span>
                            <span style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '1rem' }}>{meal.calories} kcal</span>
                        </div>
                        <h2 style={{ marginTop: '1rem', fontSize: '1.15rem', lineHeight: '1.4' }}>{meal.name}</h2>
                        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.25)', padding: '0.875rem', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <Info color="var(--primary)" size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{meal.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealPlan;
