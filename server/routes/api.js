const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

// User Profile & Gamification
router.post('/profile', auth, userController.updateProfile);
router.get('/dashboard', auth, userController.getDashboard);
router.post('/log-day', auth, userController.logDay);
router.get('/insights', auth, userController.getWeeklyInsights);

// AI & Recommendations
router.get('/meal-plan', auth, userController.getMealPlan);
router.get('/workouts', auth, userController.getWorkouts);
router.post('/chat', auth, userController.chatAssistant);

module.exports = router;
