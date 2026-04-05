import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const { api, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        age: '', weight: '', height: '', goal: 'maintain', diet: 'any', activityLevel: 'moderate'
    });

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/profile', formData);
            setUser(res.data);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="auth-container glass-card animate-fade-in" style={{maxWidth: '600px'}}>
            <h2 className="text-gradient">Complete Your Profile</h2>
            <p>Help us personalize your experience to calculate accurate TDEE and meals.</p>
            
            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <div className="grid-cols-2">
                     <div>
                        <label>Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                     </div>
                     <div>
                        <label>Weight (kg)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
                     </div>
                     <div>
                        <label>Height (cm)</label>
                        <input type="number" name="height" value={formData.height} onChange={handleChange} required />
                     </div>
                     <div>
                        <label>Goal</label>
                        <select name="goal" value={formData.goal} onChange={handleChange}>
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain Muscle/Weight</option>
                        </select>
                     </div>
                </div>
                
                <div style={{marginTop: '1rem'}}>
                    <label>Dietary Preference</label>
                    <select name="diet" value={formData.diet} onChange={handleChange}>
                        <option value="any">Any / Non-Veg</option>
                        <option value="veg">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                    </select>
                </div>

                <div style={{marginTop: '1rem'}}>
                    <label>Activity Level</label>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                        <option value="sedentary">Sedentary (office job)</option>
                        <option value="light">Lightly Active</option>
                        <option value="moderate">Moderately Active</option>
                        <option value="active">Active (Workout 3-5 days/wk)</option>
                        <option value="very-active">Very Active</option>
                    </select>
                </div>
                
                <br/>
                <button type="submit">Complete Setup</button>
            </form>
        </div>
    )
}
export default Onboarding;
