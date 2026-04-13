import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Info, RefreshCw, Utensils, CheckCircle2, AlertCircle, ChefHat, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const mealColors = {
    Breakfast: '#f59e0b',
    Lunch: '#10b981',
    Dinner: '#6366f1',
    Snack: '#8b5cf6'
};

const MealPlan = () => {
    const { api, user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCals, setTotalCals] = useState(0);
    const [noMatchMsg, setNoMatchMsg] = useState('');
    
    const [ingredientsInput, setIngredientsInput] = useState('');
    const [filters, setFilters] = useState({
        highProtein: false,
        quickMeals: false,
        lowCalorie: false
    });

    const generateMealPlan = async () => {
        setLoading(true);
        setNoMatchMsg('');
        const toastId = toast.loading('Crafting your personalized meal plan...');
        try {
            const query = new URLSearchParams({
                ingredients: ingredientsInput,
                highProtein: filters.highProtein,
                quickMeals: filters.quickMeals,
                lowCalorie: filters.lowCalorie
            }).toString();

            const res = await api.get(`/meal-plan?${query}`);
            
            if (res.data.noMatch) {
                setMeals([]);
                setTotalCals(0);
                setNoMatchMsg(res.data.message);
                toast.error('No meals matched your criteria.', { id: toastId });
            } else {
                const fetchedMeals = res.data.currentMeals || [];
                setMeals(fetchedMeals);
                setTotalCals(fetchedMeals.reduce((sum, m) => sum + (m.calories || 0), 0));
                toast.success('Meal plan generated!', { id: toastId });
            }
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
            <div className="page-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2.4rem' }}>
                        <ChefHat size={32} /> Smart Meal Planner
                    </h1>
                    <p style={{ margin: 0 }}>Tailored to your <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{user?.diet || 'balanced'}</strong> diet for <strong style={{ color: 'var(--primary)', textTransform: 'lowercase' }}>{user?.goal || 'optimal health'}</strong>.</p>
                </div>
                <button onClick={generateMealPlan} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem' }} disabled={loading}>
                    <RefreshCw size={18} className={loading && meals.length > 0 ? 'spin' : ''} />
                    {loading && meals.length > 0 ? 'Generating...' : 'Refresh Plan'}
                </button>
            </div>
            
            <div className="glass-card" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '4px solid var(--secondary)' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} color="var(--secondary)" /> Diet & Pantry Constraints
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)' }}>Input ingredients in your fridge or apply strict macros to generate a matching plan.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8.5rem', color: 'var(--text-sub)', fontWeight: 500 }}>What's in your pantry? (comma separated)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. chicken breast, brown rice, broccoli" 
                        value={ingredientsInput}
                        onChange={e => setIngredientsInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && generateMealPlan()}
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        <input type="checkbox" checked={filters.highProtein} onChange={e => setFilters({...filters, highProtein: e.target.checked})} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', margin: 0 }} />
                        High Protein (20g+)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        <input type="checkbox" checked={filters.quickMeals} onChange={e => setFilters({...filters, quickMeals: e.target.checked})} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', margin: 0 }} />
                        Quick Meals (&lt;15m)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        <input type="checkbox" checked={filters.lowCalorie} onChange={e => setFilters({...filters, lowCalorie: e.target.checked})} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', margin: 0 }} />
                        Low Calorie (&lt;400kcal)
                    </label>
                </div>
            </div>

            {totalCals > 0 && !loading && (
                <div className="stat-row" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)', background: 'rgba(99,102,241,0.05)' }}>
                    <Utensils size={28} color="var(--primary)" />
                    <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Daily Allocation</p>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>{totalCals} <span style={{ fontSize: '1rem', color: 'var(--text-sub)', fontWeight: 500 }}>kcal</span></h2>
                    </div>
                </div>
            )}

            {loading && meals.length === 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="loader-spinner"></div>
                    <p style={{ color: 'var(--text-sub)' }}>Synthesizing culinary parameters...</p>
                </div>
            )}

            {!loading && meals.length === 0 && (
                <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center', padding: '4rem 2rem' }}>
                    <Utensils size={48} style={{ opacity: 0.1, marginBottom: '1.5rem', display: 'inline-block', color: 'var(--text-main)' }} />
                    <p style={{ fontSize: '1.2rem', color: noMatchMsg ? 'var(--danger)' : 'var(--text-main)', fontWeight: 600 }}>
                        {noMatchMsg || 'Hit "Refresh Plan" to compute your first meal sequence.'}
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 0' }}>
                        {noMatchMsg ? 'Try relaxing your filters or adjusting your pantry input.' : 'We use your profile data to make sure these meals perfectly match your goals.'}
                    </p>
                </div>
            )}

            {!loading && meals.length > 0 && (
                <div className="grid-cols-2">
                    {meals.map((meal, index) => (
                        <div key={index} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="label-tag" style={{ background: `rgba(${meal.type==='Breakfast'?'245, 158, 11':meal.type==='Lunch'?'16, 185, 129':meal.type==='Dinner'?'99, 102, 241':'139, 92, 246'}, 0.15)`, color: mealColors[meal.type] || 'var(--primary)', border: `1px solid rgba(${meal.type==='Breakfast'?'245, 158, 11':meal.type==='Lunch'?'16, 185, 129':meal.type==='Dinner'?'99, 102, 241':'139, 92, 246'}, 0.3)` }}>
                                    {meal.type}
                                </span>
                                <span className="label-tag" style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                                    {meal.calories} kcal
                                </span>
                            </div>
                            
                            <h2 style={{ fontSize: '1.25rem', lineHeight: '1.4', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>{meal.name}</h2>
                            
                            {/* Always show ingredients if we have them */}
                            {meal.ingredients && !meal.matchedIngredients && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                                    {meal.ingredients.map(ing => (
                                        <span key={ing} style={{ background: 'var(--bg-surface)', color: 'var(--text-sub)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Ingredient match mode */}
                            {meal.matchedIngredients && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                                    {meal.matchedIngredients.map(ing => (
                                        <span key={ing} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                            <CheckCircle2 size={14}/> {ing}
                                        </span>
                                    ))}
                                    {meal.missingIngredients && meal.missingIngredients.map(ing => (
                                        <span key={ing} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                            <AlertCircle size={14}/> {ing}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <Info color="var(--primary)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: '1.6' }}>{meal.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MealPlan;
