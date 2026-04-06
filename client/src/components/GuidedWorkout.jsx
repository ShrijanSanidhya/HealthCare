import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, CheckCircle, Trophy, Dumbbell } from 'lucide-react';

const WORKOUT_DICTIONARY = {
  'Upper Body Blast': [
    {
      name: 'Push-ups',
      steps: [
        {
          text: 'Get into a high plank — hands shoulder-width apart, body straight.',
          image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=900&q=85'
        },
        {
          text: 'Engage your core and keep your elbows at a 45° angle.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85'
        },
        {
          text: 'Lower your chest slowly until it almost touches the floor.',
          image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=900&q=85'
        },
        {
          text: 'Push explosively back up to the starting position.',
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85'
        }
      ]
    },
    {
      name: 'Dumbbell Rows',
      steps: [
        {
          text: 'Hinge forward at the hips, keeping your back flat and parallel to the floor.',
          image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85'
        },
        {
          text: 'Hold a dumbbell in each hand with arms hanging straight down.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85'
        },
        {
          text: 'Pull the dumbbells up to your ribcage, squeezing your shoulder blades.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85'
        },
        {
          text: 'Slowly lower back down — full range of motion for every rep.',
          image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&q=85'
        }
      ]
    },
    {
      name: 'Shoulder Taps',
      steps: [
        {
          text: 'Start in a high plank — wrists directly under shoulders.',
          image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85'
        },
        {
          text: 'Brace your core and keep hips level — no rocking.',
          image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85'
        },
        {
          text: 'Lift your right hand and tap your left shoulder.',
          image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85'
        },
        {
          text: 'Alternate sides continuously, moving with control.',
          image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85'
        }
      ]
    },
    {
      name: 'Tricep Dips',
      steps: [
        {
          text: 'Sit on the edge of a bench, hands gripping beside your hips.',
          image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85'
        },
        {
          text: 'Slide off the bench and straighten your legs in front.',
          image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=900&q=85'
        },
        {
          text: 'Bend your elbows and lower your body until arms reach 90°.',
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85'
        },
        {
          text: 'Push back up using your triceps to full arm extension.',
          image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=900&q=85'
        }
      ]
    }
  ],
  'Quick Stretching': [
    {
      name: 'Neck Stretch',
      steps: [
        {
          text: 'Sit or stand tall with your shoulders relaxed and back straight.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85'
        },
        {
          text: 'Gently tilt your head to the right, ear toward your shoulder.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85'
        },
        {
          text: 'Hold for 20 seconds — feel the stretch on the left side.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85'
        },
        {
          text: 'Return to center slowly, then repeat on the left side.',
          image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85'
        }
      ]
    },
    {
      name: 'Hamstring Stretch',
      steps: [
        {
          text: 'Sit on the floor with one leg fully extended forward.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85'
        },
        {
          text: 'Bend your other leg inward and plant the foot on your inner thigh.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85'
        },
        {
          text: 'Reach toward your toes, keeping your back as straight as possible.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85'
        },
        {
          text: 'Hold for 30 seconds, then switch to the other leg.',
          image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85'
        }
      ]
    },
    {
      name: 'Quad Stretch',
      steps: [
        {
          text: 'Stand tall near a wall or surface for balance if needed.',
          image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85'
        },
        {
          text: 'Bend your right knee, bringing your heel toward your glutes.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85'
        },
        {
          text: 'Grasp your ankle with your right hand and hold the stretch.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85'
        },
        {
          text: 'Hold for 30 seconds, then switch legs and repeat.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85'
        }
      ]
    },
    {
      name: 'Arm Stretch',
      steps: [
        {
          text: 'Stand upright and bring one arm straight across your chest.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85'
        },
        {
          text: 'Use your opposite forearm to press gently and deepen the stretch.',
          image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85'
        },
        {
          text: 'Hold for 20 seconds and feel the tension release in your shoulder.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85'
        },
        {
          text: 'Release slowly and stretch the other arm.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85'
        }
      ]
    }
  ],
  'Dumbbell Quick Circuit': [
    {
      name: 'Squats',
      steps: [
        {
          text: 'Hold dumbbells at your sides and stand with feet shoulder-width apart.',
          image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85'
        },
        {
          text: 'Push your hips back and bend your knees to lower down.',
          image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85'
        },
        {
          text: 'Descend until thighs are parallel to the floor — keep chest upright.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85'
        },
        {
          text: 'Drive through your heels to rise back to the starting position.',
          image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85'
        }
      ]
    },
    {
      name: 'Shoulder Press',
      steps: [
        {
          text: 'Stand tall and hold dumbbells at shoulder height, palms forward.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85'
        },
        {
          text: 'Brace your core — no arching the lower back.',
          image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85'
        },
        {
          text: 'Press the dumbbells directly overhead until arms are fully extended.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85'
        },
        {
          text: 'Slowly lower back to shoulder level for the next rep.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85'
        }
      ]
    },
    {
      name: 'Lunges',
      steps: [
        {
          text: 'Stand upright with dumbbells at your sides.',
          image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85'
        },
        {
          text: 'Step forward with your right foot into a long stride.',
          image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85'
        },
        {
          text: 'Lower your hips until both knees are at 90° — back knee near the floor.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85'
        },
        {
          text: 'Push off your front foot to return, then alternate legs.',
          image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85'
        }
      ]
    },
    {
      name: 'Plank',
      steps: [
        {
          text: 'Place forearms flat on the floor, elbows directly under shoulders.',
          image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85'
        },
        {
          text: 'Step your feet back and rest on your toes — body in a straight line.',
          image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85'
        },
        {
          text: 'Squeeze glutes and core — don\'t let your hips sag or rise.',
          image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85'
        },
        {
          text: 'Hold for 30–60 seconds. Breathe steadily throughout.',
          image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85'
        }
      ]
    }
  ]
};

