import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import Sidebar from '../components/Sidebar';
import '../style/AddNewExercise.css';
import { useParams } from 'react-router-dom';

const EditExercise = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('DYNAMIC'); // Default value
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('1'); // Default value
    const [exerciseId, setExerciseId] = useState(null);
    const { id } = useParams(); // Get ID from URL

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const exerciseDetails = await ApiService.getExerciseById(id);
                const exercise = exerciseDetails.exerciseDetails
                console.log(exercise)
                setName(exercise.name);
                setType(exercise.type);
                setDescription(exercise.description);
                setDifficulty(exercise.difficulty.toString());
                setExerciseId(exercise.id);
            } catch (error) {
                console.error('Error fetching exercise:', error);
                alert('Failed to load exercise details');
            }
        };

        fetchExercise();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedExercise = { name, type, description, difficulty: parseInt(difficulty, 10) };
            await ApiService.updateExercise(exerciseId, updatedExercise);
            alert('Exercise updated successfully!');
            window.location.href = '/exercises';
        } catch (error) {
            console.error('Error updating exercise:', error);
            alert('Failed to update exercise');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await ApiService.deleteExercise(exerciseId);
                alert('Exercise deleted successfully!');
                window.location.href = '/exercise-list'; // Navigate to another page if needed
            } catch (error) {
                console.error('Error deleting exercise:', error);
                alert('Failed to delete exercise');
            }
        }
    };

    return (
        <div className="add-exercise">
            <Sidebar />
            <div className="add-exercise-right">
                <div className="add-exercise-right-top">
                    <h1>Edit Exercise</h1>
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
                        <button className='add-exercise-btn' type="submit">Update Exercise</button>
                        <button
                            className='delete-exercise-btn'
                            type="button"
                            onClick={handleDelete}
                        >
                            Delete Exercise
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditExercise;
