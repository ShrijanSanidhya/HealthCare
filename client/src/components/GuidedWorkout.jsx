import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, CheckCircle, Trophy } from 'lucide-react';

const WORKOUT_DICTIONARY = {
  'Upper Body Blast': [
    {
      name: 'Push-ups',
      image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80',
      steps: [
        'Start in a high plank position with your hands slightly wider than shoulder-width.',
        'Keep your body in a straight line from head to heels.',
        'Lower your body until your chest nearly touches the floor.',
        'Push yourself back up to the starting position.'
      ]
    },
    {
      name: 'Dumbbell Rows',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
      steps: [
        'Hinge forward from the hips, keeping your back flat.',
        'Hold a dumbbell in each hand with arms hanging straight down.',
        'Pull the dumbbells up to your ribcage, squeezing your shoulder blades together.',
        'Slowly lower the dumbbells back to the starting position.'
      ]
    },
    {
      name: 'Shoulder Taps',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
      steps: [
        'Begin in a high plank position with your core engaged.',
        'Lift your right hand and tap your left shoulder.',
        'Return your right hand to the ground.',
        'Lift your left hand and tap your right shoulder, alternating sides.'
      ]
    },
    {
      name: 'Tricep Dips',
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
      steps: [
        'Sit on the edge of a sturdy chair or bench, hands gripping the edge beside your hips.',
        'Slide off the edge, extending your legs out in front of you.',
        'Lower your body by bending your elbows until they reach a 90-degree angle.',
        'Push back up using your triceps.'
      ]
    }
  ],
  'Quick Stretching': [
    {
      name: 'Neck Stretch',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      steps: [
        'Sit or stand tall with your shoulders relaxed.',
        'Gently tilt your head to the right, bringing your ear toward your shoulder.',
        'Hold for 20 seconds, then return to center.',
        'Repeat on the left side.'
      ]
    },
    {
      name: 'Hamstring Stretch',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
      steps: [
        'Sit on the floor with one leg extended straight and the other bent inward.',
        'Reach toward the toes of your extended leg, keeping your back straight.',
        'Hold the stretch for 30 seconds.',
        'Switch legs and repeat.'
      ]
    },
    {
      name: 'Quad Stretch',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
      steps: [
        'Stand tall, using a wall for balance if necessary.',
        'Bend your right knee, bringing your heel toward your glutes.',
        'Grasp your right ankle with your right hand and gently pull.',
        'Hold for 30 seconds, then switch legs.'
      ]
    },
    {
      name: 'Arm Stretch',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      steps: [
        'Bring one arm across your chest, keeping it straight.',
        'Use your opposite hand to gently press the arm straight into your chest.',
        'Hold for 20 seconds to stretch the shoulder.',
        'Switch arms and repeat.'
      ]
    }
  ],
  'Dumbbell Quick Circuit': [
    {
      name: 'Squats',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
      steps: [
        'Hold a dumbbell in each hand, resting them lightly on your shoulders.',
        'Stand with feet shoulder-width apart.',
        'Lower your body by pushing your hips back and bending your knees.',
        'Push through your heels to return to the starting position.'
      ]
    },
    {
      name: 'Shoulder Press',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      steps: [
        'Stand tall with dumbbells held at shoulder level, palms facing forward.',
        'Brace your core and press the weights directly overhead.',
        'Pause briefly at the top.',
        'Slowly lower the dumbbells back to shoulder level.'
      ]
    },
    {
      name: 'Lunges',
      image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80',
      steps: [
        'Hold dumbbells at your sides and stand tall.',
        'Step forward with your right leg, lowering your hips until both knees are bent at a 90-degree angle.',
        'Push off your right foot to return to the start.',
        'Repeat alternating legs.'
      ]
    },
    {
      name: 'Plank',
      image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80',
      steps: [
        'Place your forearms on the floor, elbows aligned directly below shoulders.',
        'Extend your legs straight back, resting on your toes.',
        'Keep your body in a straight line, engaging your core.',
        'Hold the position for 30-60 seconds.'
      ]
    }
  ]
};

// Fallback logic for any workout not explicitly defined
const getWorkoutExercises = (workoutName) => {
    if (WORKOUT_DICTIONARY[workoutName]) return WORKOUT_DICTIONARY[workoutName];
    // Generic fallback mapping
    return [
        {
            name: 'Warm up movement',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
            steps: ['Get ready and loosen up.', 'Focus on your breathing.', 'Prepare for the workout.']
        },
        {
            name: 'Core Activation',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
            steps: ['Engage your core.', 'Maintain a steady pace.', 'Keep strict form.']
        },
        {
            name: 'Main Movement',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
            steps: ['Execute the primary movement pattern.', 'Breathe out on exertion.', 'Control the movement.']
        },
        {
            name: 'Cool Down',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
            steps: ['Stretch out activated muscles.', 'Regulate your breathing.', 'Hydrate.']
        }
    ];
};

const GuidedWorkout = ({ workout, onEnd }) => {
    const exercises = getWorkoutExercises(workout.name);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Lock body scroll when active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
             document.body.style.overflow = 'auto';
        };
    }, []);

    const handleNext = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (isCompleted) {
        return (
            <div className="guided-workout-overlay animate-fade-in">
                <div className="guided-workout-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <Trophy size={80} color="var(--accent)" style={{ margin: '0 auto', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(220,163,88,0.6))' }} />
                        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Workout Complete!</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Incredible effort completing {workout.name}.</p>
                    </div>
                    <button onClick={onEnd} style={{ maxWidth: '250px', padding: '1rem', fontSize: '1.1rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                        Return to Workouts
                    </button>
                    {/* Confetti effect via CSS */}
                    <div className="confetti-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                       <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(133,154,81,0.2) 0%, rgba(0,0,0,0) 70%)'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    const exercise = exercises[currentIndex];
    const progress = ((currentIndex + 1) / exercises.length) * 100;

    return (
        <div className="guided-workout-overlay animate-fade-in">
            <div className="guided-workout-header">
                <button onClick={onEnd} className="back-btn">
                    <X size={24} />
                    <span>Exit Session</span>
                </button>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="exercise-counter">
                    Exercise {currentIndex + 1} of {exercises.length}
                </div>
            </div>

            <div className="guided-workout-container">
                <div className="glass-card exercise-card animate-fade-in" key={currentIndex}>
                    <div className="exercise-image-wrapper">
                        <img src={exercise.image} alt={exercise.name} className="exercise-image" />
                    </div>
                    
                    <div className="exercise-content">
                        <h2 className="exercise-title">{exercise.name}</h2>
                        
                        <div className="exercise-steps">
                            {exercise.steps.map((step, idx) => (
                                <div key={idx} className="step-item">
                                    <div className="step-number">{idx + 1}</div>
                                    <p className="step-text">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="guided-workout-controls">
                    <button 
                         onClick={handlePrev} 
                         disabled={currentIndex === 0}
                         className={`nav-btn secondary ${currentIndex === 0 ? 'disabled' : ''}`}
                    >
                        <ArrowLeft size={20} /> Previous
                    </button>
                    <button onClick={handleNext} className="nav-btn primary">
                        {currentIndex === exercises.length - 1 ? (
                            <>Finish <CheckCircle size={20} /></>
                        ) : (
                            <>Next <ArrowRight size={20} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuidedWorkout;
