import "../style/Sidebar.css";
import { Tooltip } from 'react-tooltip'
import ApiService from "../services/ApiService";
import { Link, useNavigate } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { TbGymnastics } from "react-icons/tb";
import { IoLogOutSharp } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";






const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        ApiService.logout();
        navigate('/login'); // Redirect to the login page
    }
}

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-top-logo">
          <Link className="sidebar-top-logo-heading" to='/dashboard' >calisthenix</Link>
        </div>
        <div className="sidebar-top-menu">
          <div>
            <Link to="/add-new-workout" className="sidebar-top-menu-item" >
              <AiOutlinePlus className="sidebar-dashboard-icon" />
              <span>New Workout</span>
            </Link>
          </div>
          <div>
            <Link to="/exercises" className="sidebar-top-menu-item">
              <TbGymnastics className="sidebar-exercise-icon" />
              <span>Exercises</span>
            </Link>
          </div>
          <div>
            <Link to="/workout-history" className="sidebar-top-menu-item">
              <MdHistory className="sidebar-profile-icon" />
              <span>My Workouts</span>
            </Link>
          </div>
          {ApiService.isAdmin() &&
          <div>
          <Link to="/add-new-exercise" className="sidebar-top-menu-item">
          <AiOutlinePlus className="sidebar-dashboard-icon" />
            <span>Add Exercise</span>
          </Link>
        </div>}
          <div>
            <Link to="/my-profile" className="sidebar-top-menu-item">
              <LuUser className="sidebar-profile-icon" />
              <span>Profile</span>
            </Link>
          </div>
          
        </div>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-logout">
          

          <button onClick={handleLogout}><IoLogOutSharp className="sidebar-logout-icon"/><span>Logout</span></button>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
