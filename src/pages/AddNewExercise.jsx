import React, { useState } from 'react';
import ApiService from '../services/ApiService';
import Sidebar from '../components/Sidebar';
import '../style/AddNewExercise.css';

const AddNewExercise = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('DYNAMIC'); // Default value
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('1'); // Default value

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newExercise = { name, type, description, difficulty: parseInt(difficulty, 10) }; // Convert difficulty to number
            const response = await ApiService.addExercise(newExercise);
            alert('Exercise added successfully!');
            // Reset form or navigate to another page if needed
            setName('');
            setType('DYNAMIC'); // Reset to default value
            setDescription('');
            setDifficulty('1'); // Reset to default value
        } catch (error) {
            console.error('Error adding exercise:', error);
            alert('Failed to add exercise');
        }
    };

    return (
        <div className="add-exercise">
            <Sidebar />
            <div className="add-exercise-right">
                <div className="add-exercise-right-top">
                    <h1>Add New Exercise</h1>
                </div>
                <div className="add-exercise-form">
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </label>
                        <fieldset>
                            <legend>Type:</legend>
                            <label>
                                <input 
                                    type="radio" 
                                    value="DYNAMIC" 
                                    checked={type === 'DYNAMIC'} 
                                    onChange={(e) => setType(e.target.value)} 
                                />
                                DYNAMIC
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="STATIC" 
                                    checked={type === 'STATIC'} 
                                    onChange={(e) => setType(e.target.value)} 
                                />
                                STATIC
                            </label>
                        </fieldset>
                        <label>
                            Description:
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                            />
                        </label>
                        <label>
                            Difficulty:
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)} 
                                required
                            >
                                {[...Array(10).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button className='add-exercise-btn' type="submit">Add Exercise</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNewExercise;
