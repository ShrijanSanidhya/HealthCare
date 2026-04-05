const User = require('../models/User');

const calculateTDEE = (weight, height, age, activityLevel, goal) => {
    // Mifflin-St Jeor Equation (Approx)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5; 
    
    let multiplier = 1.2;
    switch(activityLevel) {
        case 'sedentary': multiplier = 1.2; break;
        case 'light': multiplier = 1.375; break;
        case 'moderate': multiplier = 1.55; break;
        case 'active': multiplier = 1.725; break;
        case 'very-active': multiplier = 1.9; break;
    }
    
    let tdee = bmr * multiplier;
    if (goal === 'lose') tdee -= 500;
    if (goal === 'gain') tdee += 500;
    
    return Math.round(tdee);
};

const getMealsDataset = () => {
    return {
        veg: [
            { id: 'v1', type: 'Breakfast', name: 'Oatmeal with Fruits & Nuts', calories: 350, explanation: 'High in fiber for sustained morning energy.' },
            { id: 'v2', type: 'Breakfast', name: 'Avocado Toast with Greek Yogurt', calories: 400, explanation: 'Healthy fats paired with protein for fullness.' },
            { id: 'v3', type: 'Lunch', name: 'Quinoa and Roasted Chickpea Salad', calories: 500, explanation: 'Complete protein source for muscle recovery.' },
            { id: 'v4', type: 'Lunch', name: 'Lentil Soup with Whole Grain Bread', calories: 450, explanation: 'Rich in iron and fiber, excellent for digestion.' },
            { id: 'v5', type: 'Dinner', name: 'Tofu Stir-fry with Brown Rice', calories: 550, explanation: 'Low glycemic index and high protein.' },
            { id: 'v6', type: 'Dinner', name: 'Paneer Tikka with Mixed Greens', calories: 500, explanation: 'Calcium and protein-rich dinner.' },
            { id: 'v7', type: 'Snack', name: 'Mixed Nuts & Apple', calories: 200, explanation: 'Quick energy boost with essential micronutrients.' }
        ],
        nonVeg: [
             { id: 'nv1', type: 'Breakfast', name: 'Scrambled Eggs with Spinach', calories: 350, explanation: 'High quality amino acids to kickstart your day.' },
             { id: 'nv2', type: 'Breakfast', name: 'Chicken Sausage & Multigrain Bread', calories: 400, explanation: 'Lean protein for a filling morning.' },
             { id: 'nv3', type: 'Lunch', name: 'Grilled Chicken Breast with Quinoa', calories: 500, explanation: 'Classic lean protein and complex carbs.' },
             { id: 'nv4', type: 'Lunch', name: 'Salmon with Roasted Sweet Potatoes', calories: 600, explanation: 'Rich in Omega-3 for brain and heart health.' },
             { id: 'nv5', type: 'Dinner', name: 'Turkey Meatballs with Zucchini Noodles', calories: 450, explanation: 'Low calorie, high protein dinner option.' },
             { id: 'nv6', type: 'Dinner', name: 'Shrimp Curry with Cauliflower Rice', calories: 400, explanation: 'Light and highly nutritious evening meal.' },
             { id: 'nv7', type: 'Snack', name: 'Greek Yogurt and Tuna Salad', calories: 250, explanation: 'Double protein hit without heavy carbs.' }
        ]
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user.age || !user.weight || !user.height || !user.goal) {
             return res.json({ requiresOnboarding: true, user });
        }
        
        const targetCalories = calculateTDEE(user.weight, user.height, user.age, user.activityLevel, user.goal);
        
        res.json({
            user,
            targetCalories,
            healthScore: user.healthScore,
            streak: user.streak,
            history: user.history
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.logDay = async (req, res) => {
    try {
        const { date, intakeCalories, burnedCalories, waterGlasses } = req.body;
        const user = await User.findById(req.userId);
        
        let logIndex = user.history.findIndex(h => h.date === date);
        if(logIndex !== -1) {
             user.history[logIndex].intakeCalories += Number(intakeCalories || 0);
             user.history[logIndex].burnedCalories += Number(burnedCalories || 0);
             user.history[logIndex].waterGlasses += Number(waterGlasses || 0);
        } else {
             user.history.push({ date, intakeCalories: Number(intakeCalories||0), burnedCalories: Number(burnedCalories||0), waterGlasses: Number(waterGlasses||0) });
        }
        
        if(waterGlasses >= 8) {
            user.healthScore = Math.min(100, user.healthScore + 2);
        }
        
        await user.save();
        res.json(user);
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
}

exports.getMealPlan = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const { diet } = user;
        const dataset = getMealsDataset();
        const pool = (diet === 'veg' || diet === 'vegan') ? dataset.veg : dataset.nonVeg;
        
        const breakfasts = pool.filter(m => m.type === 'Breakfast');
        const lunches = pool.filter(m => m.type === 'Lunch');
        const dinners = pool.filter(m => m.type === 'Dinner');
        const snacks = pool.filter(m => m.type === 'Snack');
        
        const currentMeals = [
             breakfasts[Math.floor(Math.random() * breakfasts.length) || 0],
             lunches[Math.floor(Math.random() * lunches.length) || 0],
             dinners[Math.floor(Math.random() * dinners.length) || 0],
             snacks[0] || dataset.veg[6]
        ];
        
        user.currentMealPlan = currentMeals;
        await user.save();
        res.json({ currentMeals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getWorkouts = async (req, res) => {
     res.json([
         { name: 'HIIT Core Express', duration: '15 min', intensity: 'High', type: 'Cardio' },
         { name: 'Full Body Strength', duration: '45 min', intensity: 'Medium', type: 'Strength' },
         { name: 'Active Recovery Yoga', duration: '30 min', intensity: 'Low', type: 'Flexibility' }
     ]);
}

exports.chatAssistant = async (req, res) => {
    try {
        const { message } = req.body;
        const msg = message.toLowerCase();
        let reply = "I am a smart AI but currently I am learning! You can ask me about proteins, hydration, or weight loss tips.";
        
        if (msg.includes('protein')) {
             reply = "To get more protein, try incorporating eggs, chicken breasts, lentils, or Greek yogurt into your meals. They're excellent sources!";
        } else if (msg.includes('water') || msg.includes('hydrate')) {
             reply = "Remember to drink at least 8 glasses (about 2 liters) of water daily. Proper hydration boosts metabolism!";
        } else if (msg.includes('calorie') || msg.includes('fat') || msg.includes('lose weight')) {
             reply = "To burn fat effectively, focus on a caloric deficit from your TDEE and integrate strength training to maintain muscle mass.";
        } else if (msg.includes('tired') || msg.includes('sleep')) {
             reply = "Feeling tired? Ensure you're getting 7-9 hours of sleep and eating enough complex carbs like sweet potatoes or oats for sustained energy.";
        } else if (msg.includes('hello') || msg.includes('hi')) {
             reply = "Hello there! I'm your FitAI assistant. How can I help you reach your health goals today?";
        }
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
