import React, { useState } from 'react';
import '../style/AddNewWorkout.css'

const AddSet = ({ addSet, exerciseType }) => {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [duration, setDuration] = useState('');

    const handleAddSet = () => {
        if (exerciseType === 'DYNAMIC' && reps && weight) {
            addSet({
                reps: parseInt(reps, 10),
                weight: parseFloat(weight),
            });
            setReps(''); 
            setWeight(''); 
        } else if (exerciseType === 'STATIC' && duration && weight) {
            addSet({
                duration: `PT${duration}S`,
                weight: parseFloat(weight),
            });
            setDuration(''); 
            setWeight('');
        } else {
            alert("Please fill out all required fields.");
        }
    };

    return (
        <div className='add-set'>
            <div className='add-set-inputs'>
            {exerciseType === 'DYNAMIC' && (
                <div>
                    
                    <input
                        type="number"
                        min={1}
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="Reps"
                    />
                </div>
            )}
            {exerciseType === 'STATIC' && (
                <div>
                    <input
                        type="number"
                        min={1}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Hold (sec)"
                    />
                </div>
            )}
            <div>
                <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Weight (kg)"
                />
            </div>
            </div>
            <button onClick={handleAddSet}> <span>+</span> Add Set</button>
        </div>
    );
};

export default AddSet;
