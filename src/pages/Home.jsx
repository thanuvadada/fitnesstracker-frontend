import Button from "../components/Button";
import "../style/Home.css";
import { LiaUnlockSolid } from "react-icons/lia";

import { GoArrowUp } from "react-icons/go";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { Link } from 'react-router-dom'
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { AiOutlineThunderbolt } from "react-icons/ai";






const Home = () => {
  return (
    <div className="home-page">
      <div className="home-top">
        
        <div className="home-top-content">
          <div className="home-top-content-text">
            <h1>calisthenix</h1>
            
          </div>
          <div className="home-top-content-card">
          <p>
            <span className="home-top-content-card-icon"><HiArrowTrendingUp
           /></span>
          <span>track your progress.</span>
            </p>
          <p>
            <span className="home-top-content-card-icon"><GoArrowUp  /></span>
          <span>
            level-up your skills.
          </span>
            </p>
          <p>
            <span className="home-top-content-card-icon">
            <LiaUnlockSolid className="home-top-content-card-icon-lock"/>
            </span>
            <span>unlock your potential.</span>
          
            </p>
          </div>
        </div>
      </div>
      <div className="home-bottom">
        <div className="home-bottom-boxes">
          <div className="home-bottom-box1">
            {/* <h1>calisthenix has the largest library of exercises to choose from. Pick your current level exercise progression and start tracking your progress!</h1> */}
          </div>
          <div className="home-bottom-box2">
          <AiOutlineThunderbolt />
            <h1>calisthenix has the largest library of exercises to choose from. Pick your current level exercise progression and start tracking your progress for every exercise you have done!</h1>
          </div>
          <div className="home-bottom-box3">
            <h1>Start your journey now!</h1>
            <Link className="register-button" to="/register">
            Register
            <IoArrowForwardCircleSharp />
            </Link>
            
          </div>
        </div>
        <div className="home-bottom-tape2">
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
        </div>
        <div className="home-bottom-tape">
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
          <p className="home-bottom-tape-text">calisthenix.</p>
        </div>
      </div>
      
    </div>
  );
};
export default Home;
