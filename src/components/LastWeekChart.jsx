import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ApiService from '../services/ApiService';

const LastWeekChart = () => {
    const [user, setUser] = useState(null);
    const [exerciseCounts, setExerciseCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.getLoggedInUser();
                setUser(response.user);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchWorkoutHistory = async () => {
            if (user && user.id) {
                try {
                    const response = await ApiService.getWorkoutHistory(user.id);
                    if (response.statusCode === 200) {
                        const workouts = response.workoutList;

                        // Get the last 7 days
                        const last7Days = Array.from({ length: 7 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - i);
                            return date.toISOString().split('T')[0];
                        }).reverse();

                        const exerciseCountMap = last7Days.reduce((acc, date) => {
                            acc[date] = 0;
                            return acc;
                        }, {});

                        workouts.forEach(workout => {
                            const workoutDate = workout.date.split('T')[0];
                            if (exerciseCountMap.hasOwnProperty(workoutDate)) {
                                exerciseCountMap[workoutDate] += workout.exercises.length;
                            }
                        });

                        const counts = last7Days.map(date => exerciseCountMap[date]);
                        setExerciseCounts(counts);
                    } else {
                        setError(response.message);
                    }
                } catch (error) {
                    setError("Error fetching workout history.");
                }
                setLoading(false);
            }
        };

        fetchWorkoutHistory();
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const data = {
        labels: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i)); // Last 7 days
            return date.toLocaleDateString(undefined, { weekday: 'short' });
        }),
        datasets: [
            {
                label: 'Number of Exercises',
                data: exerciseCounts,
                backgroundColor: '#80fa01',
                hoverBackgroundColor: '#ddf6c1',
                hoverBorderColor: '#ddf6c1',
                borderColor: '#80fa01',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: '#ddf6c1', 
                },
                grid: {
                    color: '#3a3b3b', 
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#ddf6c1',
                },
                grid: {
                    color: '#3a3b3b',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ddf6c1',
                },
            },
        },
    };

    return (
        <div className="last-week-chart">
            <div className='last-week-chart-color'>
            <h1 className='seven-days-summary'>Last 7 Days Summary:</h1>
            <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default LastWeekChart;
