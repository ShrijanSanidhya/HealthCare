import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X, CheckCircle, Trophy, Dumbbell, Pause, Play } from 'lucide-react';

const DEFAULT_DURATION = 8; // seconds for regular movement steps

// ── Workout Data ──────────────────────────────────────────────────────────────
// Each step: { text, image, duration? }
// duration overrides the default timer when a step requires a specific hold.
// Images are carefully chosen to match the movement type (no weights in stretches!)

const WORKOUT_DICTIONARY = {
  /* ════════ UPPER BODY BLAST ════════ */
  'Upper Body Blast': [
    {
      name: 'Push-ups',
      steps: [
        {
          text: 'Get into a high plank — hands shoulder-width apart, body perfectly straight.',
          image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Engage your core, tuck your elbows to 45° and brace for the descent.',
          image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Lower your chest slowly until it nearly grazes the floor.',
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Explode back up to full arm extension. Repeat for 10–15 reps.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85',
          duration: 8,
        },
      ],
    },
    {
      name: 'Dumbbell Rows',
      steps: [
        {
          text: 'Hinge at the hips, keeping your back flat and parallel to the floor.',
          image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Hold a dumbbell in each hand, arms hanging straight down.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Pull the dumbbells up to your ribcage — squeeze your shoulder blades hard.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Lower slowly back down. Full range of motion every rep.',
          image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=900&q=85',
          duration: 8,
        },
      ],
    },
    {
      name: 'Shoulder Taps',
      steps: [
        {
          text: 'High plank — wrists stacked directly below shoulders.',
          image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Brace your core and keep hips level — no rocking.',
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Lift your right hand and tap your left shoulder, then alternate sides.',
          image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Continue alternating for 30 seconds at a controlled pace.',
          image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=900&q=85',
          duration: 30,
        },
      ],
    },
    {
      name: 'Tricep Dips',
      steps: [
        {
          text: 'Sit on the edge of a sturdy bench, hands gripping beside your hips.',
          image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Slide forward off the bench, legs extended in front.',
          image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Bend your elbows back and lower until arms reach 90°.',
          image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Push through your palms back up to full extension. 10–12 reps.',
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85',
          duration: 8,
        },
      ],
    },
  ],

  /* ════════ QUICK STRETCHING ════════ */
  'Quick Stretching': [
    {
      name: 'Neck Stretch',
      steps: [
        {
          text: 'Sit or stand tall — drop your shoulders away from your ears.',
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Slowly tilt your head to the right, ear moving toward your shoulder.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Hold the stretch — breathe deeply and feel the release.',
          image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
          duration: 20,
        },
        {
          text: 'Return to center slowly, then repeat on the left side.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85',
          duration: 20,
        },
      ],
    },
    {
      name: 'Hamstring Stretch',
      steps: [
        {
          text: 'Sit on the mat with one leg extended straight in front of you.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Bend the other leg inward, sole of your foot on your inner thigh.',
          image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Reach toward your extended foot — keep your back flat, not rounded.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Hold the stretch. Breathe steadily.',
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85',
          duration: 30,
        },
      ],
    },
    {
      name: 'Quad Stretch',
      steps: [
        {
          text: 'Stand near a wall for balance. Stand tall, feet hip-width apart.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Bend your right knee and bring your heel up toward your glutes.',
          image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Grasp your ankle and gently pull. Feel the stretch along the front of your thigh.',
          image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Hold the position, keeping your knees together.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85',
          duration: 30,
        },
      ],
    },
    {
      name: 'Arm Cross Stretch',
      steps: [
        {
          text: 'Stand upright and bring your right arm straight across your chest.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Use your left forearm to press gently and deepen the shoulder stretch.',
          image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Hold — feel the tension release in your shoulder and upper back.',
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85',
          duration: 20,
        },
        {
          text: 'Release slowly and repeat on the left arm.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85',
          duration: 20,
        },
      ],
    },
  ],

  /* ════════ DUMBBELL QUICK CIRCUIT ════════ */
  'Dumbbell Quick Circuit': [
    {
      name: 'Squats',
      steps: [
        {
          text: 'Hold dumbbells at your sides. Stand with feet shoulder-width apart, toes out slightly.',
          image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Push your hips back and bend your knees to begin the descent.',
          image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Lower until thighs are parallel to the floor — chest stays tall.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Drive hard through your heels to stand. Squeeze glutes at the top.',
          image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=85',
          duration: 8,
        },
      ],
    },
    {
      name: 'Shoulder Press',
      steps: [
        {
          text: 'Stand tall — hold dumbbells at shoulder height, palms facing forward.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Brace your core firmly. Do not arch your lower back during the press.',
          image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Press the dumbbells directly overhead until arms fully lock out.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Lower slowly and controlled back to shoulder level. That\'s one rep.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85',
          duration: 8,
        },
      ],
    },
    {
      name: 'Lunges',
      steps: [
        {
          text: 'Stand upright with dumbbells at your sides — core braced.',
          image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Step forward with your right foot into a long, powerful stride.',
          image: 'https://images.unsplash.com/photo-'  + '1574680096145-d05b474e2155' + '?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Lower both knees to 90° — back knee hovers just above the floor.',
          image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Push off your front heel to return upright, then alternate legs.',
          image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&q=85',
          duration: 8,
        },
      ],
    },
    {
      name: 'Plank Hold',
      steps: [
        {
          text: 'Forearms flat on the floor, elbows stacked under your shoulders.',
          image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Step feet back and rise onto toes — body forms a rigid straight line.',
          image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Squeeze glutes and abs — hips must not sag or pike.',
          image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85',
          duration: 8,
        },
        {
          text: 'Hold steady and breathe slow. Stay strong!',
          image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85',
          duration: 30,
        },
      ],
    },
  ],

  /* ════════ FALLBACK ════════ */
  '__fallback__': [
    {
      name: 'Warm-Up',
      steps: [
        { text: 'Begin with light movements to elevate your heart rate gently.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85', duration: 8 },
        { text: 'Loosen your joints with gentle arm and leg circles.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85', duration: 8 },
        { text: 'Focus on steady breathing — in through nose, out through mouth.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85', duration: 8 },
      ],
    },
    {
      name: 'Core Activation',
      steps: [
        { text: 'Get into a stable position and draw your navel firmly inward.', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=900&q=85', duration: 8 },
        { text: 'Hold the contraction for 3 seconds, release, and repeat.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=85', duration: 8 },
        { text: 'Keep breathing — never hold your breath during a hold.', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85', duration: 8 },
      ],
    },
    {
      name: 'Cool Down Stretch',
      steps: [
        { text: 'Slow your pace and bring your heart rate back down.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85', duration: 8 },
        { text: 'Stretch the muscles you activated — hold each for 20 seconds.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85', duration: 20 },
        { text: 'Hydrate, breathe deep, and celebrate. You earned it!', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85', duration: 8 },
      ],
    },
  ],
};

const getWorkoutExercises = (name) =>
  WORKOUT_DICTIONARY[name] || WORKOUT_DICTIONARY['__fallback__'];

/* ── Countdown Ring ── */
const CountdownRing = ({ total, remaining }) => {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(remaining / total, 1);
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="35" cy="35" r={r} fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
        <circle
          cx="35" cy="35" r={r} fill="none"
          stroke="var(--primary)"
          strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.1s linear' }}
        />
      </svg>
      <div style={{ position: 'absolute', color: '#fff', fontSize: '1.2rem', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
        {Math.ceil(remaining)}
      </div>
    </div>
  );
};

/* ── Main Component ────────────────────────────────────────────────────────── */
const GuidedWorkout = ({ workout, onEnd }) => {
  const exercises = getWorkoutExercises(workout.name);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const currentExercise = exercises[exerciseIdx];
  const currentStep = currentExercise.steps[stepIdx];
  const stepDuration = currentStep.duration ?? DEFAULT_DURATION;
  const totalSteps = currentExercise.steps.length;
  const isFirst = exerciseIdx === 0 && stepIdx === 0;
  
  useEffect(() => {
    setTimeLeft(stepDuration);
  }, [exerciseIdx, stepIdx, stepDuration]);

  const advance = useCallback(() => {
    setStepIdx(prev => {
      const ex = exercises[exerciseIdx];
      if (prev < ex.steps.length - 1) return prev + 1;
      setExerciseIdx(ei => {
        if (ei < exercises.length - 1) return ei + 1;
        setIsCompleted(true);
        return ei;
      });
      return 0;
    });
  }, [exercises, exerciseIdx]);

  useEffect(() => {
    if (timeLeft === null || isCompleted || isPaused) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) { advance(); return stepDuration; }
        return parseFloat((t - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [isPaused, isCompleted, advance, stepDuration, timeLeft === null]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const goNext = () => {
    const isLastStep = exerciseIdx === exercises.length - 1 && stepIdx === totalSteps - 1;
    if (isLastStep) { setIsCompleted(true); return; }
    clearInterval(timerRef.current);
    advance();
  };

  const goPrev = () => {
    if (isFirst) return;
    clearInterval(timerRef.current);
    if (stepIdx > 0) {
      setStepIdx(p => p - 1);
    } else {
      const prevEx = exercises[exerciseIdx - 1];
      setExerciseIdx(e => e - 1);
      setStepIdx(prevEx.steps.length - 1);
    }
  };

  if (isCompleted) {
    const totalAllSteps = exercises.reduce((a, ex) => a + ex.steps.length, 0);
    return createPortal(
      <div className="completion-screen animate-fade-in">
        <Trophy size={100} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 40px rgba(225,29,72,0.5))' }} className="completion-trophy" />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Workout Complete!</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', margin: 0 }}>
            You crushed <span style={{ color: '#fff', fontWeight: 600 }}>{workout.name}</span>.<br/>
            {totalAllSteps} steps completed across {exercises.length} exercises.
          </p>
        </div>
        <button onClick={onEnd} style={{ marginTop: '2rem', width: 'auto', padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '30px' }}>
          Done
        </button>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="gw-fullscreen">
      <div className="gw-media-layer">
        <img key={currentStep.image} src={currentStep.image} className="gw-image" alt="" />
        <div className="gw-gradient-overlay" />
      </div>

      <div className="gw-progress-container">
        {currentExercise.steps.map((_, i) => {
          let width = '0%';
          if (i < stepIdx) width = '100%';
          else if (i === stepIdx && timeLeft !== null) width = `${100 - (timeLeft / stepDuration) * 100}%`;
          
          return (
            <div key={i} className="gw-progress-segment">
              <div className="gw-progress-fill" style={{ width }} />
            </div>
          );
        })}
      </div>

      <div className="gw-header">
        <div className="gw-exercise-info">
          <span className="gw-exercise-subtitle">Exercise {exerciseIdx + 1} of {exercises.length}</span>
          <h2 className="gw-exercise-title">{currentExercise.name}</h2>
        </div>
        <button onClick={onEnd} className="gw-close-btn">
          <X size={24} />
        </button>
      </div>

      <div className="gw-content-layer">
        <div key={`${exerciseIdx}-${stepIdx}`} className="gw-animate-instruction">
          <h3 className="gw-instruction">{currentStep.text}</h3>
        </div>

        <div className="gw-bottom-bar">
          <div className="gw-controls">
            <button className="gw-skip-btn" onClick={goPrev} disabled={isFirst}>
              <ArrowLeft size={22} />
            </button>
            <button className="gw-master-play" onClick={() => setIsPaused(p => !p)}>
              {isPaused ? <Play size={30} fill="currentColor" style={{ marginLeft: '3px' }} /> : <Pause size={30} fill="currentColor" />}
            </button>
            <button className="gw-skip-btn" onClick={goNext}>
              <ArrowRight size={22} />
            </button>
          </div>
          {timeLeft !== null && <CountdownRing total={stepDuration} remaining={timeLeft} />}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GuidedWorkout;
