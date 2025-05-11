import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import Sidebar from "../components/Sidebar";
import "../style/MyProfile.css";
import LastWeekChart from "../components/LastWeekChart";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getLoggedInUser();
        setUser(response.user);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="my-profile">
      <Sidebar />
      {user ? (
        <div className="profile-details-right">
          <div className="profile-details-top">
            <div className="profile-details">
              <h1>{user.name},</h1>
              <div className="profile-details-body">
                <p>{user.age} years old</p>
                <p>{user.height} cm</p>
                <p>{user.weight} kg</p>
              </div>
            </div>
            <button onClick={handleEditProfile} className="edit-profile-button">
              Edit Profile
            </button>
          </div>
          
            <LastWeekChart />
          
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default MyProfile;
