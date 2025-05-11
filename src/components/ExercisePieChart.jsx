import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import 'chart.js/auto'; // Ensure to include this for Chart.js 3.x

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ExercisePieChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        const user = await ApiService.getLoggedInUser();
        const response = await ApiService.getWorkoutHistoryWithNames(user.user.id);
        console.log(response)

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

          // Convert the exerciseMap to data for the pie chart
          const sortedExercises = Object.entries(exerciseMap).sort((a, b) => b[1] - a[1]);
          const topExercises = sortedExercises.slice(0, 5);
          const otherCount = sortedExercises.slice(5).reduce((acc, [_, count]) => acc + count, 0);

          const chartData = {
            labels: [...topExercises.map(([name]) => name), 'Others'],
            datasets: [
              {
                data: [...topExercises.map(([_, count]) => count), otherCount],
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40'
                ],
              }
            ]
          };

          setData(chartData);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Error fetching exercise data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutHistory();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className='dashboard-pie'>Top 5 Exercises</h2>
      {data && (
        <Pie
          data={data}
          options={{
            plugins: {
              legend: {
                labels: {
                  color: '#ddf6c1',
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ExercisePieChart;
