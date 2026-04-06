import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Info, RefreshCw, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
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
            
            <div className="glass-card" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>Smart Meal Generator</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate meals based on what you have in your kitchen or apply special filters.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available Ingredients (comma separated)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. chicken, rice, broccoli" 
                        value={ingredientsInput}
                        onChange={e => setIngredientsInput(e.target.value)}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                        onKeyDown={e => e.key === 'Enter' && generateMealPlan()}
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={filters.highProtein} onChange={e => setFilters({...filters, highProtein: e.target.checked})} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                        High Protein (20g+)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={filters.quickMeals} onChange={e => setFilters({...filters, quickMeals: e.target.checked})} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                        Quick Meals (&lt;15m)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={filters.lowCalorie} onChange={e => setFilters({...filters, lowCalorie: e.target.checked})} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                        Low Calorie (&lt;400kcal)
                    </label>
                </div>
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
                    <p style={{ color: 'var(--primary)' }}>Analyzing ingredients and profiles...</p>
                </div>
            )}

            {!loading && meals.length === 0 && (
                <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
                    <Utensils size={40} style={{ opacity: 0.3, marginBottom: '1rem', display: 'inline-block' }} />
                    <p style={{ fontSize: '1.1rem', color: noMatchMsg ? '#f87171' : 'inherit' }}>
                        {noMatchMsg || 'Click "Regenerate Plan" to get your personalized meals.'}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {noMatchMsg ? 'Try adjusting your filters or adding different ingredients.' : 'Make sure you have completed your health profile first.'}
                    </p>
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
                        
                        {/* Always show ingredients if we have them */}
                        {meal.ingredients && !meal.matchedIngredients && (
                            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {meal.ingredients.map(ing => (
                                    <span key={ing} style={{ background: 'rgba(255,255,255,0.1)', color: '#ccc', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Ingredient match mode */}
                        {meal.matchedIngredients && (
                            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {meal.matchedIngredients.map(ing => (
                                    <span key={ing} style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle2 size={12}/> {ing}
                                    </span>
                                ))}
                                {meal.missingIngredients && meal.missingIngredients.map(ing => (
                                    <span key={ing} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <AlertCircle size={12}/> {ing}
                                    </span>
                                ))}
                            </div>
                        )}

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
