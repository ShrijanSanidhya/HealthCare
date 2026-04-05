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
        
        // Dynamic Health Score logic
        let dynamicScore = 50 + (user.streak * 2); // default 50 + streak bonus
        const recentHistory = user.history.slice(-7);
        recentHistory.forEach(log => {
             const diff = Math.abs(log.intakeCalories - targetCalories);
             if (log.intakeCalories > 0 && diff <= 300) dynamicScore += 3; // accuracy bonus
             else if (log.intakeCalories > 0 && diff > 800) dynamicScore -= 2;
             
             if (log.burnedCalories >= 150) dynamicScore += 3; // exercise bonus
             if (log.waterGlasses >= 8) dynamicScore += 1;
        });
        dynamicScore = Math.max(0, Math.min(100, dynamicScore));
        
        if (user.healthScore !== dynamicScore) {
             user.healthScore = dynamicScore; // cache it
             await user.save();
        }
        
        res.json({
            user,
            targetCalories,
            healthScore: dynamicScore,
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

exports.getWeeklyInsights = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({error: "User not found"});
        
        const history = user.history.slice(-7);
        let insights = [];
        const tdee = calculateTDEE(user.weight, user.height, user.age, user.activityLevel, user.goal);
        
        let overeatDays = 0;
        let undereatDays = 0;
        let hydratedDays = 0;
        
        history.forEach(log => {
             if (log.intakeCalories > tdee + 250) overeatDays++;
             else if (log.intakeCalories > 0 && log.intakeCalories < tdee - 500) undereatDays++;
             if (log.waterGlasses >= 8) hydratedDays++;
        });

        if (overeatDays >= 2) {
             insights.push({ type: 'warning', text: `You've exceeded your target calories on ${overeatDays} days recently (Overeating pattern). Try incorporating more high-volume, low-calorie foods to stay full.`});
        }
        if (undereatDays >= 2) {
             insights.push({ type: 'warning', text: `You might be skipping meals or undereating (${undereatDays} days). Ensure you eat enough complex carbs and proteins to fuel your metabolism and recovery.`});
        }
        if (overeatDays > 0 && undereatDays > 0) {
             insights.push({ type: 'info', text: `We noticed a nutrient imbalance: fluctuating heavily between high and low calorie days. Consistency is key for achieving your goal.`});
        }
        
        if (insights.length === 0) {
             insights.push({ type: 'success', text: "Perfect balance! You're consistently hitting your macros and targets. Keep up the excellent habits!" });
        }
        
        res.json({ insights });
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
    try {
        const timeLimit = parseInt(req.query.time) || 30; // default to 30 if not provided
        const allWorkouts = [
            { id: 1, name: 'Quick Stretching', duration: 10, intensity: 'Low', type: 'Flexibility' },
            { id: 2, name: 'HIIT Core Express', duration: 10, intensity: 'High', type: 'Cardio' },
            { id: 3, name: 'Brisk Walk', duration: 15, intensity: 'Low', type: 'Cardio' },
            { id: 4, name: 'Dumbbell Quick Circuit', duration: 15, intensity: 'Medium', type: 'Strength' },
            { id: 5, name: 'Active Recovery Yoga', duration: 30, intensity: 'Low', type: 'Flexibility' },
            { id: 6, name: 'Upper Body Blast', duration: 30, intensity: 'High', type: 'Strength' },
            { id: 7, name: 'Full Body Strength', duration: 45, intensity: 'Medium', type: 'Strength' },
            { id: 8, name: 'Endurance Run', duration: 60, intensity: 'High', type: 'Cardio' },
        ];
        
        // Filter by available time
        const suggested = allWorkouts.filter(w => w.duration <= timeLimit);
        // Shuffle and pick top 3
        const result = suggested.sort(() => 0.5 - Math.random()).slice(0, 3).map(w => ({
            ...w,
            duration: `${w.duration} min`
        }));
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
