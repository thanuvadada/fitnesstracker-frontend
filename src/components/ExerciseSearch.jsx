import React, { useState } from 'react';
import axios from 'axios';
import '../style/AddNewWorkout.css';

const ExerciseSearch = ({ addWorkoutExercise }) => {
    const [query, setQuery] = useState('');
    const [exerciseDetailsList, setExerciseDetailsList] = useState([]);

    const searchExercises = async (e) => {
        setQuery(e.target.value);
        if (e.target.value.length > 0) {
            const token = localStorage.getItem('token'); // or wherever you're storing the JWT token
            const response = await axios.get(`http://localhost:4040/api/exercise-details/search?query=${e.target.value}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setExerciseDetailsList(response.data.exerciseDetailsList);
        } else {
            setExerciseDetailsList([]);
        }
    };
    

    const selectExercise = (exerciseDetails) => {
        addWorkoutExercise(exerciseDetails);
        setExerciseDetailsList([]);
        setQuery('');
    };

    return (
        <div className='exercise-search'>
            <input
                type="text"
                value={query}
                onChange={searchExercises}
                placeholder="Search for an exercise"
                className="search-input"
            />
            {exerciseDetailsList.length > 0 && (
                <ul className="search-results">
                    {exerciseDetailsList.map(exercise => (
                        <li key={exercise.id} onClick={() => selectExercise(exercise)}>
                            {exercise.name}
                            <span>+</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ExerciseSearch;