// Generic fallback for other backend workouts
const getFallbackExercises = () => [
  {
    name: 'Warm-Up Movement',
    steps: [
      { text: 'Start with light movement to raise your heart rate.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85' },
      { text: 'Focus on your breathing — in through nose, out through mouth.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
      { text: 'Loosen up your joints with gentle circles.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' }
    ]
  },
  {
    name: 'Core Activation',
    steps: [
      { text: 'Get into a stable position on the floor.', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85' },
      { text: 'Engage your core and draw your navel inward.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85' },
      { text: 'Hold the contraction for 3 seconds, release, and repeat.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85' }
    ]
  },
  {
    name: 'Main Movement',
    steps: [
      { text: 'Execute the primary movement with strict form.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85' },
      { text: 'Breathe out on exertion, breathe in on the way back.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85' },
      { text: 'Complete the set at a controlled pace.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85' }
    ]
  },
  {
    name: 'Cool Down',
    steps: [
      { text: 'Slow your movements and regulate your breathing.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
      { text: 'Stretch out the muscles you activated during the workout.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85' },
      { text: 'Hydrate and rest. Great work!', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' }
    ]
  }
];

const getWorkoutExercises = (workoutName) => {
  return WORKOUT_DICTIONARY[workoutName] || getFallbackExercises();
};

const GuidedWorkout = ({ workout, onEnd }) => {
  const exercises = getWorkoutExercises(workout.name);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const currentExercise = exercises[exerciseIdx];
  const currentStep = currentExercise.steps[stepIdx];
  const totalSteps = currentExercise.steps.length;

  const overallProgress = (() => {
    let completedSteps = 0;
    const totalAllSteps = exercises.reduce((acc, ex) => acc + ex.steps.length, 0);
    for (let i = 0; i < exerciseIdx; i++) completedSteps += exercises[i].steps.length;
    completedSteps += stepIdx;
    return (completedSteps / totalAllSteps) * 100;
  })();

  const triggerTransition = (callback) => {
    setAnimating(true);
    setTimeout(() => {
      callback();
      setAnimating(false);
    }, 200);
  };

  const handleNext = () => {
    triggerTransition(() => {
      if (stepIdx < totalSteps - 1) {
        setStepIdx(prev => prev + 1);
      } else if (exerciseIdx < exercises.length - 1) {
        setExerciseIdx(prev => prev + 1);
        setStepIdx(0);
      } else {
        setIsCompleted(true);
      }
    });
  };

  const handlePrev = () => {
    triggerTransition(() => {
      if (stepIdx > 0) {
        setStepIdx(prev => prev - 1);
      } else if (exerciseIdx > 0) {
        const prevExercise = exercises[exerciseIdx - 1];
        setExerciseIdx(prev => prev - 1);
        setStepIdx(prevExercise.steps.length - 1);
      }
    });
  };

  const isFirst = exerciseIdx === 0 && stepIdx === 0;
  const isLastStep = exerciseIdx === exercises.length - 1 && stepIdx === totalSteps - 1;

  if (isCompleted) {
    return (
      <div className="guided-workout-overlay animate-fade-in">
        <div className="guided-workout-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="completion-trophy">
              <Trophy size={90} color="var(--accent)" style={{ filter: 'drop-shadow(0 0 24px rgba(220,163,88,0.7))' }} />
            </div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', margin: 0 }}>Workout Complete!</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '400px', margin: 0 }}>
              Amazing effort finishing <strong style={{ color: 'var(--accent)' }}>{workout.name}</strong>.<br />
              {exercises.reduce((acc, ex) => acc + ex.steps.length, 0)} steps done!
            </p>
            <button
              onClick={onEnd}
              style={{ marginTop: '1rem', maxWidth: '260px', width: '100%', fontSize: '1rem', position: 'relative', zIndex: 10 }}
            >
              Return to Workouts
            </button>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 40%, rgba(133,154,81,0.18) 0%, rgba(0,0,0,0) 65%)', pointerEvents: 'none' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="guided-workout-overlay animate-fade-in">
      {/* Header */}
      <div className="guided-workout-header">
        <button onClick={onEnd} className="back-btn">
          <X size={20} />
          <span>Exit</span>
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', margin: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
              {currentExercise.name}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ex {exerciseIdx + 1}/{exercises.length} · Step {stepIdx + 1}/{totalSteps}
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="guided-workout-container">
        <div className={`glass-card exercise-card visual-step-card ${animating ? 'step-exit' : 'step-enter'}`}>
          {/* Step Image */}
          <div className="exercise-image-wrapper">
            <img
              src={currentStep.image}
              alt={currentStep.text}
              className="exercise-image"
              key={`${exerciseIdx}-${stepIdx}`}
            />
            {/* Step badge */}
            <div className="step-badge">
              Step {stepIdx + 1}
            </div>
            {/* Exercise name chip */}
            <div className="exercise-chip">
              <Dumbbell size={13} />
              {currentExercise.name}
            </div>
          </div>

          {/* Instruction */}
          <div className="visual-step-instruction">
            <p className="visual-step-text">{currentStep.text}</p>
          </div>

          {/* Step dots */}
          <div className="step-dots">
            {currentExercise.steps.map((_, i) => (
              <div
                key={i}
                className={`step-dot ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="guided-workout-controls">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="nav-btn secondary"
            style={{ opacity: isFirst ? 0.4 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
          >
            <ArrowLeft size={18} /> Previous
          </button>
          <button onClick={handleNext} className="nav-btn">
            {isLastStep ? (
              <><CheckCircle size={18} /> Finish</>
            ) : stepIdx === totalSteps - 1 ? (
              <><ArrowRight size={18} /> Next Exercise</>
            ) : (
              <>Next Step <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedWorkout;
