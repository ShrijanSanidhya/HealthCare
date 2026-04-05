const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Health Profile
    age: { type: Number },
    weight: { type: Number }, // in kg
    height: { type: Number }, // in cm
    goal: { type: String, enum: ['lose', 'maintain', 'gain'] },
    diet: { type: String, enum: ['veg', 'non-veg', 'vegan', 'any'] },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'] },
    
    // Gamification & Tracking
    healthScore: { type: Number, default: 50 },
    streak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    
    // Daily Logs (embedded for simplicity in this project)
    history: [{
        date: { type: String }, // 'YYYY-MM-DD'
        intakeCalories: { type: Number, default: 0 },
        burnedCalories: { type: Number, default: 0 },
        waterGlasses: { type: Number, default: 0 }
    }],
    
    // Current Meal Plan
    currentMealPlan: { type: Object, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
