import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import Sidebar from '../components/Sidebar';
import '../style/EditProfile.css'

const EditProfile = () => {
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        height: '',
        weight: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the logged-in user data
        const fetchUser = async () => {
            try {
                const loggedInUser = await ApiService.getLoggedInUser();
                setUser({
                    id: loggedInUser.user.id || '',
                    name: loggedInUser.user.name || '',
                    email: loggedInUser.user.email || '',
                    password: '', // Leave password fields empty
                    confirmPassword: '',
                    age: loggedInUser.user.age || '',
                    height: loggedInUser.user.height || '',
                    weight: loggedInUser.user.weight || ''
                });
            } catch (error) {
                setErrorMessage('Error fetching user data');
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If password fields are empty, exclude password from the update
        let updatedUser = {
            name: user.name,
            email: user.email,
            age: user.age,
            height: user.height,
            weight: user.weight,
        };

        if (user.password) {
            if (user.password !== user.confirmPassword) {
                setErrorMessage("Passwords do not match");
                return;
            }
            updatedUser.password = user.password;
        }

        try {
            const response = await ApiService.updateUser(user.id, updatedUser);

            if (response.statusCode === 200) {
                setSuccessMessage('Profile updated successfully');
                setTimeout(() => navigate('/my-profile'), 2000);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage('Error updating profile');
        }
    };

    const handleDelete = async () => {
        // Ask for user confirmation before deleting the profile
        const confirmDelete = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        
        if (confirmDelete) {
            try {
                const response = await ApiService.deleteUser(user.id);
                if (response.statusCode === 200) {
                    setSuccessMessage('Profile deleted successfully');
                    setTimeout(() => navigate('/home'), 2000);
                } else {
                    setErrorMessage(response.message);
                }
            } catch (error) {
                setErrorMessage('Error deleting profile');
            }
        }
    };

    return (
        <div className="edit-profile-page">
            <Sidebar/>
            <div className='edit-profile-right'>
                <div className='edit-profile-heading'>
                    <h1>Edit Profile</h1>
                </div>
                {errorMessage && <div className="edit-profile-notification-error">{errorMessage}</div>}
                {successMessage && <div className="edit-profile-notification-success">{successMessage}</div>}
                <div className="edit-profile-card">
                    <form onSubmit={handleSubmit}>
                        <div className="edit-profile-input">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                required
                                placeholder="Preferred Name"
                            />
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                                placeholder="Email"
                            />
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                            />
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={user.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                            />
                            <div className="edit-profile-input-2-and-buttons">
                                <div className='edit-profile-input-2'>
                                <div className="edit-profile-age">
                                    <label>Age <span>(yr)</span></label>
                                    <input
                                        className="edit-profile-number"
                                        type="number"
                                        name="age"
                                        min={10}
                                        value={user.age}
                                        onChange={handleChange}
                                        required
                                        placeholder="10"
                                    />
                                </div>
                                <div className="edit-profile-age">
                                    <label>Height <span>(cm)</span></label>
                                    <input
                                        className="edit-profile-number"
                                        type="number"
                                        name="height"
                                        min={100}
                                        value={user.height}
                                        onChange={handleChange}
                                        required
                                        placeholder="100"
                                    />
                                </div>
                                <div className="edit-profile-age">
                                    <label>Weight <span>(kg)</span></label>
                                    <input
                                        className="edit-profile-number"
                                        type="number"
                                        name="weight"
                                        min={20}
                                        value={user.weight}
                                        onChange={handleChange}
                                        required
                                        placeholder="20"
                                    />
                                </div>
                                </div>
                                <div className='edit-profile-buttons'>
                                <button className="edit-profile-submit" type="submit">Update Profile</button>
                                <button className="edit-profile-delete" onClick={handleDelete}>Delete Profile</button>
                            </div>
                            </div>
                            
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
