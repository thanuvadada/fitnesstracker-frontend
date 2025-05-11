import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import 'chart.js/auto'; // Ensure to include this for Chart.js 3.x

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const TopExerciseLineChart = () => {
  const [topExerciseId, setTopExerciseId] = useState(null);
  const [topExerciseName, setTopExerciseName] = useState('');
  const [topExerciseType, setTopExerciseType] = useState('');
  const [exerciseData, setExerciseData] = useState(null);
  const [chartData, setChartData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopExercise = async () => {
      try {
        const user = await ApiService.getLoggedInUser();

        const response = await ApiService.getWorkoutHistoryWithNames(user.user.id);

        if (response.statusCode === 200) {
          const workouts = response.workoutList;

          // Aggregate exercise data
          const exerciseMap = {};
          workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
              const exerciseName = exercise.exerciseDetailsName;
              if (exerciseMap[exerciseName]) {
                exerciseMap[exerciseName] += 1;
              } else {
                exerciseMap[exerciseName] = 1;
              }
            });
          });

          // Determine the top exercise
          const sortedExercises = Object.entries(exerciseMap).sort((a, b) => b[1] - a[1]);
          
          const topExercise = sortedExercises[0];

          if (topExercise) {
            const topExerciseName = topExercise[0];
            setTopExerciseName(topExerciseName);

            const topExerciseDetails = response.workoutList
              .flatMap(workout => workout.exercises)
              .find(exercise => exercise.exerciseDetailsName === topExerciseName);

            const topExerciseId = topExerciseDetails.exerciseDetailsId;
            const topExerciseType = topExerciseDetails.type; // Assuming 'type' is available in the data

            setTopExerciseId(topExerciseId);
            setTopExerciseType(topExerciseType);

            // Fetch workout data for the top exercise
            const exerciseResponse = await ApiService.getWorkoutsByUserAndExercise(user.user.id, topExerciseId);
            setExerciseData(exerciseResponse.workoutList);
          } else {
            setError("No exercises found.");
          }
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Error fetching exercise data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopExercise();
  }, []);

  useEffect(() => {
    if (exerciseData && topExerciseId) {

      // Prepare data for the line chart
      const labels = exerciseData.map(workout => workout.date.split('T')[0]); // Use workout dates as labels
      const setsData = exerciseData.map(workout => workout.exercises[0].sets.length || 0); // Number of sets
      const repsData = exerciseData.map(workout => workout.exercises[0].sets.reduce((total, set) => total + (set.reps || 0), 0)); // Total reps
      const weightsData = exerciseData.map(workout => Math.max(...workout.exercises[0].sets.map(set => set.weight || 0), 0)); // Highest weight
      const durationData = exerciseData.map(workout => workout.exercises[0].sets.reduce((total, set) => total + (new Date(`1970-01-01T${set.duration}Z`).getTime() / 1000 || 0), 0)); // Total duration in seconds

      const datasets = [
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
          label: 'Weight PR',
          data: weightsData,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderWidth: 1,
          fill: true,
          yAxisID: 'y1',
        },
      ];

      if (topExerciseType === 'DYNAMIC') {
        datasets.push({
          label: 'Reps',
          data: repsData,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderWidth: 1,
          fill: true,
          yAxisID: 'y1',
        });
      } else if (topExerciseType === 'STATIC') {
        datasets.push({
          label: 'Duration (seconds)',
          data: durationData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1,
          fill: true,
          yAxisID: 'y2',
        });
      }

      setChartData({
        labels: labels,
        datasets: datasets.filter(dataset => dataset.data.length > 0),
      });
    }
  }, [exerciseData, topExerciseId, topExerciseType]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='bar-chart-div'>
      <h2 className='dashboard-pie'>Favorite Exercise: {topExerciseName}</h2>
      {chartData && chartData.labels && (
        <div className="chart-container">
          <Line data={chartData} options={{
             responsive: true,
             maintainAspectRatio: false,
             aspectRatio: 1.5,
            plugins: {
              legend: {
                labels: {
                    color: '#ddf6c1',
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#ddf6c1'
                }, 
              },
              y1: {
                type: 'linear',
                position: 'left',
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#ddf6c1'
                }, 
              },
            },
          }} />
        </div>
      )}
    </div>
  );
};

export default TopExerciseLineChart;
