import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/ApiService';
import { Line } from 'react-chartjs-2';
import '../style/ExerciseDetail.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExerciseDetail = () => {
  const { exerciseDetailsId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const data = await ApiService.getExerciseDetailsById(exerciseDetailsId);
        setExercise(data.exerciseDetails);
      } catch (error) {
        console.error('Error fetching exercise details', error);
      }
    };

    const fetchWorkoutHistory = async () => {
      try {
        const loggedInUser = await ApiService.getLoggedInUser();
        const data = await ApiService.getWorkoutsByUserAndExercise(loggedInUser.user.id, exerciseDetailsId);
        setWorkoutHistory(data.workoutList);
      } catch (error) {
        console.error('Error fetching workout history', error);
      }
    };

    fetchExerciseDetails();
    fetchWorkoutHistory();
  }, [exerciseDetailsId]);

  useEffect(() => {
    if (workoutHistory.length > 0 && exercise) {
      const durationToSeconds = (durationString) => {
        if (!durationString) return 0;
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = durationString.match(regex);
        if (!matches) return 0;
        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        const seconds = parseInt(matches[3]) || 0;
        return (hours * 3600) + (minutes * 60) + seconds;
      };

      const labels = workoutHistory.map(workout => workout.date.split('T')[0]);
      const setsData = workoutHistory.map(workout => workout.exercises[0].sets.length);
      const repsData = exercise.type === 'DYNAMIC'
        ? workoutHistory.map(workout => workout.exercises[0].sets.reduce((total, set) => total + set.reps, 0))
        : [];
      const weightsData = workoutHistory.map(workout => Math.max(...workout.exercises[0].sets.map(set => set.weight)));
      const durationData = exercise.type === 'STATIC'
        ? workoutHistory.map(workout => {
            try {
              return workout.exercises[0].sets.reduce((total, set) => total + durationToSeconds(set.duration), 0);
            } catch (error) {
              console.error('Error processing duration:', error);
              return 0;
            }
          })
        : [];

      setChartData({
        responsive: true,
        maintainAspectRatio: false,
        labels: labels,
        datasets: [
          {
            label: 'Sets',
            data: setsData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            fill: true,
            yAxisID: 'y1',
          },
          {
            label: 'Reps',
            data: repsData,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderWidth: 1,
            fill: true,
            yAxisID: 'y1',
          },
          {
            label: 'Highest Weight',
            data: weightsData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 1,
            fill: true,
            yAxisID: 'y1',
          },
          {
            label: 'Duration (seconds)',
            data: durationData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
            fill: true,
            yAxisID: 'y2',
          },
        ].filter(dataset => dataset.data.length > 0),
      });
    }
  }, [workoutHistory, exercise]);

  if (!exercise) {
    return <p>Loading exercise details...</p>;
  }

  return (
    <div className="exercise-detail-page">
      <Sidebar />
      <div className="exercise-detail-page-right">
        <div className='exercise-detail-page-right-top'>
          <h1>{exercise.name}</h1>
          <p>{exercise.description}</p>
          <h2>Difficulty: {exercise.difficulty}</h2>
        </div>

        {chartData && chartData.labels && (
          <div className='exercise-detail-page-right-bottom'>
            <div className="chart-container">
              <Line data={chartData} options={{
                plugins: {
                  legend: {
                    labels: {
                      color: 'white',
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: 'white',
                    },
                  },
                  y1: {
                    type: 'linear',
                    position: 'left',
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: 'white',
                    },
                  },
                  y2: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: 'white',
                      callback: (value) => {
                        const minutes = Math.floor(value / 60);
                        const seconds = value % 60;
                        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                      },
                    },
                    beginAtZero: true,
                  },
                },
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetail;
