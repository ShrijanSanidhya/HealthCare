import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, Bookmark, Heart, Flame, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const mockVideos = [
    {
        id: 1,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.40.51 (1).mp4',
        title: 'Morning Yoga Flow',
        duration: '15 min',
        calories: 120,
        tags: ['Flexibility', 'Recovery'],
    },
    {
        id: 2,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.40.51 (2).mp4',
        title: 'Core Crusher',
        duration: '10 min',
        calories: 150,
        tags: ['Strength', 'Core'],
    },
    {
        id: 3,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.40.51.mp4',
        title: 'Full Body HIIT',
        duration: '20 min',
        calories: 300,
        tags: ['HIIT', 'Cardio', 'weight loss'],
    },
    {
        id: 4,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.41.22.mp4',
        title: 'Upper Body Burn',
        duration: '15 min',
        calories: 180,
        tags: ['Strength', 'Upper Body', 'muscle gain'],
    },
    {
        id: 5,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.42.55.mp4',
        title: 'Cardio Blast',
        duration: '25 min',
        calories: 350,
        tags: ['Cardio', 'Endurance', 'weight loss'],
    },
    {
        id: 6,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.43.14.mp4',
        title: 'Lower Body Strength',
        duration: '20 min',
        calories: 220,
        tags: ['Strength', 'Legs', 'muscle gain'],
    },
    {
        id: 7,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.43.17.mp4',
        title: 'Mobility Routine',
        duration: '10 min',
        calories: 80,
        tags: ['Flexibility', 'Recovery'],
    },
    {
        id: 8,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.43.20.mp4',
        title: 'Power Yoga',
        duration: '30 min',
        calories: 250,
        tags: ['Flexibility', 'Strength'],
    },
    {
        id: 9,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.43.23.mp4',
        title: 'Quick Abs',
        duration: '5 min',
        calories: 60,
        tags: ['Core'],
    },
    {
        id: 10,
        url: '/videos/WhatsApp Video 2026-04-06 at 10.44.04.mp4',
        title: 'Endurance Jump Rope',
        duration: '15 min',
        calories: 240,
        tags: ['Cardio', 'weight loss'],
    }
];

const ReelVideo = ({ video, isActive, isRecommended }) => {
    const videoRef = useRef(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isActive) {
            videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
        } else {
            videoRef.current?.pause();
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
            }
        }
    }, [isActive]);

    const handleSave = () => {
        setSaved(!saved);
        toast.success(saved ? 'Removed from saved workouts' : 'Workout saved successfully!');
    };

    const handleAddToPlan = () => {
        toast.success(`"${video.title}" added to today's plan!`);
    };

    return (
        <div className="reel-video-wrapper">
            <video
                ref={videoRef}
                src={video.url}
                className="reel-video"
                loop
                muted
                playsInline
                onClick={() => {
                    if (videoRef.current.paused) videoRef.current.play();
                    else videoRef.current.pause();
                }}
            />
            
            <div className="reel-overlay">
                <div className="reel-overlay-content">
                    <div className="reel-details">
                        {isRecommended && (
                            <div className="reel-badge" style={{ backgroundColor: 'var(--primary-glow)', borderColor: 'var(--primary)' }}>
                                Recommended for your goal
                            </div>
                        )}
                        <h2>{video.title}</h2>
                        
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <div className="reel-badge">
                                <Clock size={14} /> {video.duration}
                            </div>
                            <div className="reel-badge">
                                <Flame size={14} color="#f97316" /> {video.calories} kcal
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '5px' }}>
                            {video.tags.map((tag, idx) => (
                                <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{tag.replace(/\s+/g, '')} </span>
                            ))}
                        </div>
                    </div>

                    <div className="reel-actions">
                        <div className="reel-action-btn-container">
                            <button className="reel-action-btn" onClick={handleSave} style={{ border: saved ? '1px solid var(--accent)' : '' }}>
                                <Bookmark size={22} fill={saved ? "var(--accent)" : "none"} color={saved ? "var(--accent)" : "white"} />
                            </button>
                            <span className="reel-action-btn-text">Save</span>
                        </div>
                        
                        <div className="reel-action-btn-container">
                            <button className="reel-action-btn" onClick={handleAddToPlan}>
                                <Plus size={24} />
                            </button>
                            <span className="reel-action-btn-text">Add to Plan</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Fitclips = () => {
    const { user } = useContext(AuthContext);
    const [activeVideoId, setActiveVideoId] = useState(mockVideos[0]?.id);
    const containerRef = useRef(null);
    const [reels, setReels] = useState([]);

    useEffect(() => {
        // Filter logic based on user goal if available
        const userGoal = user?.goal?.toLowerCase();
        
        let filtered = [];
        if (userGoal) {
            filtered = mockVideos.filter(v => v.tags.some(t => t.toLowerCase() === userGoal));
        }

        // If no matches, fallback to all videos
        if (filtered.length === 0) {
            filtered = [...mockVideos];
        } else {
            // Add remaining videos after the recommended ones
            const remaining = mockVideos.filter(v => !filtered.find(f => f.id === v.id));
            filtered = [...filtered, ...remaining];
        }

        setReels(filtered);
        if (filtered.length > 0) setActiveVideoId(filtered[0].id);
    }, [user]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = Number(entry.target.getAttribute('data-id'));
                        setActiveVideoId(id);
                    }
                });
            },
            {
                root: container,
                threshold: 0.6 // at least 60% of the video must be visible
            }
        );

        const videoElements = document.querySelectorAll('.reel-video-wrapper');
        videoElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [reels]);

    return (
        <div className="animate-fade-in" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
                <h1 className="text-gradient" style={{ margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.9)', fontSize: '2rem', fontWeight: 800 }}>Fitclips</h1>
            </div>
            <div className="reels-container" ref={containerRef}>
                {reels.map((video) => (
                    <div key={video.id} data-id={video.id} className="reel-video-wrapper">
                        <ReelVideo 
                            video={video} 
                            isActive={activeVideoId === video.id} 
                            isRecommended={user?.goal ? video.tags.some(t => t.toLowerCase() === user.goal.toLowerCase()) : false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Fitclips;
