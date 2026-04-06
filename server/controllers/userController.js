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
            { id: 'v1', type: 'Breakfast', name: 'Oatmeal with Fruits & Nuts', calories: 350, proteinGrams: 10, prepTime: 5, ingredients: ['oats', 'milk', 'apple', 'banana', 'nuts'], explanation: 'High in fiber for sustained morning energy.' },
            { id: 'v2', type: 'Breakfast', name: 'Avocado Toast with Greek Yogurt', calories: 400, proteinGrams: 15, prepTime: 10, ingredients: ['bread', 'avocado', 'yogurt', 'olive oil'], explanation: 'Healthy fats paired with protein for fullness.' },
            { id: 'v3', type: 'Lunch', name: 'Quinoa and Roasted Chickpea Salad', calories: 500, proteinGrams: 18, prepTime: 20, ingredients: ['quinoa', 'chickpeas', 'tomato', 'cucumber', 'lemon'], explanation: 'Complete protein source for muscle recovery.' },
            { id: 'v4', type: 'Lunch', name: 'Lentil Soup with Whole Grain Bread', calories: 450, proteinGrams: 22, prepTime: 30, ingredients: ['lentils', 'onion', 'carrot', 'celery', 'bread'], explanation: 'Rich in iron and fiber, excellent for digestion.' },
            { id: 'v5', type: 'Dinner', name: 'Tofu Stir-fry with Brown Rice', calories: 550, proteinGrams: 25, prepTime: 15, ingredients: ['tofu', 'rice', 'broccoli', 'soy sauce', 'garlic'], explanation: 'Low glycemic index and high protein.' },
            { id: 'v6', type: 'Dinner', name: 'Paneer Tikka with Mixed Greens', calories: 500, proteinGrams: 20, prepTime: 25, ingredients: ['paneer', 'spinach', 'onion', 'tomato', 'spices'], explanation: 'Calcium and protein-rich dinner.' },
            { id: 'v7', type: 'Snack', name: 'Mixed Nuts & Apple', calories: 200, proteinGrams: 5, prepTime: 2, ingredients: ['nuts', 'apple'], explanation: 'Quick energy boost with essential micronutrients.' }
        ],
        nonVeg: [
             { id: 'nv1', type: 'Breakfast', name: 'Scrambled Eggs with Spinach', calories: 350, proteinGrams: 20, prepTime: 10, ingredients: ['eggs', 'spinach', 'butter', 'salt'], explanation: 'High quality amino acids to kickstart your day.' },
             { id: 'nv2', type: 'Breakfast', name: 'Chicken Sausage & Multigrain Bread', calories: 400, proteinGrams: 22, prepTime: 15, ingredients: ['chicken sausage', 'bread', 'mustard'], explanation: 'Lean protein for a filling morning.' },
             { id: 'nv3', type: 'Lunch', name: 'Grilled Chicken Breast with Quinoa', calories: 500, proteinGrams: 35, prepTime: 25, ingredients: ['chicken breast', 'quinoa', 'olive oil', 'broccoli', 'lemon'], explanation: 'Classic lean protein and complex carbs.' },
             { id: 'nv4', type: 'Lunch', name: 'Salmon with Roasted Sweet Potatoes', calories: 600, proteinGrams: 30, prepTime: 30, ingredients: ['salmon', 'sweet potato', 'olive oil', 'garlic'], explanation: 'Rich in Omega-3 for brain and heart health.' },
             { id: 'nv5', type: 'Dinner', name: 'Turkey Meatballs with Zucchini Noodles', calories: 450, proteinGrams: 28, prepTime: 20, ingredients: ['turkey', 'zucchini', 'tomato sauce', 'onion'], explanation: 'Low calorie, high protein dinner option.' },
             { id: 'nv6', type: 'Dinner', name: 'Shrimp Curry with Cauliflower Rice', calories: 400, proteinGrams: 25, prepTime: 20, ingredients: ['shrimp', 'cauliflower', 'coconut milk', 'curry powder', 'garlic'], explanation: 'Light and highly nutritious evening meal.' },
             { id: 'nv7', type: 'Snack', name: 'Greek Yogurt and Tuna Salad', calories: 250, proteinGrams: 18, prepTime: 5, ingredients: ['yogurt', 'tuna', 'celery', 'onion'], explanation: 'Double protein hit without heavy carbs.' }
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
            badges: user.badges || [],
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
        
        if (!user.badges) user.badges = [];
        if (user.streak >= 3 && !user.badges.includes('🔥 3-Day Fire')) user.badges.push('🔥 3-Day Fire');
        if (user.streak >= 7 && !user.badges.includes('🏆 7-Day Champion')) user.badges.push('🏆 7-Day Champion');
        if (Number(waterGlasses) >= 8 && !user.badges.includes('💧 Hydration Hero')) user.badges.push('💧 Hydration Hero');
        
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
        // Base pool based on diet
        let pool = (diet === 'veg' || diet === 'vegan') ? dataset.veg : dataset.nonVeg;
        
        // Advanced Filters
        const { ingredients, highProtein, quickMeals, lowCalorie } = req.query;
        
        if (highProtein === 'true') {
            pool = pool.filter(m => m.proteinGrams >= 20); // arbitrary threshold for high protein
        }
        if (quickMeals === 'true') {
            pool = pool.filter(m => m.prepTime <= 15);
        }
        if (lowCalorie === 'true') {
            pool = pool.filter(m => m.calories <= 400);
        }
        
        let currentMeals = [];

        // If ingredients are provided, perform smart matching
        if (ingredients && ingredients.trim().length > 0) {
            const userIngredients = ingredients.toLowerCase().split(',').map(i => i.trim()).filter(Boolean);
            
            // Score meals and attach missing ingredients
            const scoredPool = pool.map(meal => {
                const available = [];
                const missing = [];
                
                meal.ingredients.forEach(ing => {
                    // Simple partial string match check (e.g. 'tomato' matching 'tomatoes')
                    const hasMatch = userIngredients.some(ui => ing.includes(ui) || ui.includes(ing));
                    if (hasMatch) {
                        available.push(ing);
                    } else {
                        missing.push(ing);
                    }
                });
                
                return {
                    ...meal,
                    matchedIngredients: available,
                    missingIngredients: missing,
                    matchScore: available.length, // Primary sort key
                    missingCount: missing.length  // Secondary sort key
                };
            }).filter(meal => meal.matchScore > 0); // Must match at least 1 ingredient
            
            // Sort by highest match score, then by lowest missing count
            scoredPool.sort((a, b) => {
                if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
                return a.missingCount - b.missingCount;
            });

            // Fallback: If no matches at all
            if (scoredPool.length === 0) {
                return res.json({ noMatch: true, message: "No meals found with current ingredients. Try adding more items." });
            }

            // Pick highest scoring meals, trying to keep a balance if possible, or just the top 4
            // Since ingredient-based tends to be limited, we'll just provide the best matches across any category
            // But let's try to group top matches by type to give a proper 'plan'
            const bestBreakfast = scoredPool.find(m => m.type === 'Breakfast');
            const bestLunch = scoredPool.find(m => m.type === 'Lunch');
            const bestDinner = scoredPool.find(m => m.type === 'Dinner');
            const bestSnack = scoredPool.find(m => m.type === 'Snack');
            
            // If they don't have a perfect plan out of matches, supplement with other top matches
            const selected = [bestBreakfast, bestLunch, bestDinner, bestSnack].filter(Boolean);
            if (selected.length < (scoredPool.length > 4 ? 4 : scoredPool.length)) {
                for (let meal of scoredPool) {
                    if (!selected.find(s => s.id === meal.id)) selected.push(meal);
                    if (selected.length >= 4) break;
                }
            }
            
            currentMeals = selected;
        } else {
            // Standard Generation Logic
            if (pool.length === 0) {
                return res.json({ noMatch: true, message: "No meals found matching your current filters." });
            }
            const breakfasts = pool.filter(m => m.type === 'Breakfast');
            const lunches = pool.filter(m => m.type === 'Lunch');
            const dinners = pool.filter(m => m.type === 'Dinner');
            const snacks = pool.filter(m => m.type === 'Snack');
            
            // Use fallback to 0th elements if a category is empty due to strict filters
            currentMeals = [
                 breakfasts[Math.floor(Math.random() * breakfasts.length)] || pool[0],
                 lunches[Math.floor(Math.random() * lunches.length)] || pool[1] || pool[0],
                 dinners[Math.floor(Math.random() * dinners.length)] || pool[2] || pool[0],
                 snacks[Math.floor(Math.random() * snacks.length)] || pool[3] || pool[0]
            ];
            // Remove duplicates if filters made the pool extremely small
            currentMeals = [...new Set(currentMeals)];
        }
        
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
        
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({error: "User not found"});
        
        let reply = "I am a smart AI but currently I am learning! You can ask me about proteins, hydration, or what you should eat today based on your profile.";
        
        if (msg.includes('eat today') || msg.includes('what should i eat') || msg.includes('food') || msg.includes('meal')) {
             if (user.currentMealPlan && user.currentMealPlan.length > 0) {
                 const meal = user.currentMealPlan[0]; // grab the first meal from their generated plan
                 reply = `Since you mentioned your goal is to ${user.goal} weight, I highly recommend checking out your AI generated Meal Plan! For instance, right now you could have "${meal.name}" (${meal.calories} kcal) which perfectly matches your ${user.diet} preference!`;
             } else {
                 reply = `I don't see an active meal plan generated for you yet, ${user.name}. Head over to the Meals tab and click "Regenerate Plan" to get a customized ${user.diet} plan to help you ${user.goal} weight!`;
             }
        } else if (msg.includes('protein')) {
             const sources = (user.diet === 'veg' || user.diet === 'vegan') ? 'lentils, tofu, chickpeas, or quinoa' : 'chicken breasts, salmon, eggs, or lean turkey';
             reply = `To hit your protein targets on a ${user.diet} diet, try incorporating ${sources} into your meals. They're excellent fuel!`;
        } else if (msg.includes('water') || msg.includes('hydrate')) {
             reply = `Remember to drink at least 8 glasses (about 2 liters) of water daily. Proper hydration boosts metabolism and maintains your streak, ${user.name}!`;
        } else if (msg.includes('calorie') || msg.includes('fat') || msg.includes('lose weight')) {
             const tdee = calculateTDEE(user.weight, user.height, user.age, user.activityLevel, user.goal);
             reply = `To effectively reach your goal to ${user.goal}, your calculated TDEE energy target is exactly ${tdee} kcal per day. Check the dashboard to track this limit!`;
        } else if (msg.includes('tired') || msg.includes('sleep')) {
             reply = `Feeling tired? Ensure you're getting 7-9 hours of sleep and eating enough complex carbs (like oats or brown rice) to maintain energy levels for your ${user.activityLevel} lifestyle.`;
        } else if (msg.includes('hello') || msg.includes('hi')) {
             reply = `Hello ${user.name}! I'm your intelligent FitAI assistant. How are you tracking against your goal to ${user.goal} weight today?`;
        }
        
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
