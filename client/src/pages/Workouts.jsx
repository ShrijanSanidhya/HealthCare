import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Play, Clock, Dumbbell, Activity, Flame, SearchX,
  Zap, Target, Heart, RotateCcw, ChevronRight, BarChart2,
  Filter, TrendingUp, Award, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import GuidedWorkout from '../components/GuidedWorkout';

/* ── Constants ─────────────────────────────────────────────────────────────── */
const intensityColors = {
  Low:    { main: '#22c55e', glow: 'rgba(34,197,94,0.3)',  bg: 'rgba(34,197,94,0.1)',  label: 'Beginner' },
  Medium: { main: '#f97316', glow: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.1)', label: 'Intermediate' },
  High:   { main: '#ef4444', glow: 'rgba(239,68,68,0.3)',  bg: 'rgba(239,68,68,0.1)',  label: 'Advanced' },
};

const kcalMap = { High: '300–450', Medium: '180–280', Low: '90–150' };

const workoutMeta = {
  'Upper Body Blast':       { muscles: ['Chest', 'Shoulders', 'Triceps'], icon: Dumbbell,   category: 'Strength', exercises: 4, color: '#6366f1' },
  'Full Body HIIT':         { muscles: ['Full Body', 'Core', 'Legs'],     icon: Zap,         category: 'HIIT',     exercises: 5, color: '#ef4444' },
  'Core Crusher':           { muscles: ['Abs', 'Core', 'Lower Back'],     icon: Target,      category: 'Strength', exercises: 5, color: '#f97316' },
  'Quick Stretching':       { muscles: ['Flexibility', 'Mobility'],       icon: Activity,    category: 'Stretch',  exercises: 4, color: '#22c55e' },
  'Dumbbell Quick Circuit': { muscles: ['Legs', 'Shoulders', 'Back'],     icon: BarChart2,   category: 'Strength', exercises: 4, color: '#a855f7' },
  'Morning Cardio Blast':   { muscles: ['Cardio', 'Legs', 'Core'],        icon: Heart,       category: 'Cardio',   exercises: 4, color: '#ec4899' },
  'Lower Body Power':       { muscles: ['Quads', 'Glutes', 'Hamstrings'], icon: TrendingUp,  category: 'Strength', exercises: 5, color: '#14b8a6' },
  'default':                { muscles: ['Full Body'],                     icon: Activity,    category: 'General',  exercises: 3, color: '#e11d48' },
};

const getMeta = (name) => workoutMeta[name] || {
  ...workoutMeta.default,
  color: '#' + Math.floor(Math.abs(name.charCodeAt(0) * 654321) % 0xffffff).toString(16).padStart(6, '0'),
};

const FILTER_TABS = ['All', 'Strength', 'Cardio', 'HIIT', 'Stretch'];

/* ── Sub-components ─────────────────────────────────────────────────────────── */

const DifficultyDots = ({ intensity }) => {
  const levels = { Low: 1, Medium: 2, High: 3 };
  const filled = levels[intensity] || 1;
  const color   = intensityColors[intensity]?.main || '#e11d48';
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      {[1,2,3].map(n => (
        <div key={n} style={{
          width: n <= filled ? '10px' : '8px',
          height: n <= filled ? '10px' : '8px',
          borderRadius: '50%',
          background: n <= filled ? color : 'rgba(255,255,255,0.15)',
          boxShadow: n <= filled ? `0 0 6px ${color}` : 'none',
          transition: 'all 0.2s',
        }} />
      ))}
    </div>
  );
};

const WorkoutCardSkeleton = () => (
  <div className="workout-card workout-card-skeleton">
    <div className="skeleton-bar" style={{ height: '16px', width: '60%', borderRadius: '8px', marginBottom: '12px' }} />
    <div className="skeleton-bar" style={{ height: '32px', width: '80%', borderRadius: '8px', marginBottom: '24px' }} />
    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
      {[1,2].map(i => <div key={i} className="skeleton-bar" style={{ height: '26px', width: '70px', borderRadius: '20px' }} />)}
    </div>
    <div className="skeleton-bar" style={{ height: '48px', borderRadius: '10px', marginTop: 'auto' }} />
  </div>
);

