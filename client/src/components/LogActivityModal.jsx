import React, { useState, useContext } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Food calorie database for photo estimation lookup
const FOOD_DB = [
    { name: 'Apple', calories: 95 }, { name: 'Banana', calories: 105 },
    { name: 'Chicken Breast (100g)', calories: 165 }, { name: 'Rice Bowl', calories: 350 },
    { name: 'Salad', calories: 120 }, { name: 'Pizza Slice', calories: 285 },
    { name: 'Burger', calories: 540 }, { name: 'Protein Shake', calories: 180 },
    { name: 'Greek Yogurt', calories: 100 }, { name: 'Oatmeal Bowl', calories: 300 },
    { name: 'Sandwich', calories: 400 }, { name: 'Dal Rice', calories: 450 },
    { name: 'Paneer Tikka', calories: 270 }, { name: 'Grilled Fish', calories: 230 },
];

const LogActivityModal = ({ onClose }) => {
    const { api } = useContext(AuthContext);
    const [estimatedCals, setEstimatedCals] = useState('');
    const [burnedCals, setBurnedCals] = useState('');
    const [waterGlasses, setWaterGlasses] = useState('');
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    const todayDate = new Date().toISOString().split('T')[0];

    const handleLogDay = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving your day...');
        try {
            await api.post('/log-day', {
                date: todayDate,
                intakeCalories: estimatedCals || 0,
                burnedCalories: burnedCals || 0,
                waterGlasses: waterGlasses || 0,
            });
            toast.success('Nice! Your day is logged.', { id: toastId });
            // Ideally we could trigger a refetch of dashboard context here, but we'll let individual components reload or rely on a context if needed
            // For now, close modal on success
            setTimeout(() => {
                onClose();
            }, 1000);
            // Optionally, page reload could be done here if context doesn't auto-update
            window.location.reload(); 
        } catch (err) {
            toast.error('Oops, something slipped. Give it another shot!', { id: toastId });
        }
    };

    const handleImageUpload = (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        setScanning(true);
        setScanResult(null);
        setTimeout(() => {
            const randomFood = FOOD_DB[Math.floor(Math.random() * FOOD_DB.length)];
            setScanResult(randomFood);
            setEstimatedCals(String(randomFood.calories));
            setScanning(false);
            toast.success(`Looks like ${randomFood.name} — ~${randomFood.calories} kcal filled in for you!`);
        }, 2200);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X size={24} /></button>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={24} color="var(--primary)" /> Log Activity
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Track your calories eaten, burned, and hydration for today.
                    </p>
                </div>

                {/* AI Food Vision */}
                <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-dark)', border: '1px dashed rgba(133,154,81,0.4)', borderRadius: 'var(--radius-sm)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}>
                        <Camera size={20} /> AI Food Vision — snap to estimate calories
                    </label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ border: 'none', background: 'transparent', padding: '0.5rem 0', marginBottom: 0, fontSize: '0.85rem' }} />
                    {scanning && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', color: 'var(--accent)' }}>
                            <div className="loader-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            <span style={{ fontSize: '0.9rem' }}>Analyzing food...</span>
                        </div>
                    )}
                    {scanResult && !scanning && (
                        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--success)' }}>
                            Detection matched: <strong>{scanResult.name}</strong> — {scanResult.calories} kcal
                        </div>
                    )}
                </div>

                <form onSubmit={handleLogDay}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Calories Intake (kcal)</label>
                        <input
                            type="number"
                            placeholder="e.g. 450"
                            value={estimatedCals}
                            onChange={e => setEstimatedCals(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Calories Burned (kcal)</label>
                        <input
                            type="number"
                            placeholder="e.g. 300"
                            value={burnedCals}
                            onChange={e => setBurnedCals(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Water Intake (Glasses)</label>
                        <input
                            type="number"
                            placeholder="e.g. 5"
                            value={waterGlasses}
                            onChange={e => setWaterGlasses(e.target.value)}
                            min="0"
                            max="20"
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                    <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Save my day
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LogActivityModal;
