// BarChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ApiService from '../services/ApiService'; // Adjust import based on your folder structure

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch workout data and prepare chart data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = await ApiService.getLoggedInUser();
                const data = await ApiService.getWorkoutHistory(loggedInUser.user.id);
                const workouts = data.workoutList;

                // Prepare data for the chart
                const workoutDates = workouts.map(workout => new Date(workout.date).toLocaleDateString());
                const exerciseCounts = workouts.map(workout => workout.exercises.length);

                setChartData({
                    labels: workoutDates,
                    datasets: [
                        {
                            label: 'Number of Exercises',
                            data: exerciseCounts,
                            backgroundColor: 'rgba(128, 250, 1, 0.2)',
                            borderColor: 'rgba(128, 250, 1, 1)',
                            borderWidth: 1.5,
                        },
                    ],
                });
                setLoading(false);
            } catch (error) {
                setError('Error fetching workout data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='bar-chart-div'>
            <h2 className='dashboard-pie'>Exercises per Workout</h2>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    aspectRatio: 1.5,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#ddf6c1',
                            },
                        },
                        
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#ddf6c1'
                            }, 
                            stacked: true,
                        },
                        y: {
                            ticks: {
                                color: '#ddf6c1'
                            }, 
                            stacked: true,
                        },
                    },
                }}
            />
        </div>
    );
};

export default BarChart;
