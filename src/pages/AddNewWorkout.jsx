import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseSearch from '../components/ExerciseSearch';
import AddSet from '../components/AddSet';
import Sidebar from '../components/Sidebar';
import '../style/AddNewWorkout.css';
import '../style/Dashboard.css';
import axios from 'axios';
import ApiService from "../services/ApiService";
import { IoIosRemoveCircle } from "react-icons/io";

// Utility function to parse ISO 8601 duration and convert it to seconds
const parseISO8601Duration = (duration) => {
    const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    const match = regex.exec(duration);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return (hours * 3600) + (minutes * 60) + seconds;
};

// Utility function to format seconds into minutes and seconds
const formatDuration = (seconds) => {
    if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds} sec`;
    }
    return `${seconds} sec`;
};

const AddNewWorkout = () => {
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const addWorkoutExercise = (exerciseDetails) => {
        setWorkoutExercises([...workoutExercises, { exerciseDetails, sets: [] }]);
    };

    const addSetToExercise = (index, newSet) => {
        const updatedExercises = [...workoutExercises];
        updatedExercises[index].sets.push(newSet);
        setWorkoutExercises(updatedExercises);
    };

    const removeSetFromExercise = (exerciseIndex, setIndex) => {
        const updatedExercises = workoutExercises.map((we, index) =>
            index === exerciseIndex
                ? { ...we, sets: we.sets.filter((_, sIndex) => sIndex !== setIndex) }
                : we
        );
        setWorkoutExercises(updatedExercises);
    };

    const removeExercise = (exerciseIndex) => {
        const updatedExercises = workoutExercises.filter((_, index) => index !== exerciseIndex);
        setWorkoutExercises(updatedExercises);
    };

    const saveWorkout = async () => {
        try {
            const loggedInUser = await ApiService.getLoggedInUser();
            const userId = loggedInUser.user.id;

            const now = new Date();
            const workoutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const workoutDate = now.toLocaleDateString();
            const workoutName = `${workoutTime} Workout, ${workoutDate}`;

            const workoutDTO = {
                name: workoutName,
                date: now.toISOString(),
                userId: userId,
                exercises: workoutExercises.map((we) => ({
                    exerciseDetailsId: we.exerciseDetails.id,
                    sets: we.sets.map((set) => ({
                        reps: set.reps !== undefined ? set.reps : null,
                        duration: set.duration !== undefined ? set.duration.toString() : null,
                        weight: set.weight !== undefined ? set.weight : 0.0,
                    })),
                })),
            };

            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:4040/api/workouts', workoutDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200 || response.status === 201) {
                setMessage('Workout added successfully');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                console.error('Failed to save workout');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className='dashboard-full'>
            {message && <div className='success-message'>{message}</div>}
            <Sidebar />
            <div className='dashboard2'>
                <div className="new-workout-header">
                <h1>+ New Workout</h1>
                <button className='add-new-workout-done-button' onClick={saveWorkout}>Done</button>
                </div>
               
                <div className='add-new-workout'>
                    <div className='add-new-workout-2'>
                        <ExerciseSearch addWorkoutExercise={addWorkoutExercise} />
                        <div className='selected-exercises'>
                            <h3>Selected Exercises</h3>
                            <ul className='selected-exercises-list'>
                                {workoutExercises.map((we, index) => (
                                    <li className='selected-ex-li' key={index}>
                                        <div className='selected-exercise-heading'>
                                            <h4>{we.exerciseDetails.name}</h4>
                                            <IoIosRemoveCircle className='remove-button' onClick={() => removeExercise(index)} />
                                        </div>
                                        <AddSet
                                            addSet={(newSet) => addSetToExercise(index, newSet)}
                                            exerciseType={we.exerciseDetails.type}
                                        />
                                        <ul className='reps-list-ul'>
                                            {we.sets.map((set, setIndex) => (
                                                <li className='reps-list' key={setIndex}>
                                                    {we.exerciseDetails.type === 'DYNAMIC' && `${set.reps} reps x `}
                                                    {we.exerciseDetails.type === 'STATIC' && `${formatDuration(parseISO8601Duration(set.duration))} x `}
                                                    {`${set.weight} kg`}
                                                    <IoIosRemoveCircle className='remove-button' onClick={() => removeSetFromExercise(index, setIndex)} />
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AddNewWorkout;