const StatBadge = ({ icon: Icon, label, value, color }) => (
  <div className="workout-stat-badge" style={{ '--badge-color': color }}>
    <div className="workout-stat-icon">
      <Icon size={18} />
    </div>
    <div>
      <div className="workout-stat-value">{value}</div>
      <div className="workout-stat-label">{label}</div>
    </div>
  </div>
);

/* ── Main Page ──────────────────────────────────────────────────────────────── */
const Workouts = () => {
  const { api, user } = useContext(AuthContext);
  const [workouts, setWorkouts]     = useState([]);
  const [timeLimit, setTimeLimit]   = useState(30);
  const [loading, setLoading]       = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeFilter, setActiveFilter]   = useState('All');
  const [hoveredCard, setHoveredCard]     = useState(null);

  const fetchWorkouts = async (time) => {
    setLoading(true);
    try {
      const res = await api.get(`/workouts?time=${time || timeLimit}`);
      setWorkouts(res.data || []);
    } catch (err) {
      toast.error('Could not fetch workout suggestions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(30); }, []);

  const handleTimeChange = (e) => {
    const val = Number(e.target.value);
    setTimeLimit(val);
    fetchWorkouts(val);
  };

  const filtered = activeFilter === 'All'
    ? workouts
    : workouts.filter(w => getMeta(w.name).category === activeFilter);

  if (activeWorkout) {
    return <GuidedWorkout workout={activeWorkout} onEnd={() => setActiveWorkout(null)} />;
  }

  const totalKcal = workouts.reduce((acc, w) => {
    const r = kcalMap[w.intensity] || '0';
    return acc + parseInt(r.split('–')[0], 10);
  }, 0);

  return (
    <div className="animate-fade-in workout-page">

      {/* ── Header ── */}
      <div className="workout-header">
        <div className="workout-title-block">
          <div className="workout-title-icon">
            <Dumbbell size={28} />
          </div>
          <div>
            <h1 className="workout-page-title">AI Workouts</h1>
            <p className="workout-page-subtitle">
              Tailored for your <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{user?.activityLevel || 'lifestyle'}</strong> level
              &nbsp;·&nbsp; goal: <strong style={{ color: '#f97316', textTransform: 'lowercase' }}>{user?.goal || 'get fit'}</strong>
            </p>
          </div>
        </div>

        {/* Time Picker */}
        <div className="workout-time-picker">
          <Clock size={16} color="var(--primary)" />
          <select value={timeLimit} onChange={handleTimeChange} className="workout-time-select">
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60+ min</option>
          </select>
        </div>
      </div>

      {/* ── Stats Banner ── */}
      {!loading && workouts.length > 0 && (
        <div className="workout-stats-row">
          <StatBadge icon={Dumbbell}   label="Routines"       value={workouts.length}                      color="#6366f1" />
          <StatBadge icon={Clock}      label="Total Time"     value={`~${timeLimit} min`}                  color="#f97316" />
          <StatBadge icon={Flame}      label="Est. Burn"      value={`${totalKcal}+ kcal`}                 color="#ef4444" />
          <StatBadge icon={Award}      label="Your Level"     value={user?.activityLevel || 'Active'}      color="#22c55e" />
          <StatBadge icon={Star}       label="Goal"           value={user?.goal || 'Get Fit'}              color="#a855f7" />
        </div>
      )}

      {/* ── Filter Tabs ── */}
      {!loading && workouts.length > 0 && (
        <div className="workout-filter-bar">
          <Filter size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`workout-filter-tab ${activeFilter === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {filtered.length} workout{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* ── Loading Skeletons ── */}
      {loading && (
        <div>
          <div className="workout-loading-header">
            <div className="loader-spinner" style={{ width: '36px', height: '36px' }} />
            <p>Analyzing your profile &amp; building workouts…</p>
          </div>
          <div className="workout-grid">
            {[1,2,3].map(i => <WorkoutCardSkeleton key={i} />)}
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && workouts.length === 0 && (
        <div className="workout-empty">
          <div className="workout-empty-icon">
            <SearchX size={48} />
          </div>
          <h3>No routines fit the {timeLimit} min window</h3>
          <p>Try adjusting your available time — a slightly longer session usually unlocks more options.</p>
          <button onClick={() => { setTimeLimit(45); fetchWorkouts(45); }} style={{ width: 'auto', padding: '0.8rem 2rem' }}>
            Try 45 minutes <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
          </button>
        </div>
      )}

      {/* ── No Filter Results ── */}
      {!loading && workouts.length > 0 && filtered.length === 0 && (
        <div className="workout-empty" style={{ marginTop: '2rem' }}>
          <div className="workout-empty-icon">
            <RotateCcw size={40} />
          </div>
          <h3>No {activeFilter} workouts in this set</h3>
          <p>Try a different time window or reset the filter.</p>
          <button onClick={() => setActiveFilter('All')} style={{ width: 'auto', padding: '0.7rem 1.8rem' }}>
            Show All
          </button>
        </div>
      )}

      {/* ── Workout Cards ── */}
      {!loading && filtered.length > 0 && (
        <div className="workout-grid">
          {filtered.map((w, i) => {
            const meta   = getMeta(w.name);
            const iCol   = intensityColors[w.intensity] || intensityColors.Medium;
            const Icon   = meta.icon;
            const isHov  = hoveredCard === i;

            return (
              <div
                key={i}
                className="workout-card"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Top accent bar */}
                <div className="workout-card-accent" style={{ background: `linear-gradient(90deg, ${iCol.main}, ${meta.color})` }} />

                {/* Glow blobs */}
                <div className="workout-card-glow" style={{ background: iCol.main, transform: isHov ? 'scale(1.3)' : 'scale(1)' }} />
                <div className="workout-card-glow2" style={{ background: meta.color }} />

                {/* Header row */}
                <div className="workout-card-toprow">
                  <span className="workout-intensity-badge" style={{ background: iCol.bg, color: iCol.main, border: `1px solid ${iCol.main}40` }}>
                    <DifficultyDots intensity={w.intensity} />
                    {iCol.label}
                  </span>
                  <span className="workout-duration-badge">
                    <Clock size={13} />
                    {w.duration}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="workout-card-body">
                  <div className="workout-card-icon-wrap" style={{ background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}08)`, border: `1px solid ${meta.color}30` }}>
                    <Icon size={26} color={meta.color} />
                  </div>
                  <h3 className="workout-card-title">{w.name}</h3>
                  <p className="workout-card-type">{w.type} &nbsp;·&nbsp; {meta.category}</p>
                </div>

                {/* Muscle Tags */}
                <div className="workout-muscle-tags">
                  {meta.muscles.slice(0, 3).map(m => (
                    <span key={m} className="workout-muscle-tag">{m}</span>
                  ))}
                </div>

                {/* Info row */}
                <div className="workout-card-info">
                  <div className="workout-info-chip" style={{ color: '#f97316' }}>
                    <Flame size={13} />
                    {kcalMap[w.intensity]} kcal
                  </div>
                  <div className="workout-info-chip" style={{ color: 'var(--text-muted)' }}>
                    <Dumbbell size={13} />
                    {meta.exercises} exercises
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setActiveWorkout(w)}
                  className="workout-start-btn"
                  style={{ background: `linear-gradient(135deg, ${iCol.main}, ${meta.color})` }}
                >
                  <Play size={16} fill="currentColor" />
                  Start Session
                  <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Workouts;
