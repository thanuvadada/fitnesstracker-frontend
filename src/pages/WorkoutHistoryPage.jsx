import Sidebar from "../components/Sidebar"
import WorkoutHistory from "../components/WorkoutHistory"
import '../style/WorkoutHistoryPage.css'

const WorkoutHistoryPage = () => {
  return (
    <div className="workout-history-page">
        <Sidebar/>
        <div className="workout-history-page-content">
        <h2>Workout History</h2>
        <WorkoutHistory/>
        </div>
        
    </div>
  )
}
export default WorkoutHistoryPage