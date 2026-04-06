import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight, X, CheckCircle, Trophy, Dumbbell, Pause, Play } from 'lucide-react';

const STEP_DURATION = 8; // seconds per step

const WORKOUT_DICTIONARY = {
  'Upper Body Blast': [
    {
      name: 'Push-ups',
      steps: [
        { text: 'Get into a high plank — hands shoulder-width apart, body perfectly straight.', image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=900&q=85' },
        { text: 'Engage your core, tuck your elbows at 45° and brace for the descent.', image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=900&q=85' },
        { text: 'Lower your chest slowly until it nearly grazes the floor.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85' },
        { text: 'Explode back up to full arm extension. That\'s one rep!', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' },
      ]
    },
    {
      name: 'Dumbbell Rows',
      steps: [
        { text: 'Hinge at the hips, keeping your back flat and parallel to the floor.', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85' },
        { text: 'Hold a dumbbell in each hand, arms fully extended downward.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85' },
        { text: 'Drive elbows back — pull dumbbells to your ribcage, squeeze shoulder blades.', image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85' },
        { text: 'Slowly lower back down for a full stretch. Control every inch.', image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=900&q=85' },
      ]
    },
    {
      name: 'Shoulder Taps',
      steps: [
        { text: 'High plank position — wrists stacked directly below shoulders.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85' },
        { text: 'Brace your core and stabilise your hips — no rocking or swinging.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85' },
        { text: 'Lift your right hand and tap your left shoulder.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
        { text: 'Place it back, then alternate sides in a slow controlled rhythm.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85' },
      ]
    },
    {
      name: 'Tricep Dips',
      steps: [
        { text: 'Sit on the edge of a sturdy bench, hands gripping just beside your hips.', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85' },
        { text: 'Slide forward off the bench and extend your legs out in front.', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&q=85' },
        { text: 'Bend your elbows and lower your body until arms reach 90°.', image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=900&q=85' },
        { text: 'Push through your palms to extend back up. Feel the triceps fire!', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85' },
      ]
    }
  ],

  'Quick Stretching': [
    {
      name: 'Neck Stretch',
      steps: [
        { text: 'Sit or stand tall — relax your shoulders completely before you begin.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85' },
        { text: 'Slowly tilt your head to the right, ear moving toward your shoulder.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' },
        { text: 'Hold the stretch for 20 seconds — breathe deeply throughout.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85' },
        { text: 'Return to center slowly, then repeat on the left side.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
      ]
    },
    {
      name: 'Hamstring Stretch',
      steps: [
        { text: 'Sit on the mat with one leg extended straight in front of you.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85' },
        { text: 'Bend the other leg inward and rest the sole of your foot on your inner thigh.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85' },
        { text: 'Reach both hands toward your extended foot — keep your back flat.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' },
        { text: 'Hold for 30 seconds, breathing steadily, then switch legs.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
      ]
    },
    {
      name: 'Quad Stretch',
      steps: [
        { text: 'Stand near a wall for balance if needed. Feet together, standing tall.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
        { text: 'Bend your right knee and bring your heel up toward your glutes.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85' },
        { text: 'Grasp your right ankle gently — feel the pull along the front of the thigh.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85' },
        { text: 'Hold 30 seconds, keeping your knees together and torso upright. Switch legs.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' },
      ]
    },
    {
      name: 'Arm Stretch',
      steps: [
        { text: 'Stand tall and bring your right arm straight across your chest.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' },
        { text: 'Use your left forearm to press gently on the right arm and deepen the stretch.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85' },
        { text: 'Hold for 20 seconds — feel the release in your shoulder and upper back.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85' },
        { text: 'Release slowly and repeat on the left arm.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
      ]
    }
  ],

  'Dumbbell Quick Circuit': [
    {
      name: 'Squats',
      steps: [
        { text: 'Hold dumbbells at your sides. Stand with feet shoulder-width apart, toes out slightly.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85' },
        { text: 'Push your hips back and bend your knees to begin the descent.', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85' },
        { text: 'Lower until thighs are parallel to the floor — chest stays tall.', image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85' },
        { text: 'Drive hard through your heels to stand back up. Squeeze glutes at the top.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85' },
      ]
    },
    {
      name: 'Shoulder Press',
      steps: [
        { text: 'Stand tall — hold dumbbells at shoulder height, palms facing forward.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85' },
        { text: 'Brace your core hard. Do not let your lower back arch during the press.', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85' },
        { text: 'Press the dumbbells directly overhead until arms are fully locked out.', image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85' },
        { text: 'Lower slowly and controlled back to shoulder level. That\'s one rep.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85' },
      ]
    },
    {
      name: 'Lunges',
      steps: [
        { text: 'Stand upright, dumbbells hanging at your sides. Core braced.', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85' },
        { text: 'Step forward with your right foot into a long, powerful stride.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85' },
        { text: 'Lower both knees to 90° — back knee hovers just above the floor.', image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85' },
        { text: 'Push off your front heel to return, then alternate legs.', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85' },
      ]
    },
    {
      name: 'Plank',
      steps: [
        { text: 'Forearms flat on the floor, elbows stacked directly under your shoulders.', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85' },
        { text: 'Step feet back and rise onto your toes — body forms a rigid straight line.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85' },
        { text: 'Squeeze your glutes and abs — hips must not sag or pike up.', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85' },
        { text: 'Hold steady for 30–60 seconds. Breathe slow, stay strong.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85' },
      ]
    }
  ],

  // Generic fallback for other backend workouts
  '__fallback__': [
    {
      name: 'Warm-Up',
      steps: [
        { text: 'Begin with light movements to elevate your heart rate gently.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85' },
        { text: 'Loosen your joints with gentle arm and leg circles.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
        { text: 'Focus on steady breathing — in through your nose, out through mouth.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' },
      ]
    },
    {
      name: 'Core Activation',
      steps: [
        { text: 'Get into a stable position and draw your navel firmly inward.', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85' },
        { text: 'Hold the contraction for 3 seconds, release, and repeat.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85' },
        { text: 'Keep breathing — don\'t hold your breath during the hold.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85' },
      ]
    },
    {
      name: 'Main Movement',
      steps: [
        { text: 'Execute the primary movement with strict, controlled form.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85' },
        { text: 'Exhale on exertion, inhale on the return phase.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85' },
        { text: 'Complete the set at a steady tempo — quality beats speed.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85' },
      ]
    },
    {
      name: 'Cool Down',
      steps: [
        { text: 'Slow your pace and bring your heart rate back down gradually.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85' },
        { text: 'Stretch the muscles you activated — hold each stretch for 20 seconds.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85' },
        { text: 'Hydrate, breathe, and celebrate. You earned it!', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85' },
      ]
    }
  ]
};

const getWorkoutExercises = (workoutName) =>
  WORKOUT_DICTIONARY[workoutName] || WORKOUT_DICTIONARY['__fallback__'];

/* ── Countdown ring ── */
const CountdownRing = ({ total, remaining, isPaused }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const progress = remaining / total;
  const dash = circ * progress;

  return (
    <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
      <circle
        cx="30" cy="30" r={r} fill="none"
        stroke={isPaused ? '#f97316' : 'var(--primary)'}
        strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s linear, stroke 0.3s' }}
      />
      <text
        x="30" y="35"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="700"
        style={{ transform: 'rotate(90deg)', transformOrigin: '30px 30px' }}
      >
        {Math.ceil(remaining)}
      </text>
    </svg>
  );
};

/* ── Main Component ── */
const GuidedWorkout = ({ workout, onEnd }) => {
  const exercises = getWorkoutExercises(workout.name);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(STEP_DURATION);
  const timerRef = useRef(null);

  const currentExercise = exercises[exerciseIdx];
  const currentStep = currentExercise.steps[stepIdx];
  const totalSteps = currentExercise.steps.length;
  const isFirst = exerciseIdx === 0 && stepIdx === 0;
  const isLastStep = exerciseIdx === exercises.length - 1 && stepIdx === totalSteps - 1;

  const overallProgress = (() => {
    const totalAll = exercises.reduce((a, ex) => a + ex.steps.length, 0);
    let done = 0;
    for (let i = 0; i < exerciseIdx; i++) done += exercises[i].steps.length;
    done += stepIdx;
    return (done / totalAll) * 100;
  })();

  /* ── Advance logic ── */
  const advance = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setStepIdx(prev => {
        if (prev < currentExercise.steps.length - 1) {
          setTimeLeft(STEP_DURATION);
          return prev + 1;
        } else {
          setExerciseIdx(ei => {
            if (ei < exercises.length - 1) {
              setTimeLeft(STEP_DURATION);
              return ei + 1;
            } else {
              setIsCompleted(true);
              return ei;
            }
          });
          return 0;
        }
      });
      setAnimating(false);
    }, 200);
  }, [currentExercise, exercises]);

  /* ── Timer ── */
  useEffect(() => {
    if (isCompleted || isPaused) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) { advance(); return STEP_DURATION; }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [isPaused, isCompleted, advance, exerciseIdx, stepIdx]);

  /* Reset timer on step change */
  useEffect(() => { setTimeLeft(STEP_DURATION); }, [exerciseIdx, stepIdx]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  /* ── Manual nav ── */
  const goNext = () => { if (!isLastStep) { clearInterval(timerRef.current); advance(); } };
  const goPrev = () => {
    if (isFirst) return;
    setAnimating(true);
    setTimeout(() => {
      if (stepIdx > 0) {
        setStepIdx(p => p - 1);
      } else {
        const prev = exercises[exerciseIdx - 1];
        setExerciseIdx(e => e - 1);
        setStepIdx(prev.steps.length - 1);
      }
      setTimeLeft(STEP_DURATION);
      setAnimating(false);
    }, 200);
  };

  /* ── Completion screen ── */
  if (isCompleted) {
    const totalAllSteps = exercises.reduce((a, ex) => a + ex.steps.length, 0);
    return (
      <div className="guided-workout-overlay animate-fade-in">
        <div className="guided-workout-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="completion-trophy">
              <Trophy size={90} color="var(--accent)" style={{ filter: 'drop-shadow(0 0 24px rgba(220,163,88,0.7))' }} />
            </div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', margin: 0 }}>Workout Complete!</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '400px', margin: 0 }}>
              Amazing! You just crushed <strong style={{ color: 'var(--accent)' }}>{workout.name}</strong>
              <br />{totalAllSteps} steps, {exercises.length} exercises. 🔥
            </p>
            <button onClick={onEnd} style={{ marginTop: '1rem', maxWidth: '260px', width: '100%', position: 'relative', zIndex: 10 }}>
              Return to Workouts
            </button>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(133,154,81,0.18) 0%, rgba(0,0,0,0) 65%)', pointerEvents: 'none' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="guided-workout-overlay animate-fade-in">
      {/* Header */}
      <div className="guided-workout-header">
        <button onClick={onEnd} className="back-btn">
          <X size={20} /><span>Exit</span>
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', margin: '0 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
              {currentExercise.name}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ex {exerciseIdx + 1}/{exercises.length} · Step {stepIdx + 1}/{totalSteps}
            </span>
          </div>
          <div className="progress-bar-container" style={{ margin: 0 }}>
            <div className="progress-bar" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        {/* Countdown ring + pause */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsPaused(p => !p)}>
            <CountdownRing total={STEP_DURATION} remaining={timeLeft} isPaused={isPaused} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPaused
                ? <Play size={12} color="white" />
                : <Pause size={12} color="white" style={{ opacity: 0.4 }} />}
            </div>
          </div>
        </div>
      </div>

      {/* Step Card */}
      <div className="guided-workout-container">
        <div className={`glass-card exercise-card visual-step-card ${animating ? 'step-exit' : 'step-enter'}`}>
          {/* Image */}
          <div className="exercise-image-wrapper">
            <img
              key={`${exerciseIdx}-${stepIdx}`}
              src={currentStep.image}
              alt={currentStep.text}
              className="exercise-image"
            />
            <div className="step-badge">Step {stepIdx + 1}</div>
            <div className="exercise-chip"><Dumbbell size={13} />{currentExercise.name}</div>
          </div>

          {/* Instruction */}
          <div className="visual-step-instruction">
            <p className="visual-step-text">{currentStep.text}</p>
          </div>

          {/* Step dots */}
          <div className="step-dots">
            {currentExercise.steps.map((_, i) => (
              <div key={i} className={`step-dot ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`} />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="guided-workout-controls">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="nav-btn secondary"
            style={{ opacity: isFirst ? 0.4 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
          >
            <ArrowLeft size={18} /> Previous
          </button>

          <button
            onClick={() => setIsPaused(p => !p)}
            className="nav-btn secondary"
            style={{ flexGrow: 0, padding: '0 1.5rem' }}
          >
            {isPaused ? <><Play size={18} /> Resume</> : <><Pause size={18} /> Pause</>}
          </button>

          {isLastStep ? (
            <button onClick={() => setIsCompleted(true)} className="nav-btn">
              <CheckCircle size={18} /> Finish
            </button>
          ) : (
            <button onClick={goNext} className="nav-btn">
              Next <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidedWorkout;
