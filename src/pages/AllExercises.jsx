import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import Sidebar from '../components/Sidebar';
import '../style/AllExercises.css';
import { FaChevronLeft, FaEye } from "react-icons/fa";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";


const ITEMS_PER_PAGE = 12; // Number of items per page

const AllExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await ApiService.getAllExercises();
                setExercises(data.exerciseDetailsList);
                setFilteredExercises(data.exerciseDetailsList);
                setTotalPages(Math.ceil(data.exerciseDetailsList.length / ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching exercises', error);
            }
        };

        fetchExercises();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [searchTerm, sortOption]);

    useEffect(() => {
        // Update total pages when filteredExercises changes
        setTotalPages(Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
    }, [filteredExercises]);

    const handleFilter = () => {
        let filtered = exercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortOption) {
            case 'name-asc':
                filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'difficulty-asc':
                filtered = filtered.sort((a, b) => a.difficulty - b.difficulty);
                break;
            case 'difficulty-desc':
                filtered = filtered.sort((a, b) => b.difficulty - a.difficulty);
                break;
            default:
                break;
        }

        setFilteredExercises(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleDelete = async (exerciseId) => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await ApiService.deleteExercise(exerciseId);
                setFilteredExercises(filteredExercises.filter((exercise) => exercise.id !== exerciseId));
                setTotalPages(Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error deleting exercise', error);
            }
        }
    };

    const paginatedExercises = filteredExercises.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="all-exercises-page">
            <Sidebar />
            <div className='all-exercises-page-right'>
                <div className='all-exercises-page-right-top'>
                    <h1>All Exercises</h1>
                </div>
                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="sort-select"
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="difficulty-asc">Difficulty (Low to High)</option>
                        <option value="difficulty-desc">Difficulty (High to Low)</option>
                    </select>
                </div>

                <div className="exercise-cards-container">
                    {paginatedExercises.map((exercise) => (
                        <div key={exercise.id} className="exercise-card">
                            <div className='exercise-card-h1p'>
                                <h1>{exercise.name}</h1>
                                <p>{exercise.description}</p>
                            </div>
                            <h2><span>Difficulty Level: </span>{exercise.difficulty}</h2>
                            <div className="exercise-card-buttons">
                                <Link to={`/exercise/${exercise.id}`} className="btn-view"><FaEye /></Link>
                                {ApiService.isAdmin() && (
                                    <div className='exercise-card-admin-btns'>
                                        <h1
                                            className="btn-edit"
                                            onClick={() => navigate(`/exercise/edit-exercise/${exercise.id}`)}
                                        >
                                            <MdModeEditOutline />
                                        </h1>
                                        <h1
                                            className="btn-delete"
                                            onClick={() => handleDelete(exercise.id)}
                                        >
                                            <MdDeleteForever />
                                        </h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <h2
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </h2>
                    <span>Page {currentPage} of {totalPages}</span>
                    <h2
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight />

                    </h2>
                </div>
            </div>
        </div>
    );
};

export default AllExercises;
