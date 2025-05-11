import Sidebar from '../components/Sidebar';
import '../style/Dashboard.css';
import ApiService from '../services/ApiService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LastWeekChart from '../components/LastWeekChart';
import ExercisePieChart from '../components/ExercisePieChart';
import BarChart from '../components/BarChart';
import TopExerciseLineChart from '../components/TopExerciseLineChart';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndWorkoutHistory = async () => {
      try {
        const response = await ApiService.getLoggedInUser();
        setUser(response.user);

        const workoutResponse = await ApiService.getWorkoutHistory(response.user.id);
        setWorkoutHistory(workoutResponse.workoutList || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchUserAndWorkoutHistory();
  }, []);

  return (
    <div className='dashboard-full'>
      <Sidebar />
      <div className='dashboard'>
        {user ? (
          <>
            <h1 className='dashboard-hello'>Hello, {user.name}</h1>
          </>
        ) : (
          <h1 className='dashboard-hello'>Hello</h1>
        )}
        
        {workoutHistory.length > 0 ? (
          <div className='dashboard-bento'>
            <div className="bento-1">
              <ExercisePieChart />
            </div>
            <div className="bento-2">
              <BarChart />
            </div>
            <div className="bento-3">
              <TopExerciseLineChart />
            </div>
          </div>
        ) : (
          <div className="no-workouts-message">
            <h2>Start Tracking your Calisthenics progress now!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
