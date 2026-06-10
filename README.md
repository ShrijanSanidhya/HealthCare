# FitAI - Health and Fitness Planner

FitAI is a full-stack, AI-powered health planning and fitness tracking application designed to help users achieve their health goals. The application calculates nutritional targets, suggests meal plans, provides custom workouts, tracks daily activity metrics, and offers a personal health chatbot assistant.

## Project Structure

The project is structured as a monorepo containing the following directories:

*   **client**: A modern frontend application built with React, Vite, and styled with vanilla CSS.
*   **server**: A backend API built with Node.js, Express, and MongoDB.

## Features

### 1. User Onboarding and Dashboard
*   **Onboarding Flow**: Collects user metrics (weight, height, age, gender, activity level, dietary preference, and fitness goals) to customize the application experience.
*   **Activity Dashboard**: Tracks calorie intake, burned calories, and daily water consumption.
*   **Dynamic Health Score**: Evaluates user consistency based on target calorie adherence, hydration levels, and exercise frequency.
*   **Streak Tracker**: Tracks consecutive days of activity logs to build habits.

### 2. Personalized Meal Planning
*   **Dietary Customization**: Generates personalized meal plans for vegetarian, vegan, and non-vegetarian preferences.
*   **Ingredient Matching**: Recommends recipes based on ingredients the user currently has in their kitchen, listing matching and missing ingredients.
*   **Dietary Filters**: Filters recipes for high protein, quick preparation (under 15 minutes), and low-calorie targets.

### 3. Workout Management
*   **Time-Optimized Workouts**: Generates routine recommendations based on the user's available time.
*   **Guided Workouts**: Includes step-by-step instructions, visual exercise progress, and active countdown timers.
*   **Fitclips Video Feed**: Offers a vertical feed of short workout video tutorials customized for the user's fitness goals, with options to save clips or add them directly to the day's training plan.

### 4. AI Health Assistant
*   **Intelligent Chatbot**: Answers nutrition and fitness queries, suggests ingredient substitutes, reminds users of hydration requirements, and calculates energy targets based on user profiles.

### 5. Gamification
*   **Achievements**: Grants performance badges such as the "3-Day Fire" and "Hydration Hero" based on logging streaks and hydration goals.

---

## Tech Stack

### Frontend
*   React
*   Vite
*   React Router (Routing)
*   Axios (HTTP client)
*   Lucide React (Icons)
*   Recharts (Data visualization)
*   React Hot Toast (Notifications)

### Backend
*   Node.js & Express
*   MongoDB & Mongoose (Database & ORM)
*   JWT & BcryptJS (Authentication)

---

## Setup and Installation

### Prerequisites
*   Node.js (version 18 or higher recommended)
*   MongoDB installed and running locally

### Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by creating a `.env` file in the `server` directory:
    ```env
    MONGODB_URI=mongodb://127.0.0.1:27017/fitai
    JWT_SECRET=your_jwt_secret_key
    PORT=5005
    ```
4.  Start the backend development server:
    ```bash
    npm run dev
    ```
    The server will start running at `http://localhost:5005`.

### Frontend Setup
1.  Navigate to the client directory:
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by creating a `.env` file in the `client` directory:
    ```env
    VITE_API_URL=http://localhost:5005/api
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The app will start running at `http://localhost:5173`. Open this URL in your browser to view the application.